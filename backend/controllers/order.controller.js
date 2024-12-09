import { Order } from '../models/order.model.js';  // Assuming you have an Order model
import createTransporter from '../mails/email.config.js';
import { ORDER_CONFIRMATION_EMAIL_TEMPLATE } from '../mails/emailTemplates.js';
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {

    const userId = req.user.id; // User ID extracted from the token

    const {
      user,          // Should include userId, email, name, and phone
      totalAmount,
      orderItems,
      paymentReference,
      paymentStatus,
      deliveryDate,
      orderId,
      trackingId,
    } = req.body;

    // Create a new order instance with the necessary fields
    const newOrder = new Order({
      orderId,
      trackingId,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      totalAmount,
      orderItems,
      paymentReference,
      paymentStatus,
      deliveryDate,  // Add delivery date
      orderedBy: userId,  // Reference the userId for ownership
    });

    // Save the order to the database
    await newOrder.save();

    // Send an order confirmation email
    await sendOrderConfirmationEmail(user.email, user.name, orderId, trackingId, orderItems, totalAmount, deliveryDate);

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Function to send an order confirmation email
export const sendOrderConfirmationEmail = async (
    email,
    name,
    orderId,
    trackingId,
    orderItems,
    totalAmount,
    deliveryDate
  ) => {
    try {
      const orderDate = new Date().toLocaleDateString(); // Current date
  
      // Format order items into a list for email content
      const exchangeRate = 1700;

     const formattedOrderItems = orderItems
     .map((item) => {
     const convertedPrice = item.salePrice * exchangeRate;  // Multiply first
     return `<li>${item.name} - ${item.quantity} pcs - NGN ${convertedPrice.toLocaleString()}</li>`;  // Format after calculation
     })
     .join('');

  
      // Email content with dynamic placeholders
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Order Confirmation - Echobazar',
        html: ORDER_CONFIRMATION_EMAIL_TEMPLATE
          .replace('{name}', name)
          .replace('{orderId}', orderId)
          .replace('{trackingId}', trackingId)
          .replace('{orderDate}', orderDate)
          .replace('{deliveryDate}', deliveryDate)
          .replace('{orderItems}', formattedOrderItems)
          .replace('{totalAmount}', `${totalAmount.toLocaleString()}`),
      };
  
      const transporterInstance = await createTransporter();
      await transporterInstance.sendMail(mailOptions);
  
      console.log('Order confirmation email sent successfully.');
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  };
  
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;  // Extract the user ID from the token

    // Fetch orders belonging to the logged-in user
    const userOrders = await Order.find({ orderedBy: userId }).sort({ createdAt: -1 });

    if (userOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(userOrders);  // Return the orders
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderHistoryForSellers = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, search = "", sort = "orderDate", order = "desc" } = req.query;

  try {
    const skip = (page - 1) * limit;

    const orders = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems._id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          "productDetails.postedBy": new mongoose.Types.ObjectId(userId),
          ...(search && {
            "productDetails.name": { $regex: search, $options: "i" },
          }),
        },
      },
      {
        $addFields: {
          "orderItems.totalAmount": {
            $multiply: ["$orderItems.salePrice", "$orderItems.quantity"], // price * quantity
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "orderedBy",
          foreignField: "_id",
          as: "buyerDetails",
        },
      },
      { $unwind: "$buyerDetails" },
      {
        $sort: { [sort]: order === "desc" ? -1 : 1 },
      },
      // Group by orderId to merge items with the same order
      {
        $group: {
          _id: "$_id", // Order ID
          orderId: { $first: "$orderId" },
          trackingId: { $first: "$trackingId" },
          orderDate: { $first: "$orderDate" },
          paymentStatus: { $first: "$paymentStatus" },
          orderedBy: { $first: "$orderedBy" },
          buyerDetails: { $first: "$buyerDetails" },
          orderItems: { $push: "$orderItems" },
        },
      },
      {
        $sort: { [sort]: order === "desc" ? -1 : 1 },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
          data: [{ $skip: skip }, { $limit: Number(limit) }],
        },
      },
    ]);

    res.json(orders[0] || { metadata: { total: 0, page: 1 }, data: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

export const getCustomersForSeller = async (req, res) => {
  const userId = req.user.id; 
  const { search = "" } = req.query;

  try {
    const customers = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems._id", // Match the order item with the product
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          "productDetails.postedBy": new mongoose.Types.ObjectId(userId), // Filter orders with products posted by the seller
          ...(search && {
            "productDetails.name": { $regex: search, $options: "i" }, // Search filter on product name
          }),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "orderedBy",
          foreignField: "_id",
          as: "buyerDetails", // Get the buyer's details
        },
      },
      { $unwind: "$buyerDetails" },
      {
        $group: {
          _id: "$buyerDetails._id", // Group by buyer ID to get unique customers
          buyerDetails: { $first: "$buyerDetails" },
          totalOrders: { $sum: 1 }, // Count how many orders each customer has made
          totalSpent: {
            $sum: {
              $multiply: ["$orderItems.salePrice", "$orderItems.quantity"], // Calculate the total spent by the customer
            },
          },
        },
      },
    ]);

    res.json(customers || { data: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers", details: error.message });
  }
};


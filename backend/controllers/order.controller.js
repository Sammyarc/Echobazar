import { Order } from '../models/order.model.js';  // Assuming you have an Order model
import createTransporter from '../mails/email.config.js';
import { ORDER_CONFIRMATION_EMAIL_TEMPLATE } from '../mails/emailTemplates.js';

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
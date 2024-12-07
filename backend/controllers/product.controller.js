import { response } from 'express';
import { Product } from '../models/product.model.js';
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
    try {
        // Destructure the request body
        const { name, regularPrice, salePrice, productSummary, description, categories, quantity, benefits, additionalDescription } = req.body;

        // Extract the user ID from req.user set by verifyToken
        const userId = req.user?.id;

        // Validate user ID
        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        // Check if user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Validate input data
        if (!name || !regularPrice || !salePrice || !description || !categories || !quantity || !additionalDescription || !benefits) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Extract image URLs from uploaded files
        const imageUrls = req.files?.map(file => file.path) || [];
        if (imageUrls.length === 0) {
            return res.status(400).json({ error: "At least one image is required." });
        }


       // Handle benefits: convert to array if it's a string
       const benefitArray = Array.isArray(benefits)
       ? benefits.map((cat) => cat.trim())
       : benefits.split(',').map((cat) => cat.trim());


        // Handle categories: convert to array if it's a string
        const categoryArray = Array.isArray(categories)
            ? categories.map((cat) => cat.trim())
            : categories.split(',').map((cat) => cat.trim());
    

        // Create a new product instance
        const newProduct = new Product({
            name,
            regularPrice,
            salePrice,
            quantity,
            productSummary,
            description,
            benefits: benefitArray,
            additionalDescription,
            categories: categoryArray,
            images: imageUrls,
            postedBy: user._id, // Reference the user ID
          });
          

        // Save the product to the database
        await newProduct.save();

        // Respond with the created product
        return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Retrieve all products

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
            });
        }

        res.status(200).json({
            success: true,
            products, // Send the array of products
        });
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message, // Include error details for debugging
        });
    }
};


export const getProductsByUser = async (req, res) => {
    const userId = req.user?.id; // Extract userId from req.user set by verifyToken

    try {
        // Find products associated with the user's ID in the `postedBy` field
        const products = await Product.find({ postedBy: userId });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this user.' });
        }

        return res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};


export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;

        // Find products that have the specified category in the categories array
        const products = await Product.find({ categories: { $in: [categoryName] } });

        if (products.length === 0) {
            return res.status(404).json({ error: `No products found for category ${categoryName}` });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error retrieving products by category:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getProductsByName = async (req, res) => {
    const { name } = req.query;

  try {
    // Find the product by name
    const product = await Product.findOne({ name });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Respond with the product ID
    res.json({ id: product._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, regularPrice, salePrice, productSummary, description, categories, quantity, benefits, additionalDescription } = req.body;

        // Log request body to ensure we have the correct data
        console.log("Received data for update:", req.body);
        
        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update product details
        product.name = name || product.name;
        product.regularPrice = regularPrice || product.regularPrice;
        product.salePrice = salePrice || product.salePrice;
        product.quantity = quantity || product.quantity;
        product.productSummary = productSummary || product.productSummary;
        product.description = description || product.description;
        product.additionalDescription = additionalDescription || product.additionalDescription;

        // Handle categories
        product.categories = Array.isArray(categories) 
            ? categories 
            : categories && typeof categories === 'string' 
                ? categories.split(',') 
                : product.categories;

        // Handle benefits
        product.benefits = Array.isArray(benefits)
            ? benefits
            : benefits && typeof benefits === 'string'
                ? benefits.split(',')
                : product.benefits;

        // Handle image updates: replace old images with new ones if uploaded
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path);
            product.images = newImageUrls.slice(0, 3); // Limit to 3 images
        }

        // Save updated product
        const updatedProduct = await product.save();
        console.log("Updated product:", updatedProduct); // Log the updated product

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the product exists and delete it
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const categoryCountsByAdmin = async (req, res) => {
    try {
        const userId = req.user.id; // User ID extracted from the token

        // Fetch category counts using MongoDB aggregation
        const categoryCounts = await Product.aggregate([
            {
                $match: {
                    postedBy: new mongoose
                        .Types
                        .ObjectId(userId)
                }
            }, { // Match products posted by the user
                $unwind: "$categories"
            }, { // Unwind the array of categories
                $group: {
                    _id: "$categories",
                    count: {
                        $sum: 1
                    }, // Count products in each category
                }
            }
        ]);

        res.json({success: true, data: categoryCounts});
    } catch (error) {
        console.error("Error fetching category stats:", error);
        res
            .status(500)
            .json({success: false, message: "Server error"});
    }
};
  
export const getCategoryCount = async (req, res) => {
    try {
        // Fetch category counts using MongoDB aggregation
        const categoryCounts = await Product.aggregate([
            {
                $unwind: "$categories"
            }, { // Unwind the categories array
                $group: {
                    _id: "$categories", // Group by category name
                    count: {
                        $sum: 1
                    }, // Count the number of products in each category
                }
            }, {
                $sort: {
                    _id: 1
                }
            }, // Sort alphabetically by category name (optional)
        ]);

        // Map the data to match your frontend structure
        const formattedCategories = categoryCounts.map(
            (cat) => ({name: cat._id, count: cat.count})
        );

        res.json({success: true, data: formattedCategories});
    } catch (error) {
        console.error("Error fetching category stats:", error);
        res
            .status(500)
            .json({success: false, message: "Server error"});
    }
};  
  
export const getProductTotal = async (req, res) => {
    try {
        // Count the total number of products in the database
        const totalProducts = await Product.countDocuments({});
    
        res.json({ success: true, total: totalProducts });
      } catch (error) {
        console.error("Error fetching total products:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
};
  

export const getRelatedProducts = async (req, res) => {
    const { categories } = req.query;
    try {
        const relatedProducts = await Product.find({ 
            categories: { $in: categories.split(',') }, 
            _id: { $ne: req.query.excludeId } // Optional: Exclude current product
        });
        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch related products' });
    }
};
  
export const getNewestProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.json(products);
      } catch (error) {
        res.status(500).send('Server error');
      }
};
    
export const toggleProductInWishlist = async (req, res) => {
    const userId = req.user.id; // Retrieved from middleware
    const { productId } = req.body;
  
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Ensure the wishlist is initialized as an array
      if (!Array.isArray(user.wishlist)) {
        user.wishlist = [];
      }
  
      const productExists = user.wishlist.some((id) => id.toString() === productId.toString());
  
      if (productExists) {
        // Remove product if it exists
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
      } else {
        // Add product if it doesn't exist
        user.wishlist.push(productId);
      }
  
      await user.save();
  
      return res.status(200).json({
        message: productExists ? "Product removed from wishlist" : "Product added to wishlist",
        wishlist: user.wishlist,
        wishlistCount: user.wishlist.length, // Include updated count
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id; // Get user ID from authenticated session or token
    
        // Find the user and remove the product from their wishlist
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Remove the product from the wishlist
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
    
        await user.save(); // Save the updated user document
    
        return res.status(200).json({ 
            message: 'Product removed from wishlist',
            wishlist: user.wishlist,
            wishlistCount: user.wishlist.length, // Include updated count
         });
      } catch (error) {
        return res.status(500).json({ message: 'Server error' });
      }

  };

  export const isInWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // User from authenticated session or token
        const { productId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const isInWishlist = user.wishlist.some(item => item._id.toString() === productId);
        res.status(200).json({ isInWishlist });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
  };
  
  export const wishlist = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Fetch the user's wishlist (array of product IDs)
      const user = await User.findById(userId).select('wishlist');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Populate wishlist with product details
      const products = await Product.find({ _id: { $in: user.wishlist } });
  
      res.status(200).json({
        wishlist: products, // Send product details
        wishlistCount: user.wishlist.length, // Include the count
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch wishlist products', error: error.message });
    }
  };
  

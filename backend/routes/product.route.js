import express from "express";
import {
  categoryCountsByAdmin,
    createProduct,
    deleteProductById,
    getAllProducts,
    getCategoryCount,
    getProductById,
    getProductsByCategory,
    getProductsByName,
    getProductsByUser,
    getProductTotal,
    updateProductById
} from '../controllers/product.controller.js';
import {uploadProducts} from '../middleware/multer.js';
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

// Endpoint to post a product with multiple images
router.post('/post-a-product', verifyToken, uploadProducts, createProduct);

// Get all products
router.get('/get-all-products', getAllProducts);

// Get all products by user
router.get('/products/user', verifyToken, getProductsByUser);

// Get products by category
router.get('/products/category/:categoryName', getProductsByCategory);

// Get product by ID
router.get('/products/:id', getProductById);

// Get product by name
router.get('/products', getProductsByName);

// Update product by ID
router.put('/products/:id', uploadProducts, verifyToken, updateProductById);

// Delete product by ID
router.delete('/products/:id', verifyToken, deleteProductById);

// Get categories count for an admin account
router.get("/admin/category-stats", verifyToken, categoryCountsByAdmin);

// Get categories count for all categories
router.get("/category-count", getCategoryCount);

// Get the total number of products
router.get("/products-total", getProductTotal);


export default router;

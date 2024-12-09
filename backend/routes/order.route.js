import express from "express";
import { createOrder, getCustomersForSeller, getOrderHistoryForSellers, getOrdersByUser, sendOrderConfirmationEmail } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Post all orders to the backend and send confirmation email
router.post('/orders', verifyToken, createOrder, sendOrderConfirmationEmail);

// Get order posted by a specific user
router.get("/user/orders", verifyToken, getOrdersByUser)

// Get order of products posted by a specific seller
router.get("/seller/orders", verifyToken, getOrderHistoryForSellers)

// Get customers of products posted by a specific seller
router.get("/customers", verifyToken, getCustomersForSeller)

export default router;
import express from "express";
import { createOrder, sendOrderConfirmationEmail } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all products
router.post('/orders', verifyToken, createOrder, sendOrderConfirmationEmail);

export default router;
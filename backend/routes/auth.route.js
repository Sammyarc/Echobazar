import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	googleSignIn,
	googleCheck,
	countdownDate,
	getProfile,
	updateProfile,
	updateUserDetails,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadProfilePicture } from "../middleware/multer.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, uploadProfilePicture, updateProfile);
router.put("/user-details", verifyToken, updateUserDetails);
router.post("/signup", signup);
router.get("/google-check", googleCheck);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-signin", googleSignIn);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.get("/get-countdown-date", countdownDate)

router.post("/reset-password/:token", resetPassword);

export default router;

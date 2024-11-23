import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mails/emails.js";
import { User } from "../models/user.model.js";
import { getTargetDate } from "./getTargetDate.js";



export const signup = async (req, res) => {
	const { email, password, name, role } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			role,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(email, name, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const googleSignIn = async (req, res) => {
	try {
		const { token, role } = req.body; // Accept role from the request

		// Verify the Google token
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload(); // Extract user details from token
		const { email, name } = payload;

		// Check if the user already exists
		let user = await User.findOne({ email });

		if (!user) {
			// If user doesn't exist, create a new user with the provided role
			user = new User({
				email,
				name,
				role, // Assign the role (user/admin) during account creation
				isVerified: true, // Automatically verify Google users
				isGoogleUser: true, // Indicate that this user signed up via Google
			});
			await user.save();

			console.log("New user created with role:", user.role);

			await sendWelcomeEmail(user.email, user.name);
		}

		// Update the user's last login time
		user.lastLogin = new Date();
		await user.save();

		// Generate a JWT and set it as an HTTP-only cookie
		generateTokenAndSetCookie(res, user._id);

		// Return success response with user data
		res.status(200).json({
			success: true,
			message: "Google sign-in successful",
			user: {
				...user._doc,
				password: undefined, // Exclude password from the response
			},
		});
	} catch (error) {
		console.error("Error in googleSignIn:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!email || !password) {
            throw new Error("All fields are required");
        }

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,  // Hide password
            },
        });
    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!email) {
			throw new Error("Please input a valid email address");
		}

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, user.name, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email, user.name);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const googleCheck = async (req, res) => {
	
	try {
		const { email } = req.query; // Extract email from query params

        const user = await User.findOne({ email }); 

        if (user) {
            return res.status(200).json({ user }); // Return user object if found
        } else {
            return res.status(200).json({ user: null }); // User not found
        }
    } catch (error) {
        console.error("Error checking user:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const countdownDate = (req, res) => {
    const targetDate = getTargetDate();
    res.json({ targetDate });
};

export const getProfile = async (req, res) => {
	try {
	  const userId = req.user.id; // Assuming `req.user` contains authenticated user's ID
	  const user = await User.findById(userId).select("-password"); // Exclude password
  
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  res.status(200).json(user);
	} catch (error) {
	  res.status(500).json({ message: "Error retrieving profile", error });
	}
  };
  
export const updateProfile = async (req, res) => {
	try {
	  const userId = req.user.id; // Assuming `req.user` contains authenticated user's ID
	  const { name, phone, address, state, city, country, gender, dateOfBirth, localGovernment, twitter, instagram, facebook, tiktok  } = req.body;
  
	  const profileImageUrl = req.file ? req.file.path : ''; 
  
	  // Update user details
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{
		  name,
		  phone,
		  address,
		  state,
		  city,
		  country,
		  gender,
		  dateOfBirth,
		  localGovernment,
		  twitter,
		  instagram,
		  facebook,
		  tiktok,
		  ...(profileImageUrl && { profileImage: profileImageUrl }), // Update profileImage if new URL exists
		},
		{ new: true, runValidators: true } // Return updated document and validate
	  ).select("-password"); // Exclude password
  
	  if (!updatedUser) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  res.status(200).json(updatedUser);
	} catch (error) {
	  res.status(500).json({ message: "Error updating profile", error });
	}
};


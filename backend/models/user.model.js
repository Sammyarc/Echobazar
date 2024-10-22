import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: function() { return !this.isGoogleUser; }, // Optional if user is from Google
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		isGoogleUser: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ['buyer', 'seller'], // Restrict role values to 'buyer' or 'seller'
			required: true, // Ensure that a role is provided
			default: 'buyer', // Default role can be 'buyer' if not specified
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);

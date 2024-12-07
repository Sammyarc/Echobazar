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
			required: function () {
				return !this.isGoogleUser;
			}, // Password is optional if user signs up via Google
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
			enum: ['user', 'admin'], // Restricted to 'user' or 'admin'
			required: true, // Role is required
			default: 'user', // Default role
		},
		phone: {
			type: String,
		},
		country: {
			type: String,
		},
		localGovernment: {
			type: String,
		},
		address: {
			type: String,
		},
		state: {
			type: String,
		},
		city: {
			type: String,
		},
		zipCode: {
			type: String,
		},
		dateOfBirth: {
			type: String,
		},
		gender: {
			type: String,
		},
		twitter: {
			type: String,
		},
		instagram: {
			type: String,
		},
		facebook: {
			type: String,
		},
		tiktok: {
			type: String,
		},
		profileImage: {
			type: String, // URL of the profile picture
		},
		wishlist: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			default: []
		  }]
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);

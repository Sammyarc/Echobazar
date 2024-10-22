import { create } from "zustand";
import axios from "axios";

// Set the API URL based on the environment
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

// Zustand store for authentication
export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,        // To store any error messages
	isLoading: false,   // To track loading state for async operations
	isCheckingAuth: true,
	message: null,      // To display success messages (like password reset or email verification)
	
	// Function to clear error state
	clearError: () => {
		set({ error: null });
	},


	// Signup function
	signup: async (email, password, name, role) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name, role });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	// googleSignIn function with role
googleSignIn: async (token, role) => {  // Accept role as an additional parameter
    set({ isLoading: true, error: null });
    try {
        // Send the Google token and the selected role to the server
        const response = await axios.post(`${API_URL}/google-signin`, { token, role });

        set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
        });
    } catch (error) {
        set({ 
            error: error.response?.data?.message || "Error signing in with Google", 
            isLoading: false 
        });
        throw error;
    }
},

	// Login function
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	// Logout function
	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	// Check if user is authenticated
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch {
			set({ isCheckingAuth: false, isAuthenticated: false });
		}
	},

	// Verify email function
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},

	// Function to send a forgot password request
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error sending reset password email",
			});
			throw error;
		}
	},

	// Function to reset password
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error resetting password",
			});
			throw error;
		}
	},
}));

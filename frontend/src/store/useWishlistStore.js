import { create } from 'zustand';
import axios from 'axios';

// Set the API URL based on the environment
const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "https://echobazar-fn59.vercel.app/api";

axios.defaults.withCredentials = true;

// Function to fetch the wishlist details
const fetchWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist-details`);

    if (response.data && response.data.wishlist) {
      return {
        products: response.data.wishlist, // Array of product details
        wishlistCount: response.data.wishlistCount, // Count of wishlist items
      };
    }

  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { products: [], wishlistCount: 0 };
  }
};

// Zustand store
const useWishlistStore = create((set) => ({
  loading: false,
  wishlist: [], // Array of product details
  wishlistCount: 0, // Count of wishlist items

  // Fetch the wishlist data from the backend
  initializeWishlist: async () => {
    set({ loading: true });
    const { products, wishlistCount } = await fetchWishlist();
    set({ wishlist: products, wishlistCount, loading: false });
  },

  // Add or remove the product from the wishlist
  addToWishlist: async (product) => {
    try {
      const productId = product._id;

      // Send request to backend to add/remove the product from the wishlist
      const response = await axios.put(`${API_URL}/add-to-wishlist`, { productId });

      // Assuming the backend returns the updated wishlist and wishlistCount
      const { wishlist, wishlistCount } = response.data;

      // Update the state with the new wishlist data from the backend
      set({
        wishlist: wishlist, // Updated list of products
        wishlistCount: wishlistCount, // Updated wishlist count
      });

    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  },

  removeFromWishlist: async (product) => {
    try {

      // Ensure the product has an 'id' field mapped from '_id'
      const productToRemove = { ...product, id: product._id };

      if (!productToRemove) {
        throw new Error("Product ID is required");
      }
  
      // Send request to backend to remove the product from the wishlist
      const response = await axios.delete(`${API_URL}/wishlist/${productToRemove.id}`);
  
      // Assuming the backend returns the updated wishlist and wishlistCount
      const { wishlist, wishlistCount } = response.data;
  
      // Update the state with the new wishlist data from the backend
      set({
        wishlist: wishlist, // Updated list of products
        wishlistCount: wishlistCount, // Updated wishlist count
      });
  
      console.log("Product removed successfully from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error.response?.data?.message || error.message);
    }
  },
  
}));

export default useWishlistStore;

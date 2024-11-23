import { create } from 'zustand';
import Cookies from 'js-cookie';

// Helper to get cart from cookies
const getCartFromCookies = () => {
  const storedCart = Cookies.get('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

// Zustand store
const useCartStore = create((set) => ({
  cart: getCartFromCookies(), // Initialize cart with cookie data
  totalItemCount: getCartFromCookies().length, // Initialize count based on stored cart

  // Set the initial cart from cookies or server data
  setCart: (cartItems) => {
    Cookies.set('cart', JSON.stringify(cartItems), { expires: 7 });
    set({ cart: cartItems, totalItemCount: cartItems.length });
  },

  // Increase count function
  increaseCount: () =>
    set((state) => ({ totalItemCount: state.totalItemCount })),

  // Add item to cart
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      let updatedCart;
      let totalItemCount = state.totalItemCount;
  
      if (existingItem) {
        // Update the quantity of the existing item
        updatedCart = state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        // Add new item to the cart and increase totalItemCount
        updatedCart = [...state.cart, { ...item, quantity: item.quantity || 1 }];
        totalItemCount += 1; // Only increase count if it's a new item
      }
  
      Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 }); // Persist to cookies
      return { cart: updatedCart, totalItemCount };
    }),
  

  // Remove item from cart
  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);
      Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
      return { cart: updatedCart, totalItemCount: updatedCart.length };
    }),

  // Update quantity
  updateQuantity: (id, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
      return { cart: updatedCart };
    }),

  // Clear cart
  clearCart: () => {
    Cookies.remove('cart');
    set({ cart: [], totalItemCount: 0 });
  },
}));

export default useCartStore;

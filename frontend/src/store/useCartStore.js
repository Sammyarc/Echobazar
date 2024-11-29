import { create } from 'zustand';

const getCartFromLocalStorage = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
  } catch {
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const useCartStore = create((set) => ({
  cart: getCartFromLocalStorage(),
  cartCount: getCartFromLocalStorage().length, // Count unique items

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const cart = [...state.cart];
  
      // Ensure the product has an 'id' field mapped from '_id'
      const productToAdd = { ...product, id: product._id };
  
      const existingProductIndex = cart.findIndex((item) => item.id === productToAdd.id);
  
      if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.push({ ...productToAdd, quantity });
      }
  
      saveCartToLocalStorage(cart);
  
      return {
        cart,
        cartCount: cart.length, // Update unique item count
      };
    });
  },
  

  removeFromCart: (productId) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== productId);

      // Save the updated cart to local storage
      saveCartToLocalStorage(updatedCart);

      return {
        cart: updatedCart,
        cartCount: updatedCart.length, // Update unique item count
      };
    });
  },

  updateQuantity: (product, quantity) => {
    set((state) => {
      const updatedCart = state.cart.map((item) => {
        if (item.id === product) {
          return { ...item, quantity }; 
        }
        return item;
      });

      // Save updated cart to local storage
      saveCartToLocalStorage(updatedCart);

      return {
        cart: updatedCart,
        cartCount: updatedCart.length,
      };
    });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({
      cart: [],
      cartCount: 0,
    });
  },
}));

export default useCartStore;

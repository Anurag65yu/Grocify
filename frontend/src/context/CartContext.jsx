import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CART_KEY = "grocify_cart";

// MongoDB ObjectIds are 24-char hex strings.
// Legacy localStorage items have numeric IDs (1, 2, 3...).
// When API mode is active, discard those stale items on load.
const isValidApiId = (id) => /^[a-f\d]{24}$/i.test(String(id ?? ""));
const API_ACTIVE = Boolean(import.meta.env.VITE_API_URL);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      // Drop stale items whose IDs won't match MongoDB documents
      if (API_ACTIVE) return items.filter((item) => isValidApiId(item.id));
      return items;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) { removeFromCart(id); return; }
    setCartItems(
      cartItems.map((item) => item.id === id ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

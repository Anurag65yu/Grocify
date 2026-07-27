import React, { createContext, useState, useEffect } from 'react';
import { apiFetch, API_ENABLED, normalizeProduct } from '../api/client';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!API_ENABLED) return;
    if (!isAuthenticated) { setWishlistItems([]); return; }
    apiFetch('/api/wishlist')
      .then(data => setWishlistItems((data.products || []).map(normalizeProduct)))
      .catch(() => {});
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = (product._id || product.id)?.toString();
    const exists = wishlistItems.some(item => (item.id || item._id)?.toString() === productId);

    if (API_ENABLED && isAuthenticated) {
      try {
        if (exists) {
          await apiFetch(`/api/wishlist/remove/${productId}`, { method: 'DELETE' });
          setWishlistItems(prev => prev.filter(item => (item.id || item._id)?.toString() !== productId));
        } else {
          const data = await apiFetch('/api/wishlist/add', {
            method: 'POST',
            body: JSON.stringify({ productId }),
          });
          setWishlistItems((data.products || []).map(normalizeProduct));
        }
      } catch {}
    } else {
      if (exists) {
        setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      } else {
        setWishlistItems(prev => [...prev, product]);
      }
    }
  };

  const isInWishlist = (id) =>
    wishlistItems.some(item => item.id?.toString() === id?.toString() || item._id?.toString() === id?.toString());

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch, API_ENABLED, normalizeProduct } from '../api/client';
import { useAuth } from './AuthContext';
import seedProducts from '../data/products';
import seedCoupons from '../data/coupons';

export const CatalogContext = createContext(null);

const PRODUCTS_KEY = 'grocify_products';
const COUPONS_KEY = 'grocify_coupons';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) { localStorage.setItem(key, JSON.stringify(fallback)); return [...fallback]; }
    return JSON.parse(raw);
  } catch { return [...fallback]; }
}

export function CatalogProvider({ children }) {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState(() => API_ENABLED ? [] : load(PRODUCTS_KEY, seedProducts));
  const [coupons, setCoupons] = useState(() => API_ENABLED ? [] : load(COUPONS_KEY, seedCoupons));
  const [loading, setLoading] = useState(API_ENABLED);

  useEffect(() => {
    if (!API_ENABLED) return;
    apiFetch('/api/products')
      .then(data => { setProducts(data.map(normalizeProduct)); setLoading(false); })
      .catch(() => { setProducts(seedProducts); setLoading(false); });
  }, []);

  const fetchCoupons = useCallback(async () => {
    if (!API_ENABLED) return;
    try { const data = await apiFetch('/api/coupons'); setCoupons(data); } catch {}
  }, []);

  useEffect(() => {
    if (API_ENABLED && isAdmin) fetchCoupons();
  }, [isAdmin, fetchCoupons]);

  useEffect(() => { if (!API_ENABLED) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }, [products]);
  useEffect(() => { if (!API_ENABLED) localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons)); }, [coupons]);

  const addProduct = async (product) => {
    if (API_ENABLED) {
      const data = await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(product) });
      const normalized = normalizeProduct(data);
      setProducts(prev => [...prev, normalized]);
      return normalized;
    }
    const next = { ...product, id: Date.now(), stock: Number(product.stock) || 0, price: Number(product.price) || 0 };
    setProducts(prev => [...prev, next]);
    return next;
  };

  const updateProduct = async (id, updates) => {
    if (API_ENABLED) {
      const data = await apiFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
      const normalized = normalizeProduct(data);
      setProducts(prev => prev.map(p => p.id === id ? normalized : p));
      return normalized;
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, id: p.id } : p));
  };

  const deleteProduct = async (id) => {
    if (API_ENABLED) {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      return;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStock = async (id, stock) => {
    await updateProduct(id, { stock: Math.max(0, Number(stock) || 0) });
  };

  const decrementStock = (items) => {
    setProducts(prev => prev.map(p => {
      const line = items.find(i => i.id?.toString() === p.id?.toString());
      if (!line) return p;
      return { ...p, stock: Math.max(0, (p.stock || 0) - line.quantity) };
    }));
  };

  const addCoupon = async (coupon) => {
    if (API_ENABLED) {
      const data = await apiFetch('/api/coupons', { method: 'POST', body: JSON.stringify(coupon) });
      setCoupons(prev => [...prev, data]);
      return data;
    }
    const next = { ...coupon, id: Date.now(), code: coupon.code.toUpperCase(), usedCount: 0, isActive: coupon.isActive !== false };
    setCoupons(prev => [...prev, next]);
    return next;
  };

  const updateCoupon = async (id, updates) => {
    if (API_ENABLED) {
      const data = await apiFetch(`/api/coupons/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
      setCoupons(prev => prev.map(c => (c._id === id || c.id === id) ? data : c));
      return data;
    }
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates, id: c.id, code: (updates.code || c.code).toUpperCase() } : c));
  };

  const deleteCoupon = async (id) => {
    if (API_ENABLED) {
      await apiFetch(`/api/coupons/${id}`, { method: 'DELETE' });
      setCoupons(prev => prev.filter(c => c._id !== id && c.id !== id));
      return;
    }
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const validateCoupon = async (code, subtotal) => {
    if (API_ENABLED) {
      try {
        const data = await apiFetch('/api/coupons/validate', {
          method: 'POST',
          body: JSON.stringify({ code, orderTotal: subtotal }),
        });
        return { ok: true, coupon: { code: data.code }, discount: data.discountAmount, message: 'Coupon applied!' };
      } catch (err) {
        return { ok: false, message: err.message };
      }
    }
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { ok: false, message: 'Invalid coupon code' };
    if (!coupon.isActive) return { ok: false, message: 'Coupon is inactive' };
    if (new Date(coupon.expiryDate) < new Date()) return { ok: false, message: 'Coupon has expired' };
    if (coupon.usedCount >= coupon.usageLimit) return { ok: false, message: 'Coupon usage limit reached' };
    if (subtotal < coupon.minOrderValue) return { ok: false, message: `Minimum order ₹${coupon.minOrderValue} required` };
    const discount = coupon.discountType === 'percent'
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : coupon.discountValue;
    return { ok: true, coupon, discount: Math.min(discount, subtotal), message: 'Coupon applied!' };
  };

  const markCouponUsed = (code) => {
    if (!API_ENABLED) {
      setCoupons(prev => prev.map(c => c.code.toUpperCase() === code.toUpperCase() ? { ...c, usedCount: c.usedCount + 1 } : c));
    }
  };

  const lowStockProducts = products.filter(p => (p.stock || 0) < 10);

  return (
    <CatalogContext.Provider value={{
      products, coupons, loading,
      addProduct, updateProduct, deleteProduct, updateStock, decrementStock,
      addCoupon, updateCoupon, deleteCoupon, validateCoupon, markCouponUsed,
      lowStockProducts, fetchCoupons,
    }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}

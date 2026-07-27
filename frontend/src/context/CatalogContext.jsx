import React, { createContext, useContext, useEffect, useState } from "react";
import seedProducts from "../data/products";
import seedCoupons from "../data/coupons";

export const CatalogContext = createContext(null);

const PRODUCTS_KEY = "grocify_products";
const COUPONS_KEY = "grocify_coupons";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return [...fallback];
    }
    return JSON.parse(raw);
  } catch {
    return [...fallback];
  }
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(() =>
    load(PRODUCTS_KEY, seedProducts)
  );
  const [coupons, setCoupons] = useState(() => load(COUPONS_KEY, seedCoupons));

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  }, [coupons]);

  const addProduct = (product) => {
    const next = {
      ...product,
      id: Date.now(),
      stock: Number(product.stock) || 0,
      price: Number(product.price) || 0,
    };
    setProducts((prev) => [...prev, next]);
    return next;
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, id: p.id } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = (id, stock) => {
    updateProduct(id, { stock: Math.max(0, Number(stock) || 0) });
  };

  const decrementStock = (items) => {
    setProducts((prev) =>
      prev.map((p) => {
        const line = items.find((i) => i.id === p.id);
        if (!line) return p;
        return { ...p, stock: Math.max(0, p.stock - line.quantity) };
      })
    );
  };

  const addCoupon = (coupon) => {
    const next = {
      ...coupon,
      id: Date.now(),
      code: coupon.code.toUpperCase(),
      usedCount: 0,
      isActive: coupon.isActive !== false,
    };
    setCoupons((prev) => [...prev, next]);
    return next;
  };

  const updateCoupon = (id, updates) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updates,
              id: c.id,
              code: (updates.code || c.code).toUpperCase(),
            }
          : c
      )
    );
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const validateCoupon = (code, subtotal) => {
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );
    if (!coupon) return { ok: false, message: "Invalid coupon code" };
    if (!coupon.isActive) return { ok: false, message: "Coupon is inactive" };
    if (new Date(coupon.expiryDate) < new Date())
      return { ok: false, message: "Coupon has expired" };
    if (coupon.usedCount >= coupon.usageLimit)
      return { ok: false, message: "Coupon usage limit reached" };
    if (subtotal < coupon.minOrderValue)
      return {
        ok: false,
        message: `Minimum order ₹${coupon.minOrderValue} required`,
      };

    const discount =
      coupon.discountType === "percent"
        ? Math.round((subtotal * coupon.discountValue) / 100)
        : coupon.discountValue;

    return {
      ok: true,
      coupon,
      discount: Math.min(discount, subtotal),
      message: "Coupon applied",
    };
  };

  const markCouponUsed = (code) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.code.toUpperCase() === code.toUpperCase()
          ? { ...c, usedCount: c.usedCount + 1 }
          : c
      )
    );
  };

  const lowStockProducts = products.filter((p) => p.stock < 10);

  return (
    <CatalogContext.Provider
      value={{
        products,
        coupons,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        decrementStock,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
        markCouponUsed,
        lowStockProducts,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}

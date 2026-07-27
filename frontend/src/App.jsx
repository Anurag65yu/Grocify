import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { API_ENABLED } from "./api/client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ShoppingCart from "./components/ShoppingCart";

import Home from "./Pages/Home";
import CategoryPage from "./Pages/CategoryPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Wishlist from "./Pages/Wishlist";
import Checkout from "./Pages/Checkout";
import Payment from "./Pages/Payment";
import OrderSuccess from "./Pages/OrderSuccess";
import OrderHistory from "./Pages/OrderHistory";
import OrderTracking from "./Pages/OrderTracking";
import Profile from "./Pages/Profile";
import HelpCenter from "./Pages/HelpCenter";
import DeliveryInfo from "./Pages/DeliveryInfo";
import ReturnPolicy from "./Pages/ReturnPolicy";

import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import ProductManagement from "./Pages/admin/ProductManagement";
import CouponManagement from "./Pages/admin/CouponManagement";
import InventoryManagement from "./Pages/admin/InventoryManagement";
import AdminOrders from "./Pages/admin/AdminOrders";

function App() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!API_ENABLED) return;
    const base = import.meta.env.VITE_API_URL;
    fetch(`${base}/health`, { method: "GET" }).catch(() => {});
  }, []);

  return (
    <>
      <Header search={search} setSearch={setSearch} />

      <Routes>
        <Route path="/" element={<Home search={search} />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:orderId/track" element={<OrderTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/delivery-info" element={<DeliveryInfo />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="coupons" element={<CouponManagement />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;

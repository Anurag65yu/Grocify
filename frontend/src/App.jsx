import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

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

import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import ProductManagement from "./Pages/admin/ProductManagement";
import CouponManagement from "./Pages/admin/CouponManagement";
import InventoryManagement from "./Pages/admin/InventoryManagement";
import AdminOrders from "./Pages/admin/AdminOrders";

function App() {
  const [search, setSearch] = useState("");

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

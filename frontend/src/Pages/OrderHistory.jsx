import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import "../styles/pages.css";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const { getUserOrders, cancelOrder } = useOrders();
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const orders = getUserOrders(user.id);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    setError("");
    try {
      await cancelOrder(orderId);
    } catch (err) {
      setError(err.message || "Failed to cancel order. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>
      <p className="page-sub">All your past and active orders.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="card-panel empty-state">
          <p>No orders yet.</p>
          <Link to="/">Start shopping</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div>
                <h3 style={{ fontFamily: "monospace", fontSize: 14, marginBottom: 4 }}>
                  {order.id}
                </h3>
                <div className="order-meta">{formatDate(order.createdAt)}</div>
                <div className="order-meta">
                  {order.items.length} item(s) &middot; &#8377;{order.totalAmount}
                </div>
                <div className="actions" style={{ marginTop: 8 }}>
                  <span className={`badge badge-${order.deliveryStatus}`}>
                    {order.deliveryStatus.replaceAll("_", " ")}
                  </span>
                  <span className={`badge badge-${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="actions">
                <Link to={`/orders/${order.id}/track`} className="btn-primary">
                  Track
                </Link>
                {["pending", "packed"].includes(order.deliveryStatus) && (
                  <button
                    type="button"
                    className="btn-danger"
                    disabled={cancellingId === order.id}
                    onClick={() => handleCancel(order.id)}
                  >
                    {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;

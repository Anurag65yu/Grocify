import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import "../styles/pages.css";

function OrderTracking() {
  const { orderId } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { getOrderById, STATUS_FLOW, advanceOrderStatus } = useOrders();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="page">
        <div className="card-panel empty-state">
          <p>Order not found.</p>
          <Link to="/orders">Back to orders</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin && order.userId !== user.id) {
    return <Navigate to="/orders" replace />;
  }

  const cancelled = order.deliveryStatus === "cancelled";
  const currentIdx = STATUS_FLOW.indexOf(order.deliveryStatus);

  return (
    <div className="page">
      <h1 className="page-title">Track order</h1>
      <p className="page-sub">
        {order.id} · ₹{order.totalAmount}
      </p>

      <div className="two-col">
        <div className="card-panel">
          <h3 style={{ marginBottom: 8 }}>Delivery status</h3>
          <span className={`badge badge-${order.deliveryStatus}`}>
            {order.deliveryStatus.replaceAll("_", " ")}
          </span>

          {cancelled ? (
            <ul className="timeline">
              <li className="cancelled">
                <strong>Cancelled</strong>
                <div style={{ fontSize: 13, color: "#666" }}>
                  This order was cancelled.
                </div>
              </li>
            </ul>
          ) : (
            <ul className="timeline">
              {STATUS_FLOW.map((status, idx) => {
                const done = idx < currentIdx;
                const current = idx === currentIdx;
                return (
                  <li
                    key={status}
                    className={done || current ? (current ? "current" : "done") : ""}
                  >
                    <strong style={{ textTransform: "capitalize" }}>
                      {status.replaceAll("_", " ")}
                    </strong>
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {done
                        ? "Completed"
                        : current
                          ? "In progress"
                          : "Upcoming"}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {isAdmin && !cancelled && currentIdx < STATUS_FLOW.length - 1 && (
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: 8 }}
              onClick={() => advanceOrderStatus(order.id)}
            >
              Advance status (admin)
            </button>
          )}
        </div>

        <div className="card-panel">
          <h3 style={{ marginBottom: 12 }}>Order details</h3>
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            <strong>Deliver to:</strong>
            <br />
            {order.address}
          </p>
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p style={{ fontSize: 14, marginBottom: 16 }}>
            <strong>Payment:</strong> {order.paymentMethod?.toUpperCase()} (
            {order.paymentStatus})
          </p>

          <h4 style={{ marginBottom: 10 }}>Items</h4>
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "8px 0",
                borderBottom: "1px solid #eee",
                fontSize: 14,
              }}
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <Link to="/orders" className="btn-ghost">
              Back to orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;

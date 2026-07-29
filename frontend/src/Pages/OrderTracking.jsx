import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import "../styles/pages.css";
import "./OrderTracking.css";

const STEPS = [
  {
    key: "pending",
    icon: "✅",
    label: "Order Confirmed",
    desc: "We have received your order and are preparing it.",
  },
  {
    key: "packed",
    icon: "📦",
    label: "Packed",
    desc: "Your items have been carefully packed and sealed.",
  },
  {
    key: "shipped",
    icon: "🏦",
    label: "Shipped",
    desc: "Your order has left our warehouse.",
  },
  {
    key: "out_for_delivery",
    icon: "🛵",
    label: "Out for Delivery",
    desc: "Your delivery partner is heading your way!",
  },
  {
    key: "delivered",
    icon: "🎉",
    label: "Delivered",
    desc: "Order delivered. Enjoy your fresh groceries!",
  },
];

const ETA_MAP = {
  pending:          "45–60 min",
  packed:           "30–45 min",
  shipped:          "20–30 min",
  out_for_delivery: "5–15 min",
  delivered:        null,
};

const PARTNERS = [
  { name: "Ravi Kumar",  phone: "98765 43210", rating: "4.8 ★" },
  { name: "Arjun Singh", phone: "98123 45678", rating: "4.9 ★" },
  { name: "Suresh Pal",  phone: "99001 12345", rating: "4.7 ★" },
];

function getPartner(orderId) {
  const sum = (orderId || "").split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return PARTNERS[sum % PARTNERS.length];
}

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

  const cancelled  = order.deliveryStatus === "cancelled";
  const currentIdx = STATUS_FLOW.indexOf(order.deliveryStatus);
  const partner    = getPartner(order.id);
  const isOut      = order.deliveryStatus === "out_for_delivery";
  const isDone     = order.deliveryStatus === "delivered";
  const eta        = ETA_MAP[order.deliveryStatus];

  return (
    <div className="page">
      <h1 className="page-title">Track Order</h1>
      <p className="page-sub" style={{ fontFamily: "monospace", letterSpacing: 1 }}>
        {order.id}
      </p>

      <div className="two-col">
        {/* Timeline */}
        <div className="card-panel">
          {cancelled ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>❌</div>
              <h3 style={{ color: "#c62828", margin: "0 0 8px" }}>Order Cancelled</h3>
              <p style={{ color: "#888", fontSize: 14, margin: 0 }}>This order was cancelled.</p>
            </div>
          ) : (
            <>
              <div className="tracking-header">
                <h3 style={{ margin: 0 }}>Delivery Status</h3>
                {eta && (
                  <div className="eta-badge">🕒 ETA: {eta}</div>
                )}
                {isDone && (
                  <div className="eta-badge" style={{ background: "#e8f5e9", color: "#2e7d32" }}>
                    ✅ Delivered
                  </div>
                )}
              </div>

              <div className="tracking-timeline">
                {STEPS.map((step, idx) => {
                  const stepIdx = STATUS_FLOW.indexOf(step.key);
                  const done    = stepIdx < currentIdx;
                  const current = stepIdx === currentIdx;
                  const upcoming = stepIdx > currentIdx;
                  return (
                    <div
                      key={step.key}
                      className={[
                        "t-step",
                        done ? "t-done" : "",
                        current ? "t-current" : "",
                        upcoming ? "t-upcoming" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="t-icon-col">
                        <div className="t-circle">
                          {done ? "✓" : step.icon}
                        </div>
                        {idx < STEPS.length - 1 && <div className="t-line" />}
                      </div>
                      <div className="t-body">
                        <div className="t-label">{step.label}</div>
                        <div className="t-desc">
                          {done ? "Completed" : current ? step.desc : "Upcoming"}
                        </div>
                        {current && <span className="t-pulse" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery partner card */}
              {(isOut || isDone) && (
                <div className="partner-card">
                  <div style={{ fontSize: 38 }}>👷</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{partner.name}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>
                      Delivery Partner &bull; {partner.rating}
                    </div>
                    {isOut && (
                      <a
                        href={`tel:${partner.phone}`}
                        style={{ fontSize: 13, color: "#2e7d32", fontWeight: 600 }}
                      >
                        &#128222; {partner.phone}
                      </a>
                    )}
                    {isDone && (
                      <div style={{ fontSize: 13, color: "#888" }}>Thank you for ordering!</div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin advance button */}
              {isAdmin && !cancelled && currentIdx < STATUS_FLOW.length - 1 && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: 18, width: "100%" }}
                  onClick={() => advanceOrderStatus(order.id)}
                >
                  Advance to next step (Admin)
                </button>
              )}
            </>
          )}
        </div>

        {/* Order details */}
        <div className="card-panel">
          <h3 style={{ marginBottom: 14 }}>Order Details</h3>

          <div style={{ fontSize: 14, display: "grid", gap: 10, marginBottom: 20 }}>
            <div>
              <span style={{ color: "#888" }}>Deliver to</span><br />
              <strong>{order.address}</strong>
            </div>
            <div>
              <span style={{ color: "#888" }}>Phone</span><br />
              <strong>{order.phone}</strong>
            </div>
            {order.paymentMethod && (
              <div>
                <span style={{ color: "#888" }}>Payment</span><br />
                <strong>{order.paymentMethod.toUpperCase()}</strong>
                {" "}&bull; {order.paymentStatus}
              </div>
            )}
            <div>
              <span style={{ color: "#888" }}>Total</span><br />
              <strong style={{ fontSize: 18 }}>₹{order.totalAmount ?? order.total}</strong>
            </div>
          </div>

          <h4 style={{ marginBottom: 10, color: "#444" }}>Items</h4>
          <div style={{ display: "grid", gap: 6 }}>
            {order.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: 14,
                }}
              >
                <span>
                  {item.name} &times; {item.quantity}
                </span>
                <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <Link to="/orders" className="btn-ghost" style={{ display: "block", textAlign: "center" }}>
              ← Back to orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;

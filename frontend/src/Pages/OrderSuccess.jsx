import React from "react";
import { Link, useParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import "../styles/pages.css";

function OrderSuccess() {
  const { orderId } = useParams();
  const id = orderId || sessionStorage.getItem("grocify_last_order");
  const { getOrderById } = useOrders();
  const order = id ? getOrderById(id) : null;

  return (
    <div className="page" style={{ display: "flex", justifyContent: "center" }}>
      <div className="card-panel" style={{ maxWidth: 520, textAlign: "center", width: "100%" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#e8f5e9",
            color: "#0aad0a",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          ✓
        </div>
        <h1 className="page-title" style={{ marginBottom: 8 }}>
          Order placed successfully
        </h1>
        <p className="page-sub" style={{ marginBottom: 8 }}>
          Thank you for shopping with Grocify. Your groceries are on the way.
        </p>
        {id && (
          <p style={{ fontWeight: 700, color: "#0a360a", marginBottom: 20 }}>
            Order ID: {id}
          </p>
        )}
        {order && (
          <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
            Total paid: ₹{order.totalAmount} · {order.paymentMethod?.toUpperCase()}
          </p>
        )}
        <div className="actions" style={{ justifyContent: "center" }}>
          {id && (
            <Link to={`/orders/${id}/track`} className="btn-primary">
              Track order
            </Link>
          )}
          <Link to="/orders" className="btn-secondary">
            View orders
          </Link>
          <Link to="/" className="btn-ghost">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;

import React from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import "../../styles/pages.css";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function AdminOrders() {
  const { orders, advanceOrderStatus } = useOrders();

  return (
    <div>
      <h1 className="page-title">Orders</h1>
      <p className="page-sub">View and advance delivery status.</p>

      <div className="card-panel table-wrap">
        {orders.length === 0 ? (
          <p className="empty-state">No orders placed yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div>{o.id}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {formatDate(o.createdAt)}
                    </div>
                  </td>
                  <td>
                    {o.userName}
                    <div style={{ fontSize: 12, color: "#888" }}>{o.phone}</div>
                  </td>
                  <td>₹{o.totalAmount}</td>
                  <td>
                    {o.paymentMethod?.toUpperCase()}
                    <div>
                      <span className={`badge badge-${o.paymentStatus}`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${o.deliveryStatus}`}>
                      {o.deliveryStatus.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/orders/${o.id}/track`} className="btn-ghost">
                        Track
                      </Link>
                      {!["delivered", "cancelled"].includes(o.deliveryStatus) && (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => advanceOrderStatus(o.id)}
                        >
                          Next status
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;

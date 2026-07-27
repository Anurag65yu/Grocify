import React from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { useOrders } from "../../context/OrderContext";
import "../../styles/pages.css";

function AdminDashboard() {
  const { products, coupons, lowStockProducts } = useCatalog();
  const { orders } = useOrders();

  const revenue = orders
    .filter((o) => o.paymentStatus === "paid" || o.paymentMethod === "cod")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.deliveryStatus)
  ).length;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Store overview and quick actions.</p>

      <div className="stat-grid">
        <div className="stat-card">
          <h4>Total orders</h4>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h4>Revenue</h4>
          <p>₹{revenue}</p>
        </div>
        <div className="stat-card">
          <h4>Products</h4>
          <p>{products.length}</p>
        </div>
        <div className="stat-card">
          <h4>Active orders</h4>
          <p>{activeOrders}</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card-panel">
          <div className="admin-toolbar">
            <h3>Low stock alerts</h3>
            <Link to="/admin/inventory" className="btn-ghost">
              Manage
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p style={{ color: "#666", fontSize: 14 }}>All products are well stocked.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td className="stock-low">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-panel">
          <div className="admin-toolbar">
            <h3>Quick links</h3>
          </div>
          <div className="actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
            <Link to="/admin/products" className="btn-primary">
              Product management
            </Link>
            <Link to="/admin/coupons" className="btn-secondary">
              Coupons ({coupons.length})
            </Link>
            <Link to="/admin/orders" className="btn-ghost">
              View all orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

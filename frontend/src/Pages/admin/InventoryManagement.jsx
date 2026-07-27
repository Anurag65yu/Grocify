import React, { useMemo, useState } from "react";
import { useCatalog } from "../../context/CatalogContext";
import "../../styles/pages.css";

function InventoryManagement() {
  const { products, updateStock, lowStockProducts } = useCatalog();
  const [filter, setFilter] = useState("all");
  const [drafts, setDrafts] = useState({});

  const list = useMemo(() => {
    if (filter === "low") return products.filter((p) => p.stock < 10);
    if (filter === "out") return products.filter((p) => p.stock === 0);
    return products;
  }, [products, filter]);

  const setDraft = (id, value) => {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const save = (id, current) => {
    const value = drafts[id] !== undefined ? drafts[id] : current;
    updateStock(id, value);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>
            Inventory management
          </h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            Track and update product stock levels.
          </p>
        </div>
        <div className="actions">
          <button
            type="button"
            className={filter === "all" ? "btn-primary" : "btn-ghost"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={filter === "low" ? "btn-primary" : "btn-ghost"}
            onClick={() => setFilter("low")}
          >
            Low stock ({lowStockProducts.length})
          </button>
          <button
            type="button"
            className={filter === "out" ? "btn-primary" : "btn-ghost"}
            onClick={() => setFilter("out")}
          >
            Out of stock
          </button>
        </div>
      </div>

      {lowStockProducts.length > 0 && filter === "all" && (
        <div className="alert alert-error">
          {lowStockProducts.length} product(s) below 10 units — restock soon.
        </div>
      )}

      <div className="card-panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Current stock</th>
              <th>Update stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img className="thumb" src={p.image} alt={p.name} />
                    {p.name}
                  </div>
                </td>
                <td>{p.category}</td>
                <td className={p.stock < 10 ? "stock-low" : "stock-ok"}>
                  {p.stock}
                </td>
                <td>
                  <div className="actions">
                    <input
                      type="number"
                      min="0"
                      style={{
                        width: 90,
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                      value={drafts[p.id] !== undefined ? drafts[p.id] : p.stock}
                      onChange={(e) => setDraft(p.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => save(p.id, p.stock)}
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td>
                  {p.stock === 0 ? (
                    <span className="badge badge-cancelled">Out of stock</span>
                  ) : p.stock < 10 ? (
                    <span className="badge badge-pending">Low</span>
                  ) : (
                    <span className="badge badge-delivered">In stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p className="empty-state" style={{ padding: 24 }}>
            No products in this filter.
          </p>
        )}
      </div>
    </div>
  );
}

export default InventoryManagement;

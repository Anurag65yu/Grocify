import React, { useState } from "react";
import { useCatalog } from "../../context/CatalogContext";
import categories from "../../data/categories";
import "../../styles/pages.css";

const emptyForm = {
  name: "",
  category: "Fruits",
  price: "",
  unit: "1 kg",
  stock: "",
  description: "",
  image: "",
};

function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useCatalog();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      unit: product.unit || "1 kg",
      stock: String(product.stock ?? 0),
      description: product.description || "",
      image: product.image || "",
    });
    setOpen(true);
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      stock: Number(form.stock),
      description: form.description,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    };
    if (editing) updateProduct(editing.id, payload);
    else addProduct(payload);
    setOpen(false);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>
            Product management
          </h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            Add, edit, or remove catalog items.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Add product
        </button>
      </div>

      <div className="card-panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img className="thumb" src={p.image} alt={p.name} />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td className={p.stock < 10 ? "stock-low" : "stock-ok"}>
                  {p.stock}
                </td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => {
                        if (window.confirm(`Delete ${p.name}?`))
                          deleteProduct(p.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <form
            className="modal form-grid"
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSave}
          >
            <h3>{editing ? "Edit product" : "Add product"}</h3>
            <label>
              Name
              <input name="name" value={form.name} onChange={onChange} required />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={onChange}>
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                Price
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={onChange}
                  required
                />
              </label>
              <label>
                Stock
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={onChange}
                  required
                />
              </label>
            </div>
            <label>
              Unit
              <input name="unit" value={form.unit} onChange={onChange} />
            </label>
            <label>
              Image URL
              <input name="image" value={form.image} onChange={onChange} />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows={2}
                value={form.description}
                onChange={onChange}
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;

import React, { useState } from "react";
import { useCatalog } from "../../context/CatalogContext";
import "../../styles/pages.css";

const emptyForm = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minOrderValue: "0",
  expiryDate: "",
  usageLimit: "100",
  isActive: true,
};

function CouponManagement() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCatalog();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderValue: String(coupon.minOrderValue),
      expiryDate: coupon.expiryDate?.slice?.(0, 10) || coupon.expiryDate,
      usageLimit: String(coupon.usageLimit),
      isActive: coupon.isActive,
    });
    setOpen(true);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSave = (e) => {
    e.preventDefault();
    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue),
      expiryDate: form.expiryDate,
      usageLimit: Number(form.usageLimit),
      isActive: form.isActive,
    };
    if (editing) updateCoupon(editing.id, payload);
    else addCoupon(payload);
    setOpen(false);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>
            Coupon management
          </h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            Create and manage discount codes.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Add coupon
        </button>
      </div>

      <div className="card-panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min order</th>
              <th>Expiry</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.code}</strong>
                </td>
                <td>
                  {c.discountType === "percent"
                    ? `${c.discountValue}%`
                    : `₹${c.discountValue}`}
                </td>
                <td>₹{c.minOrderValue}</td>
                <td>{c.expiryDate}</td>
                <td>
                  {c.usedCount}/{c.usageLimit}
                </td>
                <td>
                  <span
                    className={`badge ${c.isActive ? "badge-delivered" : "badge-cancelled"}`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => {
                        if (window.confirm(`Delete ${c.code}?`))
                          deleteCoupon(c.id);
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
            <h3>{editing ? "Edit coupon" : "Add coupon"}</h3>
            <label>
              Code
              <input name="code" value={form.code} onChange={onChange} required />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                Type
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={onChange}
                >
                  <option value="percent">Percent</option>
                  <option value="flat">Flat</option>
                </select>
              </label>
              <label>
                Value
                <input
                  name="discountValue"
                  type="number"
                  min="1"
                  value={form.discountValue}
                  onChange={onChange}
                  required
                />
              </label>
            </div>
            <label>
              Min order value
              <input
                name="minOrderValue"
                type="number"
                min="0"
                value={form.minOrderValue}
                onChange={onChange}
              />
            </label>
            <label>
              Expiry date
              <input
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Usage limit
              <input
                name="usageLimit"
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={onChange}
              />
            </label>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
              />
              Active
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

export default CouponManagement;

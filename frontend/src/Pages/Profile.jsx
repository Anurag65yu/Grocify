import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages.css";

function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    const updates = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };
    if (form.password) updates.password = form.password;
    updateProfile(updates);
    setForm((f) => ({ ...f, password: "" }));
    setMsg("Profile updated successfully");
  };

  return (
    <div className="page">
      <h1 className="page-title">My profile</h1>
      <p className="page-sub">Manage your account details and delivery address.</p>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="two-col">
        <form className="card-panel form-grid" onSubmit={onSubmit}>
          <label>
            Full name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Email
            <input type="email" value={user.email} readOnly />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={onChange} />
          </label>
          <label>
            Default address
            <textarea
              name="address"
              rows={3}
              value={form.address}
              onChange={onChange}
            />
          </label>
          <label>
            New password (optional)
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Leave blank to keep current"
            />
          </label>
          <button type="submit" className="btn-primary">
            Save changes
          </button>
        </form>

        <div className="card-panel">
          <h3 style={{ marginBottom: 12 }}>Account</h3>
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            <strong>Role:</strong> {user.role}
          </p>
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            <strong>User ID:</strong> {user.id}
          </p>
          {user.role === "admin" && (
            <p className="alert alert-info" style={{ marginBottom: 0 }}>
              You have admin access. Open Admin from the header to manage the store.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

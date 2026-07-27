import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCatalog } from "../context/CatalogContext";
import "../styles/pages.css";

const DELIVERY_FEE = 30;
const FREE_ABOVE = 499;

function Checkout() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal } = useContext(CartContext);
  const { validateCoupon } = useCatalog();

  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [couponCode, setCouponCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const deliveryFee = cartTotal >= FREE_ABOVE ? 0 : DELIVERY_FEE;
  const discount = applied?.discount || 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - discount);

  const lines = useMemo(
    () => cartItems.map((item) => ({ ...item, lineTotal: item.price * item.quantity })),
    [cartItems]
  );

  const applyCoupon = async () => {
    setCouponMsg("");
    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponCode.trim(), cartTotal);
      if (!result.ok) {
        setApplied(null);
        setCouponMsg(result.message);
      } else {
        setApplied(result);
        setCouponMsg(result.message);
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const goToPayment = (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    if (!address.trim() || !phone.trim()) {
      setError("Please fill delivery address and phone");
      return;
    }

    const checkoutPayload = {
      address: address.trim(),
      phone: phone.trim(),
      items: cartItems,
      subtotal: cartTotal,
      deliveryFee,
      discount,
      couponCode: applied?.coupon?.code || null,
      total: grandTotal,
    };
    sessionStorage.setItem("grocify_checkout", JSON.stringify(checkoutPayload));
    navigate("/payment");
  };

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Checkout</h1>
        <div className="card-panel empty-state">
          <p>Your cart is empty.</p>
          <Link to="/">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <p className="page-sub">Confirm address and review your order.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="two-col" onSubmit={goToPayment}>
        <div className="card-panel form-grid">
          <h3 style={{ marginBottom: 4 }}>Delivery details</h3>
          <label>
            Full name
            <input type="text" value={user?.name || ""} readOnly />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              required
            />
          </label>
          <label>
            Delivery address
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no, street, landmark, city"
              required
            />
          </label>

          <label>
            Coupon code
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. GROCIFY10"
              />
              <button type="button" className="btn-ghost" onClick={applyCoupon} disabled={couponLoading}>
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>
          </label>
          {couponMsg && (
            <div
              className={`alert ${applied ? "alert-success" : "alert-error"}`}
              style={{ marginBottom: 0 }}
            >
              {couponMsg}
            </div>
          )}
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
            Try GROCIFY10 or FLAT50
          </p>
        </div>

        <div className="card-panel">
          <h3 style={{ marginBottom: 14 }}>Order summary</h3>
          {lines.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
                fontSize: 14,
              }}
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.lineTotal}</span>
            </div>
          ))}

          <div style={{ marginTop: 14, fontSize: 14, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#0aad0a",
                }}
              >
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 18,
                marginTop: 6,
              }}
            >
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: 18 }}
          >
            Continue to Payment
          </button>
          <Link
            to="/cart"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 12,
              color: "#0aad0a",
              fontSize: 14,
            }}
          >
            Back to cart
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Checkout;

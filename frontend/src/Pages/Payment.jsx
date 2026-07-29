import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useCatalog } from "../context/CatalogContext";
import "../styles/pages.css";
import "./Payment.css";

const METHODS = [
  { id: "upi",  label: "UPI",                icon: "&#128247;", desc: "GPay · PhonePe · Paytm · BHIM" },
  { id: "card", label: "Debit / Credit Card", icon: "&#128179;", desc: "Visa, Mastercard, RuPay" },
  { id: "cod",  label: "Cash on Delivery",    icon: "&#128181;", desc: "Pay when your order arrives" },
];

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM"];

function formatCard(val) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function ProcessingOverlay({ amount }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Connecting to payment gateway...",
    "Verifying your details...",
    "Confirming order...",
    "Payment successful! ✅",
  ];

  useEffect(() => {
    const t = setInterval(
      () => setStep((s) => Math.min(s + 1, steps.length - 1)),
      700
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pay-overlay">
      <div className="pay-modal">
        <div className="pay-spinner" />
        <p className="pay-amount">&#8377;{amount}</p>
        <p className="pay-step-text">{steps[step]}</p>
      </div>
    </div>
  );
}

function Payment() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useContext(CartContext);
  const { placeOrder } = useOrders();
  const { decrementStock, markCouponUsed } = useCatalog();

  const [checkout] = useState(() => {
    try {
      const raw = sessionStorage.getItem("grocify_checkout");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [method, setMethod]       = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [error, setError]         = useState("");
  const [upiId, setUpiId]         = useState("");
  const [card, setCard]           = useState({ number: "", expiry: "", cvv: "", name: "" });

  useEffect(() => {
    if (!checkout) navigate("/checkout");
  }, [checkout, navigate]);

  if (!checkout) {
    return (
      <div className="page">
        <div className="card-panel empty-state">Loading payment...</div>
      </div>
    );
  }

  const pay = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) { navigate("/login"); return; }

    if (method === "upi" && !upiId.trim()) {
      setError("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length < 12) {
        setError("Enter a valid card number"); return;
      }
      if (!card.expiry || card.expiry.length < 5) {
        setError("Enter a valid expiry date (MM/YY)"); return;
      }
      if (!card.cvv || card.cvv.length < 3) {
        setError("Enter a valid CVV"); return;
      }
    }

    setProcessing(true);
    // Show animated processing for 2.8s before calling backend
    await new Promise((r) => setTimeout(r, 2800));

    try {
      const order = await placeOrder({
        userId:        user.id,
        userName:      user.name,
        userEmail:     user.email,
        phone:         checkout.phone,
        address:       checkout.address,
        items: checkout.items.map((i) => ({
          id: i.id, _id: i.id,
          name: i.name, image: i.image,
          price: i.price, quantity: i.quantity,
        })),
        subtotal:      checkout.subtotal,
        deliveryFee:   checkout.deliveryFee,
        discount:      checkout.discount,
        couponCode:    checkout.couponCode,
        totalAmount:   checkout.total,
        paymentMethod: method,
      });

      decrementStock(checkout.items);
      if (checkout.couponCode) markCouponUsed(checkout.couponCode);
      clearCart();
      sessionStorage.removeItem("grocify_checkout");
      sessionStorage.setItem("grocify_last_order", order.id);
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      setError(err.message || "Order placement failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="page">
      {processing && <ProcessingOverlay amount={checkout.total} />}

      <h1 className="page-title">&#128274; Secure Payment</h1>
      <p className="page-sub">All transactions are encrypted and secure</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="two-col" onSubmit={pay}>
        {/* Left: method selector + form */}
        <div className="card-panel">
          <h3 style={{ marginBottom: 14 }}>Select payment method</h3>

          <div className="payment-options">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`payment-option ${method === m.id ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                />
                <span
                  style={{ fontSize: 22 }}
                  dangerouslySetInnerHTML={{ __html: m.icon }}
                />
                <div>
                  <strong>{m.label}</strong>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{m.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* UPI form */}
          {method === "upi" && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {UPI_APPS.map((app) => (
                  <span key={app} className="upi-badge">{app}</span>
                ))}
              </div>
              <label className="pay-label">
                UPI ID
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="pay-input"
                />
                <span style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  e.g.&nbsp;name@okicici&nbsp;&bull;&nbsp;number@paytm
                </span>
              </label>
            </div>
          )}

          {/* Card form */}
          {method === "card" && (
            <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
              <label className="pay-label">
                Cardholder name
                <input
                  type="text"
                  placeholder="Name as on card"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="pay-input"
                />
              </label>
              <label className="pay-label">
                Card number
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                  className="pay-input"
                  maxLength={19}
                />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label className="pay-label">
                  Expiry
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    className="pay-input"
                    maxLength={5}
                  />
                </label>
                <label className="pay-label">
                  CVV
                  <input
                    type="password"
                    placeholder="&#8226;&#8226;&#8226;"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })}
                    className="pay-input"
                  />
                </label>
              </div>
              <div className="demo-notice">
                &#128274; Demo mode &mdash; any card details will succeed. No real charge.
              </div>
            </div>
          )}

          {/* COD */}
          {method === "cod" && (
            <div className="cod-notice" style={{ marginTop: 20 }}>
              &#128181; You will pay <strong>&#8377;{checkout.total}</strong> in cash
              when your order arrives at your door.
            </div>
          )}
        </div>

        {/* Right: bill summary */}
        <div className="card-panel">
          <h3 style={{ marginBottom: 14 }}>Bill summary</h3>

          <div style={{ fontSize: 14, display: "grid", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Subtotal</span>
              <span>&#8377;{checkout.subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Delivery fee</span>
              <span style={{ color: checkout.deliveryFee === 0 ? "#0aad0a" : "inherit" }}>
                {checkout.deliveryFee === 0 ? "FREE" : `₹${checkout.deliveryFee}`}
              </span>
            </div>
            {checkout.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#0aad0a" }}>
                <span>Coupon ({checkout.couponCode})</span>
                <span>&minus;&#8377;{checkout.discount}</span>
              </div>
            )}
            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              <span>Total</span>
              <span style={{ color: "#1a5c1a" }}>&#8377;{checkout.total}</span>
            </div>
          </div>

          <div className="deliver-to-box">
            &#128205; Delivering to:{" "}
            <strong>{checkout.address?.split(",")[0]}</strong>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", fontSize: 16, padding: "14px", marginTop: 16 }}
            disabled={processing}
          >
            {method === "cod"
              ? "Place Order"
              : `&#128274; Pay ₹${checkout.total}`}
          </button>

          <Link
            to="/checkout"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 12,
              color: "#666",
              fontSize: 13,
            }}
          >
            &#8592; Back to checkout
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Payment;

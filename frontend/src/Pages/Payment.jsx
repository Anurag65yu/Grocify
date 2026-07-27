import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useCatalog } from "../context/CatalogContext";
import "../styles/pages.css";

const METHODS = [
  { id: "upi", label: "UPI", desc: "Pay via GPay / PhonePe / Paytm" },
  { id: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay" },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when order arrives" },
];

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
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

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
      setError("Enter a valid UPI ID");
      return;
    }
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length < 12 || !card.expiry || !card.cvv) {
        setError("Enter complete card details");
        return;
      }
    }

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 900));

    try {
      const order = await placeOrder({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        phone: checkout.phone,
        address: checkout.address,
        items: checkout.items.map((i) => ({
          id: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal: checkout.subtotal,
        deliveryFee: checkout.deliveryFee,
        discount: checkout.discount,
        couponCode: checkout.couponCode,
        totalAmount: checkout.total,
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
      <h1 className="page-title">Payment</h1>
      <p className="page-sub">
        Amount payable: <strong>₹{checkout.total}</strong>
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="two-col" onSubmit={pay}>
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
                <div>
                  <strong>{m.label}</strong>
                  <div style={{ fontSize: 13, color: "#666" }}>{m.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {method === "upi" && (
            <div className="form-grid" style={{ marginTop: 18 }}>
              <label>
                UPI ID
                <input
                  type="text"
                  placeholder="name@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </label>
            </div>
          )}

          {method === "card" && (
            <div className="form-grid" style={{ marginTop: 18 }}>
              <label>
                Card number
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label>
                  Expiry
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  />
                </label>
                <label>
                  CVV
                  <input
                    type="password"
                    placeholder="***"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </label>
              </div>
              <p className="alert alert-info" style={{ marginBottom: 0 }}>
                Demo payment — any details will succeed.
              </p>
            </div>
          )}

          {method === "cod" && (
            <p className="alert alert-info" style={{ marginTop: 18, marginBottom: 0 }}>
              Pay ₹{checkout.total} in cash when your order is delivered.
            </p>
          )}
        </div>

        <div className="card-panel">
          <h3 style={{ marginBottom: 12 }}>Bill summary</h3>
          <div style={{ fontSize: 14, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>₹{checkout.subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery</span>
              <span>{checkout.deliveryFee === 0 ? "Free" : `₹${checkout.deliveryFee}`}</span>
            </div>
            {checkout.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#0aad0a" }}>
                <span>Discount ({checkout.couponCode})</span>
                <span>-₹{checkout.discount}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, marginTop: 8 }}>
              <span>Pay</span>
              <span>₹{checkout.total}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: 18 }}
            disabled={processing}
          >
            {processing ? "Processing..." : method === "cod" ? "Place Order" : "Pay Now"}
          </button>
          <Link
            to="/checkout"
            style={{ display: "block", textAlign: "center", marginTop: 12, color: "#0aad0a", fontSize: 14 }}
          >
            Back to checkout
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Payment;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import "../styles/pages.css";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse products, add items to your cart, proceed to checkout, enter your delivery address, and complete payment. You will receive an order confirmation immediately.",
  },
  {
    q: "What are your delivery hours?",
    a: "We deliver from 8 AM to 9 PM every day. Same-day delivery is available for orders placed before 5 PM.",
  },
  {
    q: "Can I modify or cancel my order?",
    a: "Yes, you can cancel or modify your order within 30 minutes of placing it. Go to Orders → select your order → Cancel Order.",
  },
  {
    q: "How do I apply a coupon?",
    a: "At the checkout page, enter your coupon code in the \"Apply Coupon\" field and click Apply. The discount will be reflected in your bill summary.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI (GPay, PhonePe, Paytm), Debit/Credit Cards (Visa, Mastercard, RuPay), and Cash on Delivery.",
  },
  {
    q: "How do I track my order?",
    a: "Go to Orders from the navigation menu. Click on any order to view its live delivery status and tracking updates.",
  },
];

function HelpCenter() {
  const [open, setOpen] = useState(null);

  return (
    <div className="page">
      <h1 className="page-title">Help Center</h1>
      <p className="page-sub">Find answers to common questions below.</p>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 10,
              marginBottom: 12,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: 600,
                fontSize: 15,
                color: "#1a1a1a",
              }}
            >
              {faq.q}
              {open === i ? <ChevronUp size={18} color="#2e7d32" /> : <ChevronDown size={18} color="#2e7d32" />}
            </button>
            {open === i && (
              <p style={{ padding: "0 20px 16px", color: "#555", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}

        <div
          style={{
            background: "#e8f5e9",
            borderRadius: 10,
            padding: "20px 24px",
            marginTop: 28,
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: 600, color: "#2e7d32", marginBottom: 6 }}>Still need help?</p>
          <p style={{ color: "#555", fontSize: 14, marginBottom: 0 }}>
            Email us at{" "}
            <a href="mailto:support@grocify.com" style={{ color: "#2e7d32", fontWeight: 600 }}>
              support@grocify.com
            </a>
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/" style={{ color: "#2e7d32", fontWeight: 600, textDecoration: "none" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;

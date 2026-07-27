import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import "../styles/pages.css";

function ReturnPolicy() {
  return (
    <div className="page">
      <h1 className="page-title">Return Policy</h1>
      <p className="page-sub">We stand behind the quality of every product we deliver.</p>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            background: "#e8f5e9",
            border: "1px solid #a5d6a7",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 24,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <CheckCircle size={26} color="#2e7d32" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h3 style={{ margin: "0 0 6px", color: "#2e7d32" }}>Our Promise</h3>
            <p style={{ margin: 0, color: "#555", fontSize: 14, lineHeight: 1.7 }}>
              If you receive a damaged, spoiled, or incorrect item, we will replace it or issue a full refund — no questions asked.
            </p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <CheckCircle size={22} color="#2e7d32" />
            <h3 style={{ margin: 0, fontSize: 16 }}>What we accept returns for</h3>
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {[
              "Damaged or broken products upon delivery",
              "Spoiled or expired perishable items",
              "Wrong item delivered",
              "Missing items from your order",
              "Quality not as described",
            ].map((item, i) => (
              <li key={i} style={{ color: "#555", fontSize: 14, lineHeight: 1.9 }}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <XCircle size={22} color="#c62828" />
            <h3 style={{ margin: 0, fontSize: 16 }}>What we cannot accept returns for</h3>
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {[
              "Change of mind after delivery",
              "Products damaged after delivery due to mishandling",
              "Opened personal care or hygiene products",
            ].map((item, i) => (
              <li key={i} style={{ color: "#555", fontSize: 14, lineHeight: 1.9 }}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <RefreshCw size={22} color="#2e7d32" />
            <h3 style={{ margin: 0, fontSize: 16 }}>How to request a return</h3>
          </div>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {[
              "Go to Orders from the navigation menu",
              "Select the order containing the item",
              "Click \"Report Issue\" and describe the problem",
              "Our team will review and respond within 24 hours",
              "Refunds are processed within 3–5 business days",
            ].map((step, i) => (
              <li key={i} style={{ color: "#555", fontSize: 14, lineHeight: 1.9 }}>{step}</li>
            ))}
          </ol>
        </div>

        <p style={{ color: "#888", fontSize: 13, textAlign: "center", marginBottom: 20 }}>
          For urgent issues, email us at{" "}
          <a href="mailto:support@grocify.com" style={{ color: "#2e7d32" }}>support@grocify.com</a>
        </p>

        <div style={{ textAlign: "center" }}>
          <Link to="/" style={{ color: "#2e7d32", fontWeight: 600, textDecoration: "none" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReturnPolicy;

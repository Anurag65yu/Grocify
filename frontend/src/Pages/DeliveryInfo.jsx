import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, MapPin, Package } from "lucide-react";
import "../styles/pages.css";

const sections = [
  {
    icon: <Clock size={28} color="#2e7d32" />,
    title: "Delivery Hours",
    points: [
      "Monday – Sunday: 8:00 AM – 9:00 PM",
      "Same-day delivery for orders placed before 5:00 PM",
      "Express delivery (2 hours) available in select areas",
    ],
  },
  {
    icon: <Truck size={28} color="#2e7d32" />,
    title: "Delivery Charges",
    points: [
      "Free delivery on orders above ₹499",
      "₹30 delivery fee on orders below ₹499",
      "No extra charge for scheduled deliveries",
    ],
  },
  {
    icon: <MapPin size={28} color="#2e7d32" />,
    title: "Delivery Areas",
    points: [
      "Currently serving Lucknow and surrounding areas",
      "Pin codes: 226001 – 226030 covered",
      "Expanding to more cities soon!",
    ],
  },
  {
    icon: <Package size={28} color="#2e7d32" />,
    title: "Packaging",
    points: [
      "All products are packed in food-safe, eco-friendly packaging",
      "Perishables are packed with ice packs during summer",
      "Fragile items are bubble-wrapped for protection",
    ],
  },
];

function DeliveryInfo() {
  return (
    <div className="page">
      <h1 className="page-title">Delivery Information</h1>
      <p className="page-sub">Everything you need to know about how we deliver your groceries.</p>

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 20,
        }}
      >
        {sections.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "24px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              {s.icon}
              <h3 style={{ margin: 0, fontSize: 17, color: "#1a1a1a" }}>{s.title}</h3>
            </div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {s.points.map((p, j) => (
                <li key={j} style={{ color: "#555", fontSize: 14, lineHeight: 1.8 }}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link to="/" style={{ color: "#2e7d32", fontWeight: 600, textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default DeliveryInfo;

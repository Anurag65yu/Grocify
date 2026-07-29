import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import SearchBar from "./SearchBar";
import "./Header.css";

function useLocationCity() {
  const [city, setCity] = useState(() => localStorage.getItem("grocify_city") || "Lucknow");
  const [detecting, setDetecting] = useState(false);

  const detect = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const detected =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Your location";
          setCity(detected);
          localStorage.setItem("grocify_city", detected);
        } catch {
          // keep existing city on network failure
        } finally {
          setDetecting(false);
        }
      },
      () => setDetecting(false)
    );
  };

  useEffect(() => {
    // Auto-detect only on first ever visit (no cached city)
    if (!localStorage.getItem("grocify_city")) detect();
  }, []);

  return { city, detecting, detect };
}

function Header({ search, setSearch }) {
  const auth = useAuth();
  const user = auth?.user;
  const isAuthenticated = auth?.isAuthenticated;
  const isAdmin = auth?.isAdmin;
  const logout = auth?.logout || (() => {});
  const { cartCount } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { city, detecting, detect } = useLocationCity();

  return (
    <header className="header">
      <div className="top-header">
        <div className="logo">
          <Link to="/">Grocify</Link>
        </div>

        <button
          type="button"
          className="location"
          onClick={detect}
          title="Click to detect your location"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "inherit",
          }}
        >
          <span>&#128205;</span>
          <span>{detecting ? "Detecting..." : city}</span>
        </button>

        <div className="header-search">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className={`header-buttons ${menuOpen ? "open" : ""}`}>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button
                type="button"
                className="logout-btn"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/">Home</Link>
        <Link to="/category/Fruits">Fruits</Link>
        <Link to="/category/Vegetables">Vegetables</Link>
        <Link to="/category/Dairy">Dairy</Link>
        <Link to="/category/Snacks">Snacks</Link>
        <Link to="/category/Beverages">Beverages</Link>
      </nav>
    </header>
  );
}

export default Header;

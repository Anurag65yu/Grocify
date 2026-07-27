import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import SearchBar from "./SearchBar";
import "./Header.css";

function Header({ search, setSearch }) {
  const auth = useAuth();
  const user = auth?.user;
  const isAuthenticated = auth?.isAuthenticated;
  const isAdmin = auth?.isAdmin;
  const logout = auth?.logout || (() => {});
  const { cartCount } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="top-header">
        <div className="logo">
          <Link to="/">Grocify</Link>
        </div>

        <div className="location">Lucknow</div>

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
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                Orders
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
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
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
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

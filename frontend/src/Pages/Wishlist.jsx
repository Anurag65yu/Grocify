import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import "../styles/pages.css";

const isObjectId = (val) => /^[a-f\d]{24}$/i.test(String(val ?? ""));

function Wishlist() {
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="page">
      <h1 className="page-title">My Wishlist</h1>
      <p className="page-sub">Saved items you can add to cart anytime.</p>

      {wishlistItems.length === 0 ? (
        <div className="card-panel empty-state">
          <p>No items in wishlist yet.</p>
          <Link to="/">Browse products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((product) => {
            const categoryLabel = isObjectId(product.category)
              ? product.unit
              : product.category;
            return (
              <div className="card-panel" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>{product.name}</h3>
                <p style={{ color: "#777", fontSize: 13, marginBottom: 8 }}>
                  {categoryLabel}
                </p>
                <p style={{ fontWeight: 700, color: "#0aad0a", marginBottom: 12 }}>
                  ₹{product.price}
                </p>
                <div className="actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => toggleWishlist(product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;

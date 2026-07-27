import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ShoppingCart.css";

function ShoppingCart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } =
    useContext(CartContext);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Browse products</Link>
        </p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <div className="quantity-box">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h3 className="total">Total: ₹{cartTotal}</h3>

          <Link to="/checkout" className="checkout-link">
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;

import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Grocify</h3>
          <p>Fresh groceries delivered to your doorstep.</p>
        </div>

        <div className="footer-section">
          <h4>Customer Support</h4>
          <ul>
            <li><Link to="/help" className="footer-link">Help Center</Link></li>
            <li><Link to="/delivery-info" className="footer-link">Delivery Information</Link></li>
            <li><Link to="/return-policy" className="footer-link">Return Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
              <Facebook size={22} />
              <span>Facebook</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
              <Instagram size={22} />
              <span>Instagram</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
              <Twitter size={22} />
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </div>

      <div className="copyright">
        © 2026 Grocify. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;

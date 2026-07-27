import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
              <FacebookIcon />
              <span>Facebook</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
              <InstagramIcon />
              <span>Instagram</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
              <TwitterIcon />
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </div>

      <div className="copyright">
        &copy; 2026 Grocify. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;

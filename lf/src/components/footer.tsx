import "../styling/footer.css";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section company">
          <h3 className="footer-logo">Findify</h3>
          <p>Lost & Found Management System</p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/lost">Lost Items</a>
            </li>
            <li>
              <a href="/found">Found Items</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section connect">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="#" aria-label="Twitter">
              <FaXTwitter />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
          <p className="footer-social">
            <a href="mailto:support@gmail.com">Email: support@gmail.com</a>
          </p>
          <p className="footer-social">
            <a href="tel:+911234567890">Phone: +91-12345-67890</a>
          </p>
        </div>

        <div className="footer-section query-form">
          <h4>Have a question?</h4>
          <form>
            <textarea
              placeholder="Type your question..."
              className="query-textarea"
            />

            <button type="submit" className="query-btn">
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Findify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

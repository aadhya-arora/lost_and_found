import React, { useState } from "react";
import "../styling/footer.css";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

type Props = {};

const Footer: React.FC<Props> = () => {
  const [question, setQuestion] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const backendUrl =
    (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:5000";

  const validateEmail = (value: string) => {
    if (!value) return true; // optional
    // simple email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!question.trim()) {
      setStatusMsg("Please enter a question.");
      return;
    }
    if (!validateEmail(email)) {
      setStatusMsg("Please enter a valid email address.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${backendUrl}/api/footer-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), question: question.trim() }),
      });

      if (res.ok) {
        setStatusMsg("Thanks — your question was sent!");
        setQuestion("");
        setEmail("");
      } else {
        const data = await res.json().catch(() => null);
        setStatusMsg(
          data?.message || "Failed to send your question. Please try again."
        );
      }
    } catch (err) {
      console.error("submit error:", err);
      setStatusMsg("Server error while sending your question.");
    } finally {
      setSending(false);
      // clear status message after a short while (optional)
      setTimeout(() => setStatusMsg(null), 8000);
    }
  };

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer-content">
        <div className="footer-section company">
          <h3 className="footer-logo">Findify</h3>
          <p>Lost &amp; Found Management System</p>
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

          <form onSubmit={handleSubmit} aria-live="polite" className="footer-form">
            <label htmlFor="footer-email" className="visually-hidden">
              Your email (optional)
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              placeholder="Your email (optional)"
              className="query-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Your email (optional)"
              aria-invalid={!validateEmail(email) ? "true" : "false"}
            />

            <label htmlFor="footer-question" className="visually-hidden">
              Type your question
            </label>
            <textarea
              id="footer-question"
              name="question"
              placeholder="Type your question..."
              className="query-textarea"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

            <button
              type="submit"
              className="query-btn"
              disabled={sending}
              aria-disabled={sending}
            >
              {sending ? "Sending..." : "Submit"}
            </button>

            {statusMsg && <div className="footer-status">{statusMsg}</div>}
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

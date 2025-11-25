import contact from "../assets/contact.png";
import "../styling/contact.css";
import { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const validateEmail = (value: string) => {
    if (!value) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!name.trim()) {
      setStatusMsg("Please enter your name.");
      return;
    }
    if (!query.trim()) {
      setStatusMsg("Please write your message.");
      return;
    }
    if (!validateEmail(email)) {
      setStatusMsg("Please enter a valid email address.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: query.trim() }),
      });

      if (res.ok) {
        setStatusMsg("Thanks your query has been sent!");
        setName("");
        setEmail("");
        setQuery("");
      } else {
        const data = await res.json().catch(() => null);
        setStatusMsg(data?.message || "Failed to send your message. Please try again.");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatusMsg("Server error while sending your message.");
    } finally {
      setSending(false);
      setTimeout(() => setStatusMsg(null), 8000);
    }
  };

  return (
    <div>
      <div className="contact-hero-section">
        <div className="contact-left">
          <h1 className="contact-heading">Get In Touch</h1>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                className="contact-form-input"
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                className="contact-form-input"
                type="email"
                id="email"
                placeholder="Enter your email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="query">Your Query</label>
              <textarea
                className="contact-form-textarea"
                id="query"
                placeholder="Write your message here"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn2" disabled={sending}>
              {sending ? "Sending..." : "Submit"}
            </button>
            {statusMsg && <div className="contact-status">{statusMsg}</div>}
          </form>
        </div>
        <div className="contact-right">
          <img
            src={contact}
            className="contact-image"
            alt="Contact illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;

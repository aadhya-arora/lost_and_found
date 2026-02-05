import contact from "../assets/contact.png";
import "../styling/contact.css";
import { useState } from "react";
import axios from "axios";
import Footer from "../components/footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", msg: "", isError: false });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await axios.post(`${backendUrl}/api/contact`, {
        name: name.trim(),
        email: email.trim(),
        message: query.trim()
      });

      setModal({ show: true, title: "Success", msg: res.data.message, isError: false });
      setName("");
      setEmail("");
      setQuery("");
    } catch (err: any) {
      setModal({ 
        show: true, 
        title: "Error", 
        msg: err.response?.data?.message || "Failed to send your message.", 
        isError: true 
      });
    } finally {
      setSending(false);
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
          </form>
        </div>
        <div className="contact-right">
          <img src={contact} className="contact-image" alt="Contact illustration" />
        </div>
      </div>

      {/* Modal matching your report/found style */}
      {modal.show && (
        <div className="modal-overlay">
          <div className={`modal-content ${modal.isError ? 'modal-error' : 'modal-success'}`}>
            <h2>{modal.title}</h2>
            <p>{modal.msg}</p>
            <button onClick={() => setModal({ ...modal, show: false })} className="submit-report-button">
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Contact;
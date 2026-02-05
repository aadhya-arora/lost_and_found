import React, { useState } from "react";
import axios from "axios";
import "../styling/contact.css";
import contact_img from "../assets/contact.png";
import Footer from "../components/footer";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [modal, setModal] = useState({ show: false, title: "", msg: "", isError: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await axios.post(`${backendUrl}/api/contact`, formData);
      setModal({
        show: true,
        title: "Success!",
        msg: response.data.message,
        isError: false,
      });
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error: any) {
      setModal({
        show: true,
        title: "Submission Failed",
        msg: error.response?.data?.message || "Something went wrong. Check if backend is running.",
        isError: true,
      });
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">
        <div className="contact-image-section">
          <img src={contact_img} alt="Contact Us" className="contact-image" />
        </div>

        <div className="contact-form-section">
          <h1 className="contact-header">Get in Touch</h1>
          <p className="contact-subline">Have a question? We'd love to hear from you.</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" rows={5} required />
            </div>

            <button type="submit" className="contact-submit-btn">Send Message</button>
          </form>
        </div>
      </div>

      {/* Status Modal */}
      {modal.show && (
        <div className="modal-overlay">
          <div className={`modal-content ${modal.isError ? "modal-error" : "modal-success"}`}>
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
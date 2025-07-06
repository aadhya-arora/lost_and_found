import contact from "../assets/contact.png";
import "../styling/contact.css";

const Contact = () => {
  return (
    <div>
      <div className="contact-hero-section">
        <div className="contact-left">
          <h1 className="contact-heading">Get In Touch</h1>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="query">Your Query</label>
              <textarea
                id="query"
                placeholder="Write your message here"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
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

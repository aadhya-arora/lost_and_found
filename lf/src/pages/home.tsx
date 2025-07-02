import "../styling/home.css";
import { useState } from "react";
import { FaRegEdit, FaBell, FaHandshake } from "react-icons/fa";
import { FaShieldAlt, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import Footer from "../components/footer";
const Home = () => {
  const [showMoreFAQs, setShowMoreFAQs] = useState(false);

  const posts = [
    {
      id: 1,
      image: "https://via.placeholder.com/150", // replace with real images
      title: "Lost: Black Wallet",
      location: "Connaught Place, Delhi",
      date: "27 June 2025",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "Found: Golden Retriever",
      location: "Sector 62, Noida",
      date: "25 June 2025",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/150",
      title: "Lost: Laptop Bag",
      location: "MG Road, Bangalore",
      date: "24 June 2025",
    },
  ];

  return (
    <div>
      <div className="hero-section">
        <div className="left-side">
          <h1 className="web-name">Findify</h1>
          <p className="web-line">Where lost things find their way home</p>
          <div className="btns">
            <button className="find"> Report Lost Item</button>
            <button className="report"> Report Found Item</button>
          </div>
        </div>
        <div className="right-side">
          <img src={logo} className="hero-image"></img>
        </div>
      </div>
      <div className="working">
        <h1 className="working-heading">How it Works?</h1>
        <div className="steps">
          <div className="step">
            <FaRegEdit size={50} color="#132a13" />
            <h3>Report</h3>
            <p>Report your lost or found item easily.</p>
          </div>
          <div className="step">
            <FaBell size={50} color="#132a13" />
            <h3>Get Notified</h3>
            <p>Receive alerts when someone finds or claims it.</p>
          </div>
          <div className="step">
            <FaHandshake size={50} color="#132a13" />
            <h3>Reunite</h3>
            <p>Connect and safely reunite with your item.</p>
          </div>
        </div>
      </div>
      <div className="categories-section">
        <h2 className="category-heading">Search by Category</h2>
        <div className="category">
          <div className="electronics-card">
            <div className="electronic-inner">
              <div className="electronic-front"></div>
              <div className="electronic-back">
                <p className="electronic-info">Electronics</p>
              </div>
            </div>
          </div>
          <div className="bags-card">
            <div className="bags-inner">
              <div className="bags-front"></div>
              <div className="bags-back">
                <p className="bags-info">Bags & Wallet</p>
              </div>
            </div>
          </div>
          <div className="stationary-card">
            <div className="stationary-inner">
              <div className="stationary-front"></div>
              <div className="stationary-back">
                <p className="stationary-info">Stationary</p>
              </div>
            </div>
          </div>
          <div className="documents-card">
            <div className="documents-inner">
              <div className="documents-front"></div>
              <div className="documents-back">
                <p className="documents-info">Documents</p>
              </div>
            </div>
          </div>
          <div className="accessory-card">
            <div className="accessory-inner">
              <div className="accessory-front"></div>
              <div className="accessory-back">
                <p className="accessory-info">Accessories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="latest-posts-section">
        <h2>Latest Lost and Found</h2>
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <img src={post.image} alt={post.title} className="post-image" />
              <h3>{post.title}</h3>
              <p className="location">{post.location}</p>
              <p className="date">{post.date}</p>
              <button className="details-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>
      <div className="safety-tips-section">
        <h2>Safety Tips</h2>
        <div className="tips-list">
          <div className="tip">
            <FaCheckCircle size={40} color="#4f772d" />
            <p>Verify ownership before handing over any item.</p>
          </div>
          <div className="tip">
            <FaMapMarkerAlt size={40} color="#4f772d" />
            <p>
              Always meet in safe, public places (e.g., police station, mall).
            </p>
          </div>
          <div className="tip">
            <FaShieldAlt size={40} color="#4f772d" />
            <p>Avoid sharing personal details beyond what is necessary.</p>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <FaQuestionCircle size={30} color="#4f772d" />
            <p>How do I post a found item?</p>
          </div>
          <div className="faq-item">
            <FaQuestionCircle size={30} color="#4f772d" />
            <p>What happens after I report a lost item?</p>
          </div>
          <div className="faq-item">
            <FaQuestionCircle size={30} color="#4f772d" />
            <p>Is it free to use?</p>
          </div>

          {showMoreFAQs && (
            <>
              <div className="faq-item">
                <FaQuestionCircle size={30} color="#4f772d" />
                <p>How can I contact the finder safely?</p>
              </div>
              <div className="faq-item">
                <FaQuestionCircle size={30} color="#4f772d" />
                <p>Can I edit or delete my post later?</p>
              </div>
              <div className="faq-item">
                <FaQuestionCircle size={30} color="#4f772d" />
                <p>Do I need to create an account to post?</p>
              </div>
            </>
          )}
        </div>
        <button
          className="view-more"
          onClick={() => setShowMoreFAQs(!showMoreFAQs)}
        >
          {showMoreFAQs ? "Show less ←" : "View all FAQs →"}
        </button>
      </div>
      <Footer />
    </div>
  );
};
export default Home;

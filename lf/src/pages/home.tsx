import "../styling/home.css";
import { useState, useEffect } from "react";
import { FaRegEdit, FaBell, FaHandshake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import Footer from "../components/footer";

const Home = () => {
  const [showMoreFAQs, setShowMoreFAQs] = useState(false);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
       const [lostRes, foundRes] = await Promise.all([
        fetch(`${backendUrl}/lost`),
        fetch(`${backendUrl}/found`),
      ]);

        const lostData = await lostRes.json();
        const foundData = await foundRes.json();

        const lostWithType = lostData.map((item: any) => ({
          ...item,
          type: "lost",
          date: item.dateLost,
        }));

        const foundWithType = foundData.map((item: any) => ({
          ...item,
          type: "found",
          date: item.dateFound,
        }));

        const allPosts = [...lostWithType, ...foundWithType].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setLatestPosts(allPosts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [backendUrl]);
  const navigate = useNavigate();

  return (
    <div>
      <div className="hero-section">
        <div className="left-side">
          <h1 className="web-name">Findify</h1>
          <p className="web-line">Where lost things find their way home</p>
          <div className="btns">
            <button className="find" onClick={() => navigate("/found")}>
              Find Your Lost Item
            </button>
            <button className="report" onClick={() => navigate("/report")}>
              Report an Item
            </button>
          </div>
        </div>
        <div className="right-side">
          <img src={logo} className="hero-image" alt="Findify Logo" />
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
      <div className="latest-posts-section">
        <h2>Latest Lost and Found</h2>
        <div className="posts-grid">
          {latestPosts.length === 0 ? (
            <p>No recent posts available.</p>
          ) : (
            latestPosts.map((post) => (
              <div key={post._id} className="post-card">
                <img
                  src={post.imageUrl || "https://via.placeholder.com/150"}
                  alt={post.name}
                  className="post-image"
                />

                <h3>
                  {post.type}: {post.title}
                </h3>

                <p className="product-name">{post.name}</p>
                <p className="location">{post.location}</p>
                <p className="date">
                  {post.date ? new Date(post.date).toDateString() : "No date"}
                </p>
                <button className="details-btn" onClick={() => navigate("/found")} >View Details</button>
              </div>
            ))
          )}
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
          <div className="faq-item" onClick={() => navigate("/faq")}>
            <FaQuestionCircle size={30} color="#4f772d" />
            <p>How do I post a found item?</p>
          </div>
          <div className="faq-item" onClick={() => navigate("/faq")}>
            <FaQuestionCircle size={30} color="#4f772d" />
            <p>What happens after I report a lost item?</p>
          </div>
          <div className="faq-item" onClick={() => navigate("/faq")}>
            <FaQuestionCircle size={30} color="#4f772d" />
            <p>Is it free to use?</p>
          </div>

          {showMoreFAQs && (
            <>
              <div className="faq-item" onClick={() => navigate("/faq")}>
                <FaQuestionCircle size={30} color="#4f772d" />
                <p>How can I contact the finder safely?</p>
              </div>
              <div className="faq-item" onClick={() => navigate("/faq")}>
                <FaQuestionCircle size={30} color="#4f772d" />
                <p>Can I edit or delete my post later?</p>
              </div>
              <div className="faq-item" onClick={() => navigate("/faq")}>
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

import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../styling/navbar.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import GoogleTranslateWidget from "../pages/GoogleTranslateWidget";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

useEffect(() => {
  const checkLoginStatus = async () => {
    try {
     await axios.get(`${backendUrl}/me`, {
  withCredentials: true,
});
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    }
  };

  checkLoginStatus();
}, [backendUrl]);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
  try {
    await axios.post(
      `${backendUrl}/logout`,
      {},
      { withCredentials: true }
    );
    setIsLoggedIn(false);
    navigate("/");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  return (
    <nav className="navbar">
      <h1 className="logo">Findify</h1>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-item">Home</Link>
        </li>
        <li>
          <Link to="/found" className="nav-item">
            Find Items
          </Link>
        </li>
        <li>
          <Link to="/report" className="nav-item">
            Report Items
          </Link>
        </li>
        <li>
          <Link to="/faq" className="nav-item">
            FAQ
          </Link>
        </li>
        <li>
          <Link to="/contact" className="nav-item">
            Contact Us
          </Link>
        </li>
      </ul>
      <div className="profile-icon-container">
        <FaUserCircle
          size={40}
          className="profile"
          onClick={toggleProfileMenu}
        />
        {showProfileMenu && (
          <div className="profile-menu-tooltip">
            <ul>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li>
                    <Link to="/help">Help</Link>
                  </li>
                  <li>
                    <Link to="/my-reports">My Reports</Link>
                  </li>
                  <li onClick={handleLogout}>
                    <Link to="/">Log Out</Link>
                  </li>
                  <li>
                    <div className="translate-widget">
                      <GoogleTranslateWidget />
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/auth">Log In</Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

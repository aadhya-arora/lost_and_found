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

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await axios.get("http://localhost:5000/user-status", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
        }
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
          <Link to="/">Home</Link>
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
                    <a href="/settings">Settings</a>
                  </li>
                  <li>
                    <a href="/help">Help</a>
                  </li>
                  <li>
                    <a href="/my-reports">My Reports</a>
                  </li>
                  <li onClick={handleLogout}>
                    <a href="#">Log Out</a>
                  </li>
                  <li>
                    <div className="translate-widget">
                      <GoogleTranslateWidget />
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <a href="/auth">Log In</a>
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

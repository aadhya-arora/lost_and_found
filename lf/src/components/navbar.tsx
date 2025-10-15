import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../styling/navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      await axios.post("http://localhost:5000/logout", {}, {
        withCredentials: true,
      });
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
          <a href="/" className="nav-item">
            Home
          </a>
        </li>
        <li>
          <a href="/found" className="nav-item">
            Find Items
          </a>
        </li>
        <li>
          <a href="/report" className="nav-item">
            Report Items
          </a>
        </li>
        <li>
          <a href="/faq" className="nav-item">
            FAQ
          </a>
        </li>
        <li>
          <a href="/contact" className="nav-item">
            Contact Us
          </a>
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
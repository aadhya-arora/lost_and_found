import { useState } from "react"; // Import useState
import { FaUserCircle } from "react-icons/fa";
import "../styling/navbar.css";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State to control tooltip visibility

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
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
              <li>
                <a href="/profile">My Profile</a>
              </li>
              <li>
                <a href="/settings">Settings</a>
              </li>
              <li>
                <a href="/contact">Help</a>
              </li>
              <li>
                <a href="/logout">Log Out</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

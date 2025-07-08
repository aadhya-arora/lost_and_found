// import logo from "../assets/main.png";
import { FaUserCircle } from "react-icons/fa";
import "../styling/navbar.css";
const Navbar = () => {
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
      <FaUserCircle size={40} className="profile" />
    </nav>
  );
};
export default Navbar;

import logo from "../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
import "../styling/navbar.css";
const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <ul className="nav-links">
        <li>
          <a href="/" className="nav-item">
            Home
          </a>
        </li>
        <li>
          <a href="/lost" className="nav-item">
            Lost Items
          </a>
        </li>
        <li>
          <a href="/found" className="nav-item">
            Found Items
          </a>
        </li>
        <li>
          <a href="/contact" className="nav-item">
            Contact Us
          </a>
        </li>
      </ul>
      <FaUserCircle size={40} color="#31572c" />
    </nav>
  );
};
export default Navbar;

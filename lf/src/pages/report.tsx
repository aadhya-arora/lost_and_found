import "../styling/report.css";
import { FaSearch } from "react-icons/fa";
import { HiOutlineExclamation } from "react-icons/hi";
import { HiOutlineCheckCircle } from "react-icons/hi";

const Report = () => {
  return (
    <div>
      <div className="report-hero-section">
        <div className="report-hero-search">
          <FaSearch size={30} color="#4f772d" />
        </div>
        <h1 className="report-header">Where Lost Items Find Their Way Home</h1>
        <p className="report-subline">
          Post your lost or found item and connect with trusted finders
        </p>
        <div className="report-choose">
          <button className="report-found">
            <HiOutlineCheckCircle size={30} /> <br />
            Found an item
          </button>
          <button className="report-lost">
            <HiOutlineExclamation size={30} /> <br />
            Lost an item
          </button>
        </div>
      </div>
      <div className="file-report">
        <div className="progress-bar">
          <div className="progress1"></div>
          <div className="progress2"></div>
          <div className="progress3"></div>
        </div>
        <div className="report-lost-item-section">
          <h1 className="lost-report-heading">Report a Lost Item</h1>
          <label htmlFor="item-name">Name</label>
          <input
            className="lost-item-name"
            type="text"
            id="item-name"
            placeholder="What have you lost?"
            required
          />
          <label htmlFor="item-category">Category</label>
          <input
            className="lost-category"
            type="text"
            id="item-category"
            placeholder="Category..."
            required
          />
          <label htmlFor="lost-description">Description</label>
          <textarea className="lost-description"></textarea>
        </div>
      </div>
    </div>
  );
};
export default Report;

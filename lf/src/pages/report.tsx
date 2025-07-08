import "../styling/report.css";
import { FaSearch } from "react-icons/fa";

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
          <button className="report-found">Found an item</button>
          <button className="report-lost">Lost an item</button>
        </div>
      </div>
    </div>
  );
};
export default Report;

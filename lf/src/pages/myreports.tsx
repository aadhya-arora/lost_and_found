import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/my-reports.css";
import Footer from "../components/footer";

interface UserItem {
  _id: string;
  name: string;
  imageUrl?: string;
  dateLost?: string;
  dateFound?: string;
  location: string;
  category: string;
  userId: string;
}

const MyReports: React.FC = () => {
  const [lostItems, setLostItems] = useState<UserItem[]>([]);
  const [foundItems, setFoundItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          axios.get("http://localhost:5000/my-lost-items", { withCredentials: true }),
          axios.get("http://localhost:5000/my-found-items", { withCredentials: true }),
        ]);

        setLostItems(lostRes.data);
        setFoundItems(foundRes.data);
      } catch (err) {
        console.error("Error fetching user reports:", err);
        setError("You must be logged in to view your reports. Redirecting to login page...");
        setTimeout(() => navigate("/auth"), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchUserReports();
  }, [navigate]);

  if (loading) {
    return <div className="reports-container">Loading your reports...</div>;
  }

  if (error) {
    return <div className="reports-container error-message">{error}</div>;
  }

  const renderItems = (items: UserItem[], type: "lost" | "found") => {
    if (items.length === 0) {
      return (
        <p className="no-items-message">No {type} items reported yet.</p>
      );
    }

    return items.map((item) => (
      <div key={item._id} className="report-card">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.name} className="report-image" />
        )}
        <div className="report-details">
          <h3>{item.name}</h3>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Location:</strong> {item.location}
          </p>
          <p>
            <strong>Date {type === "lost" ? "Lost" : "Found"}:</strong>{" "}
            {new Date(
              type === "lost" ? item.dateLost! : item.dateFound!
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="reports-container">
        <h1 className="reports-header">My Reports</h1>
        <div className="reports-grid">
          <div className="my-lost-items">
            <h2 className="section-heading lost-heading">My Lost Items</h2>
            <div className="report-list">{renderItems(lostItems, "lost")}</div>
          </div>
          <div className="my-found-items">
            <h2 className="section-heading found-heading">My Found Items</h2>
            <div className="report-list">{renderItems(foundItems, "found")}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyReports;
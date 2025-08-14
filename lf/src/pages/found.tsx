import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styling/found.css";

interface LostItem {
  _id: string;
  name: string;
  color?: string;
  brand?: string;
  uniqueId?: string;
  dateLost: string;
  timeLost: string;
  imageUrl?: string;
  location: string;
  category?: string;
  phone: string;
  email: string;
}

interface FoundItem {
  _id: string;
  name: string;
  color?: string;
  brand?: string;
  uniqueId?: string;
  dateFound: string;
  imageUrl?: string;
  location: string;
  category?: string;
  phone: string;
  email: string;
}

const Found = () => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);

  useEffect(() => {
    fetchLostItems();
    fetchFoundItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/lost");
      setLostItems(response.data);
    } catch (error) {
      console.error("Error fetching lost items:", error);
    }
  };

  const fetchFoundItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/found");
      setFoundItems(response.data);
    } catch (error) {
      console.error("Error fetching found items:", error);
    }
  };

  return (
    <div className="found-container">
      <div className="found-hero-section">
        <h1 className="found-hero-header">Lost & Found Items</h1>
        <p className="found-hero-subline">
          Browse through items reported lost and found by our community.
        </p>
      </div>
      <div className="items-grid">
        <div className="items-lost">
          <h2 className="section-heading lost-heading">Lost Items</h2>
          {lostItems.length === 0 ? (
            <p className="no-items-message">No lost items to display.</p>
          ) : (
            <div className="item-list">
              {lostItems.map((item) => (
                <div key={item._id} className="item-card lost-card">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="item-image"
                    />
                  )}
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p>
                      <strong>Date Lost:</strong>{" "}
                      {new Date(item.dateLost).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time Lost:</strong> {item.timeLost}
                    </p>
                    {item.location && (
                      <p>
                        <strong>Location:</strong> {item.location}
                      </p>
                    )}
                    {item.brand && (
                      <p>
                        <strong>Brand:</strong> {item.brand}
                      </p>
                    )}
                    {item.color && (
                      <p>
                        <strong>Color:</strong> {item.color}
                      </p>
                    )}
                    <button className="report-found-button">
                      Report Found
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="items-found">
          <h2 className="section-heading found-heading">Found Items</h2>
          {foundItems.length === 0 ? (
            <p className="no-items-message">No found items to display.</p>
          ) : (
            <div className="item-list">
              {foundItems.map((item) => (
                <div key={item._id} className="item-card found-card">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="item-image"
                    />
                  )}
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p>
                      <strong>Date Found:</strong>{" "}
                      {new Date(item.dateFound).toLocaleDateString()}
                    </p>
                    {item.location && (
                      <p>
                        <strong>Location:</strong> {item.location}
                      </p>
                    )}
                    {item.brand && (
                      <p>
                        <strong>Brand:</strong> {item.brand}
                      </p>
                    )}
                    {item.color && (
                      <p>
                        <strong>Color:</strong> {item.color}
                      </p>
                    )}
                    <button className="claim-button">Claim this item</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Found;

import { useEffect, useState } from "react";
import axios from "axios";
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

  const groupItemsByCategory = (items: (LostItem | FoundItem)[]) => {
    return items.reduce((acc, item) => {
      const category = item.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, (LostItem | FoundItem)[]>);
  };

  const groupedLostItems = groupItemsByCategory(lostItems);
  const groupedFoundItems = groupItemsByCategory(foundItems);

  const renderItems = (
    groupedItems: Record<string, (LostItem | FoundItem)[]>,
    isLost: boolean
  ) => {
    const categories = Object.keys(groupedItems).sort();

    if (categories.length === 0) {
      return (
        <p className="no-items-message">
          No {isLost ? "lost" : "found"} items to display.
        </p>
      );
    }

    return categories.map((category) => (
      <div key={category} className="category-section">
        <h3 className="category-heading">{category}</h3>
        <div className="item-list">
          {groupedItems[category].map((item) => (
            <div
              key={item._id}
              className={`item-card ${isLost ? "lost-card" : "found-card"}`}
            >
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
                  <strong>{isLost ? "Date Lost" : "Date Found"}:</strong>{" "}
                  {new Date(
                    isLost
                      ? (item as LostItem).dateLost
                      : (item as FoundItem).dateFound
                  ).toLocaleDateString()}
                </p>
                {isLost && (item as LostItem).timeLost && (
                  <p>
                    <strong>Time Lost:</strong> {(item as LostItem).timeLost}
                  </p>
                )}
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
                <button
                  className={`${
                    isLost ? "report-found-button" : "claim-button"
                  }`}
                >
                  {isLost ? "Report Found" : "Claim this item"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
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
          {renderItems(groupedLostItems, true)}
        </div>
        <div className="items-found">
          <h2 className="section-heading found-heading">Found Items</h2>
          {renderItems(groupedFoundItems, false)}
        </div>
      </div>
    </div>
  );
};

export default Found;

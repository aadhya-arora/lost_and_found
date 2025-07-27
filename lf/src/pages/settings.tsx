import { useState } from "react";
import "../styling/settings.css";
// import { FaInfoCircle } from "react-icons/fa"; // Remove if not using other info icons

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <>
      <div className="settings-options">
        <a
          className={activeTab === "Account" ? "active" : ""}
          onClick={() => setActiveTab("Account")}
        >
          Account
        </a>
        <a
          className={activeTab === "Preferences" ? "active" : ""}
          onClick={() => setActiveTab("Preferences")}
        >
          Preferences
        </a>
        <a
          className={activeTab === "Contact Information" ? "active" : ""}
          onClick={() => setActiveTab("Contact Information")}
        >
          Contact Information
        </a>
      </div>

      <div className="settings-content">
        {activeTab === "Account" && (
          <div>
            <p className="account-settings-p">
              Change your account information
            </p>
            <div className="account-settings">
              <p>Username</p>
              <input type="text" value="aadiiiiiiaaa" readOnly />{" "}
              <a href="#" className="action-link">
                Change username
              </a>
              <p>Password</p>
              <span>********</span>
              <a href="#" className="action-link">
                Change password
              </a>
              <p>Email</p>
              <input type="email" value="aadhu2705@gmail.com" readOnly />
              <br />
              <p>Date of Birth</p>
              <div className="date-input-container">
                <input type="date" value="2005-08-27" readOnly />
                <span
                  className="info-icon"
                  title="Your date of birth is private"
                >
                  ⓘ
                </span>
              </div>
              <span className="grid-placeholder"></span>{" "}
              <button type="submit" className="submit-button">
                Save Changes
              </button>
            </div>
          </div>
        )}
        {activeTab === "Preferences" && (
          <div className="tab-content">Preferences Content...</div>
        )}
        {activeTab === "Contact Information" && (
          <div className="tab-content">Contact Info Content...</div>
        )}
      </div>
    </>
  );
};

export default Settings;

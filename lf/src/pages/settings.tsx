import React, { useState } from "react";
import "../styling/settings.css";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Account");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [emailNotificationsOn, setEmailNotificationsOn] =
    useState<boolean>(true);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    console.log(`Language changed to: ${e.target.value}`);
  };
  const handleEmailNotificationsToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailNotificationsOn(e.target.checked);
    console.log(`Email Notifications: ${e.target.checked ? "On" : "Off"}`);
  };

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
      </div>

      <div className="settings-content">
        {activeTab === "Account" && (
          <div className="accounts-tab">
            <p className="account-settings-p">
              Change your account information
            </p>
            <div className="account-settings">
              <p>Username</p>
              <input type="text" value="aadiiiiiiaaa" readOnly />
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
              <span className="grid-placeholder"></span> <p>Contact No:</p>
              <div className="date-input-container">
                <input type="tel" value="No data yet" readOnly />
                <span
                  className="info-icon"
                  title="Add your contact information"
                >
                  <a href="#" className="action-link">
                    Add contact info
                  </a>
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
          <div className="preference-tab">
            <p className="account-settings-p">Manage your preferences</p>
            <div className="preference-settings">
              <p>Language</p>
              <select value={selectedLanguage} onChange={handleLanguageChange}>
                <option value="English">English</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
              <span className="grid-placeholder"></span>
              <p>Time Zone</p>
              <select defaultValue="Asia/Kolkata">
                <option value="UTC-12">UTC-12:00 (Baker Island)</option>
                <option value="Asia/Kolkata">UTC+05:30 (Kolkata)</option>
                <option value="America/New_York">UTC-05:00 (New York)</option>
                <option value="Europe/London">UTC+00:00 (London)</option>
                <option value="Asia/Tokyo">UTC+09:00 (Tokyo)</option>
                <option value="Australia/Sydney">UTC+10:00 (Sydney)</option>
              </select>
              <span className="grid-placeholder"></span>
              <p>Email Notifications</p>
              <div className="toggle-switch-container">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotificationsOn}
                  onChange={handleEmailNotificationsToggle}
                  className="toggle-checkbox"
                />
                <label
                  htmlFor="emailNotifications"
                  className="toggle-label"
                ></label>
                <span className="toggle-text">
                  {emailNotificationsOn ? "On" : "Off"}
                </span>
              </div>
              <span className="grid-placeholder"></span> {/* For alignment */}
              <button type="submit" className="submit-button">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;

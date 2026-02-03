import React, { useState, useEffect } from "react";
import "../styling/settings.css";
import GoogleTranslateWidget from "./GoogleTranslateWidget";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Account");
  const [user, setUser] = useState<{
    username?: string;
    email?: string;
    contactNo?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [password, setPassword] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [contactNo, setContactNo] = useState(user.contactNo || "");

  const handleSaveContact = async () => {
    try {
      const res = await fetch(`${backendUrl}/update-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contactNo }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Contact info updated successfully!");
        setUser((prev) => ({ ...prev, contactNo }));
        setShowContactModal(false);
      } else {
        alert(data.message || "Failed to update contact info");
      }
    } catch (err) {
      console.error("Error updating contact:", err);
      alert("Server error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      alert("Please enter your password first.");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/delete-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Your account has been permanently deleted.");
        window.location.href = "/auth";
      } else {
        alert(data.message || "Incorrect password. Try again.");
      }
    } catch (err) {
      console.error("Delete account error:", err);
      alert("Server error. Please try again later.");
    }
  };

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${backendUrl}/me`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.warn("User not logged in or session expired");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [backendUrl]);

  const handleUpdateUsername = async () => {
    try {
      const res = await fetch(`${backendUrl}/update-username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Username updated successfully!");
        setUser((prev) => ({ ...prev, username: newUsername }));
        setIsEditingUsername(false);
      } else {
        alert(data.message || "Failed to update username");
      }
    } catch (err) {
      console.error("Error updating username:", err);
      alert("Server error");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        alert("Logged out successfully");
        window.location.href = "/auth";
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Server error");
    }
  };

  if (loading) return <p className="loading-text">Loading user info...</p>;

  return (
    <div className="settings-page">
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
          className={activeTab === "Delete" ? "active" : ""}
          onClick={() => setActiveTab("Delete")}
        >
          Delete Account
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
              {isEditingUsername ? (
                <>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <a
                      href="#"
                      className="action-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpdateUsername();
                      }}
                    >
                      Save
                    </a>
                    <a
                      href="#"
                      className="action-link cancel"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditingUsername(false);
                      }}
                    >
                      Cancel
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={user.username || "Loading..."}
                    readOnly
                  />
                  <a
                    href="#"
                    className="action-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setNewUsername(user.username || "");
                      setIsEditingUsername(true);
                    }}
                  >
                    Change username
                  </a>
                </>
              )}

              <p>Email</p>
              <input type="email" value={user.email || "Loading..."} readOnly />

              <span className="grid-placeholder"></span>
              <p>Contact No:</p>
              <div className="date-input-container">
                <input
                  type="tel"
                  value={user.contactNo || "No data yet"}
                  readOnly
                />
                <span
                  className="info-icon"
                  title="Add or update contact information"
                >
                  <a
                    href="#"
                    className="action-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowContactModal(true);
                      setContactNo(user.contactNo || "");
                    }}
                  >
                    {user.contactNo
                      ? "Update contact info"
                      : "Add contact info"}
                  </a>
                </span>
                {showContactModal && (
                  <div className="modal-overlay">
                    <div className="modal">
                      <h3>
                        {user.contactNo
                          ? "Update Contact Info"
                          : "Add Contact Info"}
                      </h3>
                      <input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                      />
                      <div className="modal-buttons">
                        <button
                          className="submit-button"
                          onClick={handleSaveContact}
                        >
                          Save
                        </button>
                        <button
                          className="submit-button cancel"
                          onClick={() => setShowContactModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <span className="grid-placeholder"></span>

              <button
                type="button"
                className="submit-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === "Preferences" && (
          <div className="preference-tab">
            <p className="account-settings-p">Manage your preferences</p>
            <div className="preference-settings">
              <p>Language</p>
              <GoogleTranslateWidget />

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
                  checked={false}
                  disabled
                  className="toggle-checkbox"
                />
                <label
                  htmlFor="emailNotifications"
                  className="toggle-label disabled"
                ></label>
                <span className="toggle-text">Off</span>
              </div>

              <button type="submit" className="submit-button">
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === "Delete" && (
          <div className="delete-tab">
            <p className="account-settings-p">
              Delete your account permanently
            </p>
            <div className="delete-settings">
              <p>We're sorry to see you go. This action is irreversible.</p>
              <p>Please confirm your password to proceed:</p>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="delete-buttons">
                <button
                  className="submit-button danger"
                  onClick={handleDeleteAccount}
                >
                  Delete My Account
                </button>
                <button
                  className="submit-button cancel"
                  onClick={() => setPassword("")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

import "../styling/auth.css";
import { useState } from "react";

interface SignupData {
  username?: string;
  email?: string;
  password?: string;
}
interface LoginData {
  email?: string;
  password?: string;
}

const Auth = () => {
  const [signUpData, setSignUpData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  // State to manage the loading status and modal messages
  const [status, setStatus] = useState<{ loading: boolean; message: string | null; success: boolean }>({
    loading: false,
    message: null,
    success: false,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, message: "Creating account...", success: false });
    try {
      const res = await fetch(`${backendUrl}/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signUpData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ loading: false, message: "Signup successful!", success: true });
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setStatus({
          loading: false,
          message: "Signup failed: " + (data.error || "Unknown error"),
          success: false,
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setStatus({ loading: false, message: "Server error during signup", success: false });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Show the "Logging in..." modal
    setStatus({ loading: true, message: "Logging in...", success: false });
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        // Show the "Login successful!" modal
        setStatus({ loading: false, message: "Login successful!", success: true });
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setStatus({
          loading: false,
          message: "Login failed: " + (data.error || data.message || "Unknown error"),
          success: false,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setStatus({ loading: false, message: "Server error during login", success: false });
    }
  };

  return (
    <div className="auth-body">
      {/* Status Modal Overlay for Loading and Success Messages */}
      {(status.loading || status.message) && (
        <div className="status-modal-overlay">
          <div className={`status-modal-box ${status.success ? "success" : ""}`}>
            {status.loading && <div className="spinner"></div>}
            <p>{status.message}</p>
            {!status.loading && !status.success && (
              <button
                className="btn mt-2"
                style={{ marginLeft: "0" }}
                onClick={() => setStatus({ ...status, message: null })}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bubble-background">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>

      <div className="auth-section">
        <div className="auth-container">
          <div className="auth-row full-height">
            <div className="auth-col text-center">
              <div className="auth-section-inner">
                <h6 className="auth-tabs">
                  <span className="auth-tabs-span">Log In </span>
                  <span className="auth-tabs-span">Sign Up</span>
                </h6>
                <input
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  className="auth-checkbox"
                />
                <label htmlFor="reg-log" className="auth-label"></label>

                <div className="auth-card-3d-wrap">
                  <div className="auth-card-3d-wrapper">
                    {/* LOGIN FORM */}
                    <div className="auth-card-front">
                      <div className="auth-center-wrap">
                        <div className="auth-form-section">
                          <h4 className="auth-form-section-heading">Log In</h4>
                          <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                              <input
                                type="email"
                                name="email"
                                className="form-style"
                                placeholder="Your Email"
                                autoComplete="off"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                              />
                              <i className="input-icon uil uil-at"></i>
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="password"
                                name="password"
                                className="form-style"
                                placeholder="Your Password"
                                autoComplete="new-password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                              />
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            <button type="submit" className="btn mt-4" disabled={status.loading}>
                              {status.loading ? "Processing..." : "Submit"}
                            </button>
                            <p className="auth-footer-text">
                              <a href="#0" className="auth-link">
                                Forgot your password?
                              </a>
                            </p>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* SIGNUP FORM */}
                    <div className="auth-card-back">
                      <div className="auth-center-wrap">
                        <div className="auth-form-section">
                          <h4 className="auth-form-section-heading">Sign Up</h4>
                          <form onSubmit={handleSignupSubmit}>
                            <div className="form-group">
                              <input
                                type="text"
                                name="username"
                                className="form-style"
                                placeholder="Your Full Name"
                                autoComplete="off"
                                value={signUpData.username}
                                onChange={handleSignupChange}
                                required
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="email"
                                name="email"
                                className="form-style"
                                placeholder="Your Email"
                                autoComplete="off"
                                value={signUpData.email}
                                onChange={handleSignupChange}
                                required
                              />
                              <i className="input-icon uil uil-at"></i>
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="password"
                                name="password"
                                className="form-style"
                                placeholder="Your Password"
                                autoComplete="new-password"
                                value={signUpData.password}
                                onChange={handleSignupChange}
                                required
                              />
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            <button type="submit" className="btn mt-4" disabled={status.loading}>
                              {status.loading ? "Processing..." : "Submit"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
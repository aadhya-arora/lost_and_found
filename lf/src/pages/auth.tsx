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

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signUpData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        window.location.href = "/";
      } else {
        alert("Signup failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error during signup");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert("Login failed: " + (data.error || data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error during login");
    }
  };

  return (
    <div className="auth-body">
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
                              />
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            <button type="submit" className="btn mt-4">
                              Submit
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
                              />
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            <button type="submit" className="btn mt-4">
                              Submit
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

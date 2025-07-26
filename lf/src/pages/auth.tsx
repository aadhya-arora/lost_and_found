import "../styling/auth.css";
import { useState } from "react";
interface Signupdata {
  username?: string;
  email?: string;
  password?: string;
}
interface Logindata {
  email?: string;
  password?: string;
}
const Auth = () => {
  const [signUpData, setSignUpData] = useState<Signupdata>({
    username: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState<Logindata>({
    email: "",
    password: "",
  });
  const backendUrl = "http://localhost:5000";

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`SignUp successful`);
        window.location.href = "/auth";
      } else {
        alert("Signup failed:" + data.error);
      }
    } catch (err) {
      console.error("Signup failed");
      alert("Server error");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const text = await res.text();
      if (res.ok && text !== "You can't login") {
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert("Login failed:" + text);
      }
    } catch (err) {
      console.error("Login error", err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-body">
      <div className="bubble-background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
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
                  className="auth-checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                />
                <label htmlFor="reg-log" className="auth-label"></label>
                <div className="auth-card-3d-wrap">
                  <div className="auth-card-3d-wrapper">
                    <div className="auth-card-front">
                      <div className="auth-center-wrap">
                        <div className="auth-form-section">
                          <h4 className="auth-form-section-heading">Log In</h4>
                          <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                              <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                className="form-style"
                                placeholder="Your Email"
                                autoComplete="off"
                                onChange={handleLoginChange}
                              />
                              <i className="input-icon uil uil-at"></i>
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                className="form-style"
                                placeholder="Your Password"
                                autoComplete="new-password"
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

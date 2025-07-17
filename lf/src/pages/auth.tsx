import "../styling/auth.css";

const Auth = () => {
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
                          <div className="form-group">
                            <input
                              type="email"
                              name="logemail"
                              className="form-style"
                              placeholder="Your Email"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="logpass"
                              className="form-style"
                              placeholder="Your Password"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <a href="#" className="btn">
                            submit
                          </a>
                          <p className="auth-footer-text">
                            <a href="#0" className="auth-link">
                              Forgot your password?
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="auth-card-back">
                      <div className="auth-center-wrap">
                        <div className="auth-form-section">
                          <h4 className="auth-form-section-heading">Sign Up</h4>
                          <div className="form-group">
                            <input
                              type="text"
                              name="signName"
                              className="form-style"
                              placeholder="Your Full Name"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-user"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="email"
                              name="signEmail"
                              className="form-style"
                              placeholder="Your Email"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="signPass"
                              className="form-style"
                              placeholder="Your Password"
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <a href="#" className="btn mt-4">
                            submit
                          </a>
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

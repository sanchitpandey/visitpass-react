//src/components/Auth/AuthContainer.js
import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import StaffLogin from "./StaffLogin";
import "./auth.css";

const AuthContainer = () => {
  const [authState, setAuthState] = useState("signup"); // Can be 'signup', 'login', or 'staff'

  useEffect(() => {
    const setMobileHeight = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    };
    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);
    return () => window.removeEventListener('resize', setMobileHeight);
  }, []);

  // Determine if the right panel should be active for the slide animation
  const isRightPanelActive = authState === 'signup';

  return (
    <div className="home-container">
      <div className={`auth-container container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">

        {/* This container holds both Login and StaffLogin, but only one is shown at a time */}
        <div className="form-container sign-in-container">
          {authState === 'login' && (
            <>
              <h2 className="form-title">Visitor Login</h2>
              <Login />
            </>
          )}
          {authState === 'staff' && (
            <>
              <h2 className="form-title">Staff Login</h2>
              <StaffLogin />
            </>
          )}
        </div>

        {/* This is the Sign Up container */}
        <div className="form-container sign-up-container">
          {authState === 'signup' && (
            <>
              <h2 className="form-title">Visitor Sign Up</h2>
              <Signup />
            </>
          )}
        </div>

        {/* This is the animated overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To visit the hospital, log in with your phone number.</p>
              <button className="ghost" id="signIn" onClick={() => setAuthState('login')}>
                Visitor Login
              </button>
              <p style={{marginTop: '15px'}}>Are you staff?</p>
              <button className="ghost" id="staffSignIn" onClick={() => setAuthState('staff')}>
                Staff Login
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Visitor!</h1>
              <p>Enter your details to begin your journey with us.</p>
              <button className="ghost" id="signUp" onClick={() => setAuthState('signup')}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* This section is for the mobile view buttons */}
      <div className="mobile-switch">
        {authState === 'signup' && (
          <button onClick={() => setAuthState('login')}>Already have an account? Sign In</button>
        )}
        {authState === 'login' && (
          <button onClick={() => setAuthState('signup')}>Don't have an account? Sign Up</button>
        )}
        <hr style={{ margin: '10px 0', border: 'none', borderBottom: '1px solid #ddd' }} />
        {authState !== 'staff' && (
          <button onClick={() => setAuthState('staff')}>Are you Staff? Login here</button>
        )}
        {authState === 'staff' && (
          <button onClick={() => setAuthState('signup')}>Visitor Registration / Login</button>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
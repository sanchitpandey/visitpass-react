//src/components/Auth/AuthContainer.js
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./auth.css";

const AuthContainer = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  
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

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="home-container">
      <div className={`auth-container container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-in-container">
          { !isSignUp && (
            <>
              <h2 className="form-title">Login</h2>
              <Login toggleForm={toggleForm} />
            </>
          )}
        </div>

        <div className="form-container sign-up-container">
          { isSignUp && (
            <>
              <h2 className="form-title">Sign Up</h2>
              <Signup toggleForm={toggleForm} />
            </>
          )}
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To visit the hospital log in with your info!</p>
              <button className="ghost" id="signIn" onClick={toggleForm}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={toggleForm}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile view toggle button */}
      <div className="mobile-switch">
        {isSignUp ? (
          <button onClick={toggleForm}>Already have an account? Sign In</button>
        ) : (
          <button onClick={toggleForm}>Don't have an account? Sign Up</button>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;

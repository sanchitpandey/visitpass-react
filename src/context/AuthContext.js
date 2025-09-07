// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; 
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true
  const [confirmationResult, setConfirmationResult] = useState(null);

  const cleanupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  const setupRecaptcha = (phoneNumber) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("Recaptcha verified"),
        }
      );
    }
    return signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  };

  const sendOtp = async (phoneNumber) => {
    try {
      const result = await setupRecaptcha(phoneNumber);
      setConfirmationResult(result);
      return true;
    } catch (err) {
      console.error("Error sending OTP:", err);
      throw err;
    }
  };

  const verifyOtp = async (otp) => {
    if (!confirmationResult) throw new Error("No OTP request in progress");
    const result = await confirmationResult.confirm(otp);
    const firebaseUser = result.user;
    const idToken = await firebaseUser.getIdToken();

    try {
      const res = await api.post("/auth/firebase-login", { token: idToken });
      login(res.data.token, res.data.user);
      return res.data.user;
    } catch (error) {
      if (error.response?.status === 404) {
        return firebaseUser;
      }
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem("authToken");
    setUser(null);
  };

  // This function is now the single source of truth for setting a user session
  const login = (token, userData) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  useEffect(() => {
    const validateTokenAndSetUser = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data.data); // The /me route returns user data under a 'data' key
        } catch (err) {
          console.error("Session token is invalid or expired", err);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    validateTokenAndSetUser();
  }, []);


  return (
    <AuthContext.Provider
      value={{ user, loading, sendOtp, verifyOtp, logout, login, cleanupRecaptcha }}
    >
      {children}
    </AuthContext.Provider>
  );
};
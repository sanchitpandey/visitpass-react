// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; 
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const cleanupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  // ✅ Initialize recaptcha for Firebase Phone Auth
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

  // ✅ Send OTP via Firebase
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

  // ✅ Verify OTP via Firebase and sync with backend (Updated)
  const verifyOtp = async (otp) => {
    if (!confirmationResult) throw new Error("No OTP request in progress");

    const result = await confirmationResult.confirm(otp);
    const firebaseUser = result.user;
    const idToken = await firebaseUser.getIdToken();

    try {
      const res = await api.post("/auth/firebase-login", { token: idToken });
      login(res.data.token, res.data.user);
      return firebaseUser;
    } catch (error) {
      if (error.response?.status === 404) {
        return firebaseUser; // Treat 404 as success for this step
      }

      // For any other error (like a 500), it's a real problem.
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  // ✅ Logout
  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem("authToken"); 
    setUser(null);
  };

  // ✅ Manually logs in a user with a token and data from our backend
  const login = (token, userData) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        try {
          const res = await api.post("/auth/firebase-login", { token: idToken });
          setUser(res.data.user);
        } catch (err) {
          console.error("Error syncing Firebase user with backend:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, sendOtp, verifyOtp, logout, login, cleanupRecaptcha }}
    >
      {children}
    </AuthContext.Provider>
  );
};

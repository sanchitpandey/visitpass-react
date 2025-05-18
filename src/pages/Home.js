// src/pages/Home.js
import React from "react";
import AuthContainer from "../components/Auth/AuthContainer";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { currentUser } = useAuth();

  // Redirect authenticated users based on their role
  if (currentUser) {
    if (currentUser.role === "visitor") {
      return <Navigate to="/visitor" replace />;
    } else if (currentUser.role === "security") {
      return <Navigate to="/security" replace />;
    } else if (currentUser.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <AuthContainer />;
};

export default Home;


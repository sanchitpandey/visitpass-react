import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const visitorData = localStorage.getItem("visitor");

    if (token && user) {
      setCurrentUser(JSON.parse(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (visitorData) {
        console.log(visitorData);
        setVisitor(JSON.parse(visitorData));
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { token, user, visitor } = response.data;
  
      // Store token and user immediately
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Set authorization header BEFORE making authenticated requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCurrentUser(user);
  
      // Now fetch visitor details if needed
      if (user.role === "visitor") {
        try {
          const visitorResponse = await api.get("/visitors/my-info");
          localStorage.setItem(
            "visitor",
            JSON.stringify(visitorResponse.data.data)
          );
          setVisitor(visitorResponse.data.data);
        } catch (visitorError) {
          console.error("Error fetching visitor data:", visitorError);
          // Still allow login even if visitor data fetch fails
          if (visitor) {
            localStorage.setItem("visitor", JSON.stringify(visitor));
            setVisitor(visitor);
          }
        }
      } else if (visitor) {
        localStorage.setItem("visitor", JSON.stringify(visitor));
        setVisitor(visitor);
      }
  
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "security") navigate("/security");
      else navigate("/visitor");
  
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // In the signup function, update the visitor data handling:
  const signup = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post("/visitors/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { token, user, visitor } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("visitor", JSON.stringify(visitor));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCurrentUser(user);
      setVisitor(visitor);

      navigate("/visitor");

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("visitor");
    delete api.defaults.headers.common["Authorization"];
    setCurrentUser(null);
    setVisitor(null);
    navigate("/");
  };

  const value = { currentUser, visitor, login, signup, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// src/pages/Home.js
import AuthContainer from "../components/Auth/AuthContainer";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "visitor") {
      return <Navigate to="/visitor" replace />;
    } else if (user.role === "security") {
      return <Navigate to="/security" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <AuthContainer />;
};

export default Home;


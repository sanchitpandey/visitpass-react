// src/pages/SecurityDashboard.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/common/Header";
import SecurityHome from "../components/Security/SecurityHome";
import hospitalLogo from "../assets/IIA_transparent.png";

const SecurityDashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <Header
        userName={currentUser.name}
        role={currentUser.role}
        onLogout={logout}
      />

      <main className="dashboard-content">
        <SecurityHome />
      </main>
    </div>
  );
};

export default SecurityDashboard;

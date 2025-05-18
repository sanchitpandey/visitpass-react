// src/pages/VisitorDashboard.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/common/Header";
import VisitorHome from "../components/Visitor/VisitorHome";
import hospitalLogo from "../assets/IIA_transparent.png";

const VisitorDashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <Header
        userName={currentUser?.name}
        role={currentUser?.role}
        onLogout={logout}
        logoSrc={hospitalLogo}
      />

      <main className="dashboard-content">
        <VisitorHome />
      </main>
    </div>
  );
};

export default VisitorDashboard;

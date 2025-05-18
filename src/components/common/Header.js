// src/components/common/Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../utils/roles";

const Header = ({ userName, role, onLogout }) => {
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    switch (role) {
      case ROLES.ADMIN:
        navigate("/admin");
        break;
      case ROLES.SECURITY:
        navigate("/security");
        break;
      case ROLES.VISITOR:
        navigate("/visitor");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <header className="app-header">
      <div className="header-logo" onClick={navigateToDashboard}>
        <h1>Hospital Visitor Management</h1>
      </div>

      <div className="user-info">
        <span className="user-name">{userName}</span>
        <span className="user-role">({role})</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

// src/pages/AdminDashboard.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/common/Header";
import AdminHome from "../components/Admin/AdminHome";
import StaffForm from "../components/Admin/StaffForm";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [showStaffForm, setShowStaffForm] = useState(false);

  const toggleStaffForm = () => {
    setShowStaffForm(!showStaffForm);
  };

  return (
    <div className="dashboard-container">
      <Header
        userName={user.name}
        role={user.role}
        onLogout={logout}
      />

      <main className="dashboard-content">
        {showStaffForm ? (
          <StaffForm onCancel={toggleStaffForm} />
        ) : (
          <AdminHome onRegisterStaff={toggleStaffForm} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

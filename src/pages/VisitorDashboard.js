// src/pages/VisitorDashboard.js
import { useAuth } from "../context/AuthContext";
import Header from "../components/common/Header";
import VisitorHome from "../components/Visitor/VisitorHome";

const VisitorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <Header
        userName={user?.name}
        role={user?.role}
        onLogout={logout}
      />

      <main className="dashboard-content">
        <VisitorHome />
      </main>
    </div>
  );
};

export default VisitorDashboard;

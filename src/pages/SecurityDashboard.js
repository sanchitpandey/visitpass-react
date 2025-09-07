// src/pages/SecurityDashboard.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/common/Header";
import SecurityHome from "../components/Security/SecurityHome";

const SecurityDashboard = () => {
  const { user, logout } = useAuth();
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="dashboard-container">
      <Header
        userName={user?.name}
        role={user?.role}
        onLogout={logout}
      />

      <main className="dashboard-content" style={{ textAlign: 'center', padding: '20px' }}>
        {isScanning ? (
          <SecurityHome />
        ) : (
          <div>
            <h2>Welcome, {user?.name}</h2>
            <p>Ready to scan visitor QR codes for entry and exit.</p>
            <button
              onClick={() => setIsScanning(true)}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                marginTop: '20px'
              }}
            >
              Start Scanning
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SecurityDashboard;
// src/App.js
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import VisitorDashboard from "./pages/VisitorDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // This hook will run when the user logs in/out, or on initial load.
    if (!loading && user) {
      // If we are done loading and we have a user...
      // and we are currently on the home/auth page...
      if (location.pathname === "/") {
        // ...then redirect to their correct dashboard.
        console.log(user);
        navigate(`/${user.role}`);
      }
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) { 
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App component with routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/visitor"
        element={
          <ProtectedRoute allowedRoles={["visitor"]}>
            <VisitorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/security"
        element={
          <ProtectedRoute allowedRoles={["security"]}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;

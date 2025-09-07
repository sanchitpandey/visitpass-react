// src/components/Auth/StaffLogin.js
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const StaffLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      // The backend returns { token, user }
      login(res.data.token, res.data.user);
      // Navigate to the correct dashboard after login
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 mb-4 border rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 mb-4 border rounded-lg"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default StaffLogin;
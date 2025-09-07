// src/components/Auth/Login.js
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const { sendOtp, verifyOtp, cleanupRecaptcha } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp("+91" + phone); // adjust country code as needed
      setStep(2);
    } catch (err) {
      alert("Failed to send OTP: " + err.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await verifyOtp(otp);
      console.log(loggedInUser);
      if (loggedInUser) {
        navigate(`/${loggedInUser.role}`, { replace: true }); 
      }
    } catch (err) {
      alert("Invalid OTP or login failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <>
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="auth-form"> 
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="auth-form"> 
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <div id="recaptcha-container"></div>
      </>
  );
};

export default Login;

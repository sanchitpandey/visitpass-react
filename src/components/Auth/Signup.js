// src/components/Auth/Signup.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { sendOtp, verifyOtp, login, cleanupRecaptcha } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [officialToMeet, setOfficialToMeet] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [diseases, setDiseases] = useState("");
  const [refBy, setRefBy] = useState("");
  const [selfie, setSelfie] = useState(null);

  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  // ✅ Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp("+91" + phone);
      setStep(2);
    } catch (err) {
      alert("Failed to send OTP: " + err.message);
    }
    setLoading(false);
  };

  // ✅ Step 2: Verify OTP (Corrected Version)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userObject = await verifyOtp(otp);

      if (userObject.role) {
        return;
      }

      const token = await userObject.getIdToken();
      setIdToken(token);
      setStep(3);

    } catch (err) {
      alert("Invalid OTP: " + err.message);
    }
    setLoading(false);
  };

  // Step 3: Register details in backend
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selfie) {
      alert("Please select a selfie image.");
      return;
    }
    setLoading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("age", age);
    formData.append("sex", sex);
    formData.append("address", address);
    formData.append("officialToMeet", officialToMeet);
    formData.append("aadhaarNumber", aadhaar);
    formData.append("diseases", diseases);
    formData.append("referredBy", refBy);
    formData.append("selfie", selfie);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      };

      const { data } = await api.post("/visitors/register", formData, config);

      alert("Registration successful!");

      login(data.token, data.user);
      navigate(`/${data.user.role}`, { replace: true });

    } catch (err) {
      const message = err.response?.data?.message || "An unknown error occurred.";
      alert(`Registration Failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        {/* Step 1: Phone input */}
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

        {/* Step 2: OTP input */}
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

        {step === 3 && (
          <form onSubmit={handleRegister} className="auth-form"> 
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
              required
            />
            <div className="flex gap-4 mb-4">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-1/2 px-3 py-2 border rounded-lg"
                required
              />
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-1/2 px-3 py-2 border rounded-lg"
                required
              >
                <option value="" disabled>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Aadhaar Number"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
              required
            />
            <textarea
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Official to Meet"
              value={officialToMeet}
              onChange={(e) => setOfficialToMeet(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Referred By (Optional)"
              value={refBy}
              onChange={(e) => setRefBy(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Pre-existing Diseases (Optional)"
              value={diseases}
              onChange={(e) => setDiseases(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Upload Selfie</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelfie(e.target.files[0])}
                className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <div id="recaptcha-container"></div>
      </>
  );
};

export default Signup;

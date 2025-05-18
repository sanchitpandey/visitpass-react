import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const Signup = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    aadhaarNumber: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    purpose: "",
  });

  const [selfie, setSelfie] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfie(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!Object.values(formData).every(Boolean) || !selfie) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      setError("Aadhaar must be 12 digits");
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Phone number must be 10 digits");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("aadhaarNumber", formData.aadhaarNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("purpose", formData.purpose);
      formDataToSend.append("selfie", selfie);

      const result = await signup(formDataToSend);

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="auth-form">
      <h2>Visitor Registration</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength="10"
            required
          />
        </div>

        <div className="form-group">
          <label>Aadhaar Number</label>
          <input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            maxLength="12"
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Visit Purpose</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Selfie</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div className="selfie-upload">
            {previewUrl ? (
              <img src={previewUrl} alt="Selfie preview" className="preview" />
            ) : (
              <div className="placeholder">No image selected</div>
            )}
            <button
              type="button"
              onClick={triggerFileInput}
              className="upload-btn"
            >
              {previewUrl ? "Change Photo" : "Upload Selfie"}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Create Account"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button type="button" className="text-button" onClick={toggleForm}>
          Login instead
        </button>
      </p>
    </div>
  );
};

export default Signup;

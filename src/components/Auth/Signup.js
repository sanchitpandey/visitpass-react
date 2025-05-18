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
      // Check if file size is too large (over 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Please select an image under 5MB.");
        return;
      }
      
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

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
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
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        maxLength="10"
        required
      />
      
      <input
        type="text"
        name="aadhaarNumber"
        placeholder="Aadhaar Number"
        value={formData.aadhaarNumber}
        onChange={handleChange}
        maxLength="12"
        required
      />
      
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        minLength="6"
        required
      />
      
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      
      <input
        type="text"
        name="purpose"
        placeholder="Visit Purpose"
        value={formData.purpose}
        onChange={handleChange}
        required
      />
      
      <div className="selfie-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        
        <div className="selfie-upload">
          {previewUrl && (
            <div className="preview-container">
              <img 
                src={previewUrl} 
                alt="Selfie preview" 
                className="selfie-preview"
              />
            </div>
          )}
          
          <button
            type="button"
            onClick={triggerFileInput}
            className="upload-button"
            style={{ 
              backgroundColor: previewUrl ? "#2ecc71" : "#ff4b2b"
            }}
          >
            {previewUrl ? "Change Photo" : "Upload Selfie"}
          </button>
        </div>
      </div>
      
      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
};

export default Signup;

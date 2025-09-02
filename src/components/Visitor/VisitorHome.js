// src/components/Visitor/VisitorHome.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { QRCodeSVG } from "qrcode.react";
import "./VisitorHome.css";

const VisitorHome = () => {
  const { user } = useAuth();
  const [visitor, setVisitor] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiBaseUrl = process.env.REACT_APP_API_URL 
    ? process.env.REACT_APP_API_URL.replace('/api', '') 
    : "http://localhost:5000";

  useEffect(() => {
    const fetchVisitorData = async () => {
      console.log("CHECKPOINT 2: fetchVisitorData() function has been called.");
      try {
        const response = await api.get("/visitors/my-info");
        console.log("CHECKPOINT 3: API call successful. Data:", response.data);
        
        // --- Small Bug Fix Here ---
        // Your backend may send slightly different data structures
        const visitorData = response.data.data || response.data;
        setVisitor(visitorData);
        setVisitHistory(visitorData.visitHistory || []);
        // --- End of Bug Fix ---

      } catch (err) {
        setError("Failed to load visitor data");
        console.error("CHECKPOINT 4: API call failed. Error:", err);
      } finally {
        console.log("CHECKPOINT 5: finally block reached. Setting loading to false.");
        setLoading(false);
      }
    };

    console.log("CHECKPOINT 1: useEffect is running. Current user is:", user);

    if (user?.role === "visitor") {
      fetchVisitorData();
    } else {
      // This is an important addition. If the user isn't a visitor,
      // we were never setting loading to false, causing the infinite load.
      console.log("User is not a visitor or does not exist. Aborting fetch.");
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="loading">Loading...</div>;

  const getImageFilename = (path) => {
    if (!path) return '';
    const parts = path.split(/[\/\\]/);
    return parts[parts.length - 1];
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    
    const filename = getImageFilename(path);
    
    return `${apiBaseUrl}/uploads/${filename}`;
  };  

  return (
    <div className="visitor-home">
      <h2>Welcome, {user?.name}</h2>

      {/* Desktop View - Row Layout */}
      <div className="visitor-card desktop-view">
        <div className="visitor-info">
          <div className="visitor-photo">
            {visitor?.selfieUrl ? (
              <>
                <img 
                  src={getImageUrl(visitor.selfieUrl)}
                  alt="Visitor" 
                  style={{ 
                    width: "150px", 
                    height: "150px", 
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #ccc"
                  }} 
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400?text=No+Image';
                  }}
                />
              </>
            ) : (
              <div className="no-photo" style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ccc"
              }}>
                No photo available
              </div>
            )}
          </div>

          <div className="visitor-details">
            <h3>{visitor?.name}</h3>
            <p>
              <strong>Aadhaar:</strong> {visitor?.aadhaarNumber}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-${visitor?.status?.replace(/\s+/g, "-")}`}
              >
                {visitor?.status}
              </span>
            </p>
          </div>
        </div>

        <div className="qr-code-container">
          <h4>Visitor QR Code</h4>
          {visitor?.qrCode && (
            <QRCodeSVG 
              value={visitor.qrCode} 
              size={200}
              level="H"
              className="qr-code"
            />
          )}
          <p className="qr-instructions">
            Present this QR code at entry/exit points
          </p>
        </div>
      </div>

      {/* Mobile View - Column Layout */}
      <div className="visitor-card-mobile mobile-view">
        <div className="visitor-info-mobile">
          <div className="visitor-photo">
            {visitor?.selfieUrl ? (
              <>
                <img 
                  src={getImageUrl(visitor.selfieUrl)}
                  alt="Visitor" 
                  style={{ 
                    width: "150px", 
                    height: "150px", 
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #ccc"
                  }} 
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400?text=No+Image';
                  }}
                />
              </>
            ) : (
              <div className="no-photo" style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ccc"
              }}>
                No photo available
              </div>
            )}
          </div>

          <div className="visitor-details">
            <h3>{visitor?.name}</h3>
            <p>
              <strong>Aadhaar:</strong> {visitor?.aadhaarNumber}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-${visitor?.status?.replace(/\s+/g, "-")}`}
              >
                {visitor?.status}
              </span>
            </p>
          </div>
        </div>

        <div className="qr-code-container-mobile">
          <h4>Visitor QR Code</h4>
          {visitor?.qrCode && (
            <QRCodeSVG 
              value={visitor.qrCode} 
              size={200}
              level="H"
              className="qr-code"
            />
          )}
          <p className="qr-instructions">
            Present this QR code at entry/exit points
          </p>
        </div>
      </div>

      <div className="visit-history">
        <h3>Visit History</h3>
        {visitHistory.length === 0 ? (
          <p>No visit history found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {visitHistory.map((visit, index) => (
                <tr key={index}>
                  <td>{new Date(visit.entryTime).toLocaleString()}</td>
                  <td>
                    {visit.exitTime
                      ? new Date(visit.exitTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{visit.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VisitorHome;

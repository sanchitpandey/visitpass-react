// src/components/Security/SecurityHome.js
import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import api from "../../services/api";

const SecurityHome = () => {
  const [visitorData, setVisitorData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pause, setPause] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [key, setKey] = useState(0);
  const [isScannerSupported, setIsScannerSupported] = useState(true);

  useEffect(() => {
    if (!('BarcodeDetector' in window)) {
      console.error('BarcodeDetector API is not supported in this browser.');
      setIsScannerSupported(false);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        setVisitorData(null);
        setError("");
        setPause(false);
        setKey(prevKey => prevKey + 1);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccess]);

  const handleScan = async (result) => {
    if (result && !loading && !pause) {
      setLoading(true);
      setError("");
      setPause(true);
      
      try {
        let qrCodeData;
        if (Array.isArray(result) && result.length > 0) {
          qrCodeData = result[0]?.rawValue || "";
        } else if (typeof result === 'string') {
          qrCodeData = result;
        } else {
          throw new Error("Unrecognized QR code format");
        }
        
        try {
          const response = await api.post("/access/entry", { qrCodeData });
          setVisitorData(response.data.data);
          setShowSuccess(true);
        } catch (entryError) {
          if (entryError.response?.status === 400 && entryError.response?.data?.message === "Visitor is already inside the premises") {
            const exitResponse = await api.post("/access/exit", { qrCodeData });
            setVisitorData(exitResponse.data.data);
            setShowSuccess(true);
          } else {
            throw entryError;
          }
        }
      } catch (err) {
        console.error("API error:", err);
        setError(err.response?.data?.message || "Server error occurred");
        setTimeout(() => {
          setError("");
          setPause(false);
          setLoading(false);
          setKey(prevKey => prevKey + 1);
        }, 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isScannerSupported) {
    return (
      <div className="error-message" style={{padding: '20px', backgroundColor: '#FFFBEB', color: '#92400E', borderRadius: '8px'}}>
        <h2>QR Scanner Not Supported</h2>
        <p>This browser or device does not support the QR scanning service required for this feature.</p>
      </div>
    );
  }

  return (
    <div className="security-home">
      {error && <div className="error-message">{error}</div>}
      <div className="scanner-container" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
        <Scanner 
          key={key} 
          onScan={handleScan}
          onError={(err) => {
            console.error("Scanner error:", err);
            setError(err?.message || "Scanner error");
            setTimeout(() => setError(""), 2000);
          }}
          pause={pause}
        />
        {loading && <div className="scan-loading">Processing scan...</div>}
      </div>

      {showSuccess && (
        <div className="scan-success-popup" style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#4CAF50",
          color: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000, textAlign: "center"
        }}>
          <h3>Scan Successful!</h3>
          {visitorData && (
            <>
              <p>Visitor: {visitorData.visitor.name}</p>
              <p>Status: {visitorData.visitor.status}</p>
              <p>{visitorData.visitor.status === "inside premises" ? "Entry" : "Exit"} recorded</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityHome;
// src/components/Admin/AdminHome.js
import React, { useState } from "react";
import api from "../../services/api";
import './Admin.css';

const AdminHome = ({ onRegisterStaff }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const generateReport = async () => {
    try {
      const response = await api.get(`/reports/daily?date=${date}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `visitor_report_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to generate report");
    }
  };

  return (
    <div className="admin-home">
      <h2>Admin Dashboard</h2>

      <div className="admin-actions">
        <div className="action-card">
          <h3>Generate Visitor Report</h3>
          <div className="report-form">
            <div className="form-group">
              <label htmlFor="reportDate">Select Date</label>
              <input
                type="date"
                id="reportDate"
                value={date}
                onChange={handleDateChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <button
              className="generate-btn"
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>

            {error && <div className="error-message">{error}</div>}

            {downloadUrl && (
              <div className="download-link">
                <a
                  href={downloadUrl}
                  download={`visitor_report_${date}.xlsx`}
                  className="download-btn"
                >
                  Download Report
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="action-card">
          <h3>Staff Management</h3>
          <p>Register new security personnel or admin users for the system.</p>
          <button className="register-staff-btn" onClick={onRegisterStaff}>
            Register New Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

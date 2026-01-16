import React, { useState } from "react";
import "./css/AppVersion.css";

import { toast } from "react-toastify";
import { CreateAppVersionAPI } from "../api/api";

function AppVersion() {
  const [formData, setFormData] = useState({
    appFor: "Customer",
    versionName: "",
    apkUrl: "",
    updateMessage: "",
    intervalTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // call backend API
      const response = await CreateAppVersionAPI(
        formData.appFor,
        formData.versionName,
        formData.apkUrl,
        formData.updateMessage,
        formData.intervalTime
      );

      if (response?.data?.success) {
        toast.success("Version submitted successfully!");
        // Reset form
        setFormData({
          appFor: "Customer",
          versionName: "",
          apkUrl: "",
          updateMessage: "",
          intervalTime: "",
        });
      } else {
        toast.error(response?.data?.message || "Failed to create version");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error: Could not create version");
    }
  };

  return (
    <div className="app-version-container">
      {/* Header */}
      <div className="app-version-header">
        <h1>App Version</h1>
        <p>
          Current Version: <span className="highlight">1.0.0</span>
        </p>
      </div>

      {/* Form Section */}
      <div className="version-card">
        <h2>🚀 Launch New Version</h2>

        <form onSubmit={handleSubmit} className="version-form">
          {/* App Version For */}
          <div className="form-group">
            <label>App Version For</label>
            <select
              name="appFor"
              value={formData.appFor}
              onChange={handleChange}
            >
              <option value="Customer">Customer</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          {/* Version Name */}
          <div className="form-group">
            <label>Version Name</label>
            <input
              type="text"
              name="versionName"
              value={formData.versionName}
              onChange={handleChange}
              placeholder="e.g. 1.0.1"
              required
            />
          </div>

          {/* APK URL */}
          <div className="form-group">
            <label>App APK URL</label>
            <input
              type="text"
              name="apkUrl"
              value={formData.apkUrl}
              onChange={handleChange}
              placeholder="https://example.com/app.apk"
              required
            />
          </div>

          {/* Update Message */}
          <div className="form-group">
            <label>Update Message</label>
            <input
              type="text"
              name="updateMessage"
              value={formData.updateMessage}
              onChange={handleChange}
              placeholder="What’s new in this version?"
            />
          </div>

          {/* Interval Time */}
          <div className="form-group">
            <label>Interval Time To Show Message (in hours)</label>
            <input
              type="number"
              name="intervalTime"
              value={formData.intervalTime}
              onChange={handleChange}
              placeholder="e.g. 24"
              min="1"
            />
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="submit">Save Version</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppVersion;

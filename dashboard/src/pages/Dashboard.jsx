import { Tooltip } from "antd";
import React from "react";

const Dashboard = () => {
  return (
    <section className="dashboard">
      <h1>
        <i className="bx bxs-dashboard"></i>Dashboard
      </h1>

      <div className="wrap">
        <div className="card">
          <h2>MR Cuban User App</h2>
          <p>Android app for Customners</p>
          <h6>Project Info:</h6>
          <ul>
            <li>Project ID: com.mrcuban.in</li>
            <li>
              Stck: FCM + Push Notification + Cloudinary + MongoDB + Render
            </li>
            <li>App Version: 1.0.0</li>
            <li>Framework: React Native EXPO</li>
          </ul>
          <span
            onClick={() =>
              (window.location.href = import.meta.env.VITE_APP_URL1)
            }
            className="download"
          >
            <Tooltip placement="left" title="Download Android App">
              <i className="bx bxs-download"></i>
            </Tooltip>
          </span>{" "}
        </div>
        <div className="card">
          <h2>MR Cuban Partner Driver App</h2>
          <p>Android app for Drivers</p>
          <h6>Project Info:</h6>
          <ul>
            <li>Project ID: com.mrcuban.partners.in</li>
            <li>
              Stck: FCM + Push Notification + Cloudinary + MongoDB + Render
            </li>
            <li>App Version: 1.0.0</li>
            <li>Framework: React Native EXPO</li>
          </ul>
          <span
            className="download"
            onClick={() =>
              (window.location.href = import.meta.env.VITE_APP_URL2)
            }
          >
            <Tooltip placement="left" title="Download Android App">
              <i className="bx bxs-download"></i>
            </Tooltip>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

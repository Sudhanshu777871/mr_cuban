import React, { useEffect, useState } from "react";
import {
  SendBroadcastNotificationAPI,
  FetchNotificationHistoryAPI,
  FetchNotificationStatsAPI,
} from "../api/api";
import { Pagination, Tag, Select, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

const Notification = () => {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sentTo, setSentTo] = useState("customer");
  const [notificationType, setNotificationType] = useState("other");

  // Stats
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDrivers: 0,
    customerTokens: 0,
    driverTokens: 0,
    totalNotifications: 0,
  });

  // Load notification history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const result = await FetchNotificationHistoryAPI(current);
      if (result?.data?.data) {
        setHistory(result.data.data);
        setTotal(result.data.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const fetchStats = async () => {
    try {
      const result = await FetchNotificationStatsAPI();
      if (result?.data?.data) {
        setStats(result.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [current]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Send notification
  const sendNotification = async () => {
    if (!title.trim()) {
      toast.error("Please enter a notification title");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a notification message");
      return;
    }

    try {
      setSending(true);
      const result = await SendBroadcastNotificationAPI(
        title,
        message,
        sentTo,
        notificationType
      );

      if (result?.data) {
        toast.success(
          `Notification sent to ${result.data.recipientCount} recipients!`
        );
        setTitle("");
        setMessage("");
        setSentTo("customer");
        setNotificationType("other");

        // Refresh history and stats
        fetchHistory();
        fetchStats();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const getSentToColor = (sentTo) => {
    switch (sentTo) {
      case "customer":
        return "blue";
      case "driver":
        return "green";
      case "both":
        return "purple";
      default:
        return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "offer":
        return "orange";
      case "welcome":
        return "cyan";
      case "festival":
        return "magenta";
      case "announcement":
        return "gold";
      default:
        return "default";
    }
  };

  return (
    <section className="driver" style={{ padding: "20px" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <i className="bx bx-bell" style={{ fontSize: "24px" }}></i>
        Manage Notifications
      </h1>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#666" }}>
            Total Customers
          </h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {stats.totalCustomers}
          </p>
          <small style={{ color: "#1890ff" }}>
            {stats.customerTokens} with app
          </small>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#666" }}>Total Drivers</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {stats.totalDrivers}
          </p>
          <small style={{ color: "#52c41a" }}>
            {stats.driverTokens} with app
          </small>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#666" }}>
            Sent Notifications
          </h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {stats.totalNotifications}
          </p>
          <small style={{ color: "#999" }}>total sent</small>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Create Notification Form */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Send New Notification</h2>

          <div style={{ marginTop: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Notification Title
            </label>
            <Input
              placeholder="e.g., Welcome to Mr Cuban!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="large"
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Message
            </label>
            <TextArea
              placeholder="Enter your notification message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              size="large"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Send To
              </label>
              <Select
                value={sentTo}
                onChange={(value) => setSentTo(value)}
                style={{ width: "100%" }}
                size="large"
              >
                <Option value="customer">Customers</Option>
                <Option value="driver">Drivers</Option>
                <Option value="both">Both</Option>
              </Select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Notification Type
              </label>
              <Select
                value={notificationType}
                onChange={(value) => setNotificationType(value)}
                style={{ width: "100%" }}
                size="large"
              >
                <Option value="offer">Offer</Option>
                <Option value="welcome">Welcome</Option>
                <Option value="festival">Festival Wish</Option>
                <Option value="announcement">Announcement</Option>
                <Option value="other">Other</Option>
              </Select>
            </div>
          </div>

          <button
            onClick={sendNotification}
            disabled={sending}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: sending ? "#ccc" : "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: sending ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              width: "100%",
            }}
          >
            {sending ? (
              <>
                <LoadingOutlined /> Sending...
              </>
            ) : (
              "Send Notification"
            )}
          </button>

          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#f0f0f0",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            <strong>Recipients:</strong>{" "}
            {sentTo === "customer" && `${stats.customerTokens} customers`}
            {sentTo === "driver" && `${stats.driverTokens} drivers`}
            {sentTo === "both" &&
              `${stats.customerTokens + stats.driverTokens} users`}
          </div>
        </div>

        {/* Notification History */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxHeight: "700px",
            overflow: "auto",
          }}
        >
          <h2>Notification History</h2>

          <p style={{ color: "#666", marginTop: "10px" }}>
            Display {history?.length} out of {total} Records
          </p>

          <div style={{ marginTop: "15px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <LoadingOutlined style={{ fontSize: "24px" }} />
              </div>
            ) : history.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center" }}>
                No notifications sent yet
              </p>
            ) : (
              history.map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    background: "#f9f9f9",
                    padding: "15px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #1890ff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{notif.title}</h4>
                    <div>
                      <Tag color={getSentToColor(notif.sentTo)}>
                        {notif.sentTo?.toUpperCase()}
                      </Tag>
                      <Tag color={getTypeColor(notif.notificationType)}>
                        {notif.notificationType}
                      </Tag>
                    </div>
                  </div>
                  <p style={{ margin: "8px 0", color: "#333" }}>
                    {notif.message}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    <span>
                      Sent to: <strong>{notif.recipientCount}</strong> users
                    </span>
                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {total > 20 && !loading && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Pagination
                current={current}
                onChange={(page) => setCurrent(page)}
                total={total}
                pageSize={20}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Notification;

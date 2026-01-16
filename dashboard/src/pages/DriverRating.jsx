import React, { useEffect, useState } from "react";
import noRating from "../assets/no_rating.png";
import { showNotApprovedCommentByDriver, updateDriverRating } from "../api/api";

const DriverRating = () => {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState("0"); // keep as string (schema uses String)
  const [editId, setEditId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await showNotApprovedCommentByDriver();
        setRatings(res?.data || []);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  const spinnerStyle = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
    margin: "auto",
  };

  const showToast = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  // Accept rating (uses same updateDriverRating controller)
  const handleAccept = async (id) => {
    const ok = window.confirm("Are You Sure Want To Accept this rating?");
    if (!ok) return;
  
    try {
      setAcceptingId(id);
      await updateDriverRating(id, { isApproved: true });
  
      // 🔹 Remove the accepted card completely from UI
      setRatings((prev) => prev.filter((item) => item.rate._id !== id));
  
      showToast("✅ Driver Rating Accepted Successfully");
    } catch (err) {
      console.error("Error accepting rating:", err);
    } finally {
      setAcceptingId(null);
    }
  };
  

  // Open edit modal
  const handleEdit = (id, currentComment, currentRating) => {
    setEditId(id);
    setEditComment(currentComment ?? "");
    // ensure string value for select
    setEditRating(String(currentRating ?? "0"));
    setIsModalOpen(true);
  };

  // Update rating/comment
  const handleUpdate = async () => {
    const ok = window.confirm("Are You Sure Want To Update Rating/ Comment?");
    if (!ok) return;

    try {
      setUpdating(true);
      await updateDriverRating(editId, {
        comment: editComment,
        rating: String(editRating), // keep as string (schema)
      });

      // Update UI immediately
      setRatings((prev) =>
        prev.map((item) =>
          item.rate._id === editId
            ? {
                ...item,
                rate: {
                  ...item.rate,
                  comment: editComment,
                  rating: String(editRating),
                },
              }
            : item
        )
      );

      // Close modal AFTER state update and show toast
      setIsModalOpen(false);
      showToast("✅ Driver Rating Updated");
    } catch (err) {
      console.error("Error updating rating:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="driver">
      <h1>
        <i className="bx bx-star"></i> Driver Rating
      </h1>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .modal {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
          }
          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 400px;
            width: 100%;
          }
          .success-msg {
            background: #2ecc71;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
            font-weight: 600;
          }
        `}
      </style>

      {/* Toast */}
      {message && <div className="success-msg">{message}</div>}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <div style={spinnerStyle}></div>
        </div>
      ) : ratings.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "150px" }}>
          <img
            src={noRating}
            alt="No Rating"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <p>No Driver's Recent Rating Found For Approval</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
            color: "white",
          }}
        >
          {ratings.map((item) => (
            <div
              key={item.rate._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                background: "#222",
              }}
            >
              <h3>{item.user?.name || "Unknown User"}</h3>
              <p style={{ color: "#f39c12", fontWeight: "bold" }}>
                ⭐ {item.rate.rating}
              </p>
              <p>{item.rate.comment}</p>
              <small style={{ color: "#888" }}>
                {new Date(item.rate.createdAt).toLocaleDateString()}{" "}
                {new Date(item.rate.createdAt).toLocaleTimeString()}
              </small>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                
                {!item.rate.isApproved && (
                  <button
                    onClick={() => handleAccept(item.rate._id)}
                    disabled={acceptingId === item.rate._id}
                    style={{
                      padding: "8px 12px",
                      background: "#2ecc71",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      width: "40%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {acceptingId === item.rate._id ? (
                      <span style={spinnerStyle}></span>
                    ) : (
                      "Accept"
                    )}
                  </button>
                )}

                <button
                  onClick={() =>
                    handleEdit(item.rate._id, item.rate.comment, item.rate.rating)
                  }
                  style={{
                    padding: "8px 12px",
                    background: "#e67e22",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    width: "40%",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Rating</h3>

            <label style={{ fontWeight: "bold" }}>Rating:</label>
            <select
              value={editRating}
              onChange={(e) => setEditRating(e.target.value)} 
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px" }}
            >
              <option value="1">⭐ 1</option>
              <option value="2">⭐ 2</option>
              <option value="3">⭐ 3</option>
              <option value="4">⭐ 4</option>
              <option value="5">⭐ 5</option>
            </select>

            <label style={{ fontWeight: "bold" }}>Comment:</label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows="4"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            />

            <button
              onClick={handleUpdate}
              disabled={updating}
              style={{
                padding: "8px 12px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: "10px",
                minWidth: 100,
              }}
            >
              {updating ? "Updating..." : "Update"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={updating}
              style={{
                padding: "8px 12px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                minWidth: 100,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DriverRating;

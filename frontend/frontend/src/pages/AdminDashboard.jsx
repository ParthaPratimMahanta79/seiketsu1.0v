import { useEffect, useState, useCallback } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("https://seiketsu-backend.onrender.com/api/admin/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id) => {
    await fetch(`https://seiketsu-backend.onrender.com/api/admin/requests/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests();
  };

  const handleReject = async (id) => {
    await fetch(`https://seiketsu-backend.onrender.com/api/admin/requests/${id}/reject`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests();
  };

  if (loading) return <div className="admin-loading">Loading requests...</div>;

  return (
    <div className="admin-container">

      {/* HEADER */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>🛠️ Admin Dashboard</h1>
          <p>Review and manage incoming dustbin requests</p>
        </div>
        <div className="admin-badge">Admin Panel</div>
      </div>

      {/* SUMMARY BAR */}
      <div className="admin-summary">
        <div className="admin-summary-card">
          <span className="admin-summary-icon">📋</span>
          <div>
            <div className="admin-summary-val">{requests.length}</div>
            <div className="admin-summary-label">Pending Requests</div>
          </div>
        </div>
        <div className="admin-summary-card">
          <span className="admin-summary-icon">⏳</span>
          <div>
            <div className="admin-summary-val">
              {requests.filter((r) => r.status === "pending").length}
            </div>
            <div className="admin-summary-label">Awaiting Review</div>
          </div>
        </div>
      </div>

      {/* REQUEST LIST */}
      <div className="admin-section-title">Pending Requests</div>

      {requests.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🎉</div>
          <h3>All caught up!</h3>
          <p>No pending dustbin requests at the moment.</p>
        </div>
      ) : (
        <div className="request-list">
          {requests.map((req, index) => (
            <div
              key={req._id}
              className="request-card"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="request-card-top">
                <div className="request-meta">
                  <div className="request-message">
                    💬 {req.message || "No description provided"}
                  </div>
                  <div className="request-location">
                    📍 {req.location.coordinates[1].toFixed(5)}, {req.location.coordinates[0].toFixed(5)}
                  </div>
                  {req.reportedBy?.name && (
                    <div className="request-user">
                      Submitted by <span>{req.reportedBy.name}</span>
                    </div>
                  )}
                </div>
                <span className="request-status-badge status-pending">Pending</span>
              </div>

              <div className="request-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(req._id)}
                >
                  ✅ Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(req._id)}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
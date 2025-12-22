import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDeletionRequests() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("PENDING");

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/deletion-requests?status=${filterStatus}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(data.requests || []);
    } catch (e) {
      console.error("Error fetching deletion requests:", e);
      setRequests([]);
    }
    setLoading(false);
  };

  const openDetail = (request) => {
    setSelected(request);
    setActionMsg("");
  };

  const closeDetail = () => {
    setSelected(null);
    setActionMsg("");
  };

  const handleApprove = async () => {
    if (!window.confirm(`Are you sure you want to DELETE ${selected.name}'s account? This action cannot be undone and will delete all their data including orders, donations, and gift orders.`)) {
      return;
    }

    setProcessing(true);
    setActionMsg("");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/deletion-requests/${selected._id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMsg(data.message);
      setRequests(requests.filter(r => r._id !== selected._id));
      setTimeout(() => closeDetail(), 2000);
    } catch (e) {
      setActionMsg(e.response?.data?.message || "Failed to approve deletion");
    }
    setProcessing(false);
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason (optional):");
    
    setProcessing(true);
    setActionMsg("");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/deletion-requests/${selected._id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMsg(data.message);
      setRequests(requests.map(r => r._id === selected._id ? data.user : r));
      setTimeout(() => closeDetail(), 2000);
    } catch (e) {
      setActionMsg(e.response?.data?.message || "Failed to reject deletion");
    }
    setProcessing(false);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Account Deletion Requests</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setFilterStatus("PENDING")}
            className={filterStatus === "PENDING" ? "admin-filter-btn active" : "admin-filter-btn"}
          >
            Pending ({requests.filter(r => r.deletionRequest?.status === "PENDING").length})
          </button>
          <button
            onClick={() => setFilterStatus("REJECTED")}
            className={filterStatus === "REJECTED" ? "admin-filter-btn active" : "admin-filter-btn"}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          <i className="fas fa-inbox" style={{ fontSize: 48, marginBottom: 16, color: "#ccc" }}></i>
          <p>No {filterStatus.toLowerCase()} deletion requests found</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Requested On</th>
              <th>Status</th>
              <th>Volunteer</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr
                key={r._id}
                style={{ cursor: "pointer" }}
                onClick={() => openDetail(r)}
              >
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.phone || "-"}</td>
                <td>{formatDate(r.deletionRequest?.requestedAt)}</td>
                <td>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    background: r.deletionRequest?.status === "PENDING" ? "#fff3cd" : "#f8d7da",
                    color: r.deletionRequest?.status === "PENDING" ? "#856404" : "#721c24"
                  }}>
                    {r.deletionRequest?.status}
                  </span>
                </td>
                <td>
                  {r.is_volunteer ? (
                    <span style={{ color: "#388e3c", fontWeight: 600 }}>Yes</span>
                  ) : (
                    <span style={{ color: "#999" }}>No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="admin-modal-overlay" onClick={closeDetail}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeDetail}>&times;</button>
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Deletion Request Details</h3>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 12 }}>
                <strong>Name:</strong> {selected.name}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Email:</strong> {selected.email}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Phone:</strong> {selected.phone || "-"}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Admin:</strong> {selected.isAdmin ? "Yes" : "No"}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Volunteer:</strong> {selected.is_volunteer ? "Yes" : "No"}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Requested On:</strong> {formatDate(selected.deletionRequest?.requestedAt)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Status:</strong>{" "}
                <span style={{
                  padding: "4px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  background: selected.deletionRequest?.status === "PENDING" ? "#fff3cd" : "#f8d7da",
                  color: selected.deletionRequest?.status === "PENDING" ? "#856404" : "#721c24"
                }}>
                  {selected.deletionRequest?.status}
                </span>
              </div>
              {selected.deletionRequest?.reason && (
                <div style={{ marginBottom: 12 }}>
                  <strong>Reason:</strong>
                  <div style={{
                    marginTop: 6,
                    padding: 12,
                    background: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: 6
                  }}>
                    {selected.deletionRequest.reason}
                  </div>
                </div>
              )}
              {selected.deletionRequest?.status === "REJECTED" && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Rejected On:</strong> {formatDate(selected.deletionRequest?.rejectedAt)}
                  </div>
                  {selected.deletionRequest?.rejectionReason && (
                    <div style={{ marginBottom: 12 }}>
                      <strong>Rejection Reason:</strong>
                      <div style={{
                        marginTop: 6,
                        padding: 12,
                        background: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        borderRadius: 6
                      }}>
                        {selected.deletionRequest.rejectionReason}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {selected.deletionRequest?.status === "PENDING" && (
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="admin-save-btn"
                  style={{ background: "#dc3545", flex: 1 }}
                  disabled={processing}
                  onClick={handleApprove}
                >
                  {processing ? "Processing..." : "Approve & Delete Account"}
                </button>
                <button
                  className="admin-save-btn"
                  style={{ background: "#6c757d", flex: 1 }}
                  disabled={processing}
                  onClick={handleReject}
                >
                  {processing ? "Processing..." : "Reject Request"}
                </button>
              </div>
            )}

            {actionMsg && (
              <div style={{
                marginTop: 16,
                padding: 12,
                background: actionMsg.includes("Failed") ? "#f8d7da" : "#d4edda",
                border: actionMsg.includes("Failed") ? "1px solid #f5c6cb" : "1px solid #c3e6cb",
                borderRadius: 6,
                color: actionMsg.includes("Failed") ? "#721c24" : "#155724",
                fontWeight: 500
              }}>
                {actionMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
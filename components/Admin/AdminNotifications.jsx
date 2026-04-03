import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

function AdminNotifications() {
  const { getAuthHeaders } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState("logs");

  // Notification logs state
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [channelFilter, setChannelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Template state
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // Retry state
  const [retryingId, setRetryingId] = useState(null);

  // Fetch notification logs
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 20);
      if (channelFilter) params.append("channel", channelFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/admin/list?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      setNotifications(data.data?.notifications || []);
      setTotal(data.data?.total || 0);
      setTotalPages(data.data?.pages || 1);
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [page, channelFilter, statusFilter, search, startDate, endDate, getAuthHeaders]);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/admin/templates`,
        { headers: getAuthHeaders() }
      );
      setTemplates(data.data?.templates || []);
    } catch (e) {
      console.error("Failed to fetch templates:", e);
      setTemplates([]);
    } finally {
      setTemplatesLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch notifications when filters or page change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Fetch templates on mount
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [channelFilter, statusFilter, search, startDate, endDate]);

  // Handle retry
  const handleRetry = async (id) => {
    setRetryingId(id);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/admin/${id}/retry`,
        {},
        { headers: getAuthHeaders() }
      );
      // Refresh the list after retry
      await fetchNotifications();
    } catch (e) {
      console.error("Retry failed:", e);
      alert(e.response?.data?.message || "Failed to retry notification");
    } finally {
      setRetryingId(null);
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
      case "delivered":
        return "#388e3c";
      case "failed":
      case "permanently_failed":
        return "#d32f2f";
      case "pending":
      case "sending":
        return "#f57c00";
      default:
        return "#666";
    }
  };

  // Channel badge color
  const getChannelColor = (channel) => {
    switch (channel) {
      case "email":
        return "#1976d2";
      case "whatsapp":
        return "#25D366";
      case "push":
        return "#9c27b0";
      default:
        return "#666";
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-notifications">
      <h2
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <i className="fas fa-bell" style={{ color: "#388e3c" }}></i>
        Notifications
        <span
          style={{
            fontSize: 14,
            background: "#388e3c20",
            color: "#388e3c",
            padding: "4px 12px",
            borderRadius: 12,
            fontWeight: 600,
          }}
        >
          {total}
        </span>
      </h2>

      {/* Tab switcher */}
      <div className="admin-notifications__tabs">
        <button
          className={activeTab === "logs" ? "active" : ""}
          onClick={() => setActiveTab("logs")}
        >
          <i className="fas fa-list-alt"></i> Notification Logs
        </button>
        <button
          className={activeTab === "templates" ? "active" : ""}
          onClick={() => setActiveTab("templates")}
        >
          <i className="fas fa-file-alt"></i> Templates
        </button>
      </div>

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <>
          {/* Filters */}
          <div className="admin-notifications__filters">
            <input
              type="text"
              placeholder="Search by recipient or template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-notifications__search"
            />
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="admin-notifications__select"
            >
              <option value="">All Channels</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="push">Push</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-notifications__select"
            >
              <option value="">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="permanently_failed">Permanently Failed</option>
              <option value="pending">Pending</option>
              <option value="sending">Sending</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="admin-notifications__date"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="admin-notifications__date"
              placeholder="End Date"
            />
          </div>

          {/* Notification table */}
          {loading ? (
            <div className="admin-loading">
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#f9f9f9",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
              }}
            >
              <i
                className="fas fa-bell-slash"
                style={{ fontSize: 48, color: "#ccc", marginBottom: 16, display: "block" }}
              ></i>
              <p style={{ color: "#888", fontSize: 16 }}>
                No notifications found
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="admin-notifications__table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Channel</th>
                    <th>Template</th>
                    <th>Status</th>
                    <th>Provider</th>
                    <th>Sent At</th>
                    <th>Retries</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((n) => (
                    <tr key={n._id}>
                      <td
                        style={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={n.recipient}
                      >
                        {n.recipient}
                      </td>
                      <td>
                        <span
                          className="admin-notifications__badge"
                          style={{
                            background: getChannelColor(n.channel) + "20",
                            color: getChannelColor(n.channel),
                            border: `1px solid ${getChannelColor(n.channel)}40`,
                          }}
                        >
                          {n.channel === "whatsapp" ? "WhatsApp" : n.channel === "email" ? "Email" : "Push"}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>{n.templateName}</td>
                      <td>
                        <span
                          className="admin-notifications__badge"
                          style={{
                            background: getStatusColor(n.status) + "20",
                            color: getStatusColor(n.status),
                            border: `1px solid ${getStatusColor(n.status)}40`,
                          }}
                        >
                          {n.status.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: "#666" }}>
                        {n.provider || "-"}
                      </td>
                      <td style={{ fontSize: 13, color: "#666" }}>
                        {formatDate(n.sentAt || n.createdAt)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {n.retryCount}/{n.maxRetries || 3}
                      </td>
                      <td>
                        {(n.status === "failed" || n.status === "permanently_failed") && (
                          <button
                            className="admin-notifications__retry-btn"
                            onClick={() => handleRetry(n._id)}
                            disabled={retryingId === n._id}
                          >
                            {retryingId === n._id ? (
                              <><i className="fas fa-spinner fa-spin"></i> Retrying</>
                            ) : (
                              <><i className="fas fa-redo"></i> Retry</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-notifications__pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span>
                Page {page} of {totalPages} ({total} total)
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <>
          {templatesLoading ? (
            <div className="admin-loading">
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : templates.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#f9f9f9",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
              }}
            >
              <i
                className="fas fa-file-alt"
                style={{ fontSize: 48, color: "#ccc", marginBottom: 16, display: "block" }}
              ></i>
              <p style={{ color: "#888", fontSize: 16 }}>
                No templates found
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="admin-notifications__table">
                <thead>
                  <tr>
                    <th>Template Name</th>
                    <th>Channel</th>
                    <th>Description</th>
                    <th>Total Sent</th>
                    <th>Last Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td>
                        <span
                          className="admin-notifications__badge"
                          style={{
                            background: getChannelColor(t.channel) + "20",
                            color: getChannelColor(t.channel),
                            border: `1px solid ${getChannelColor(t.channel)}40`,
                          }}
                        >
                          {t.channel === "whatsapp" ? "WhatsApp" : t.channel === "email" ? "Email" : "Push"}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: "#555" }}>
                        {t.description}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>
                        {t.totalSent}
                      </td>
                      <td style={{ fontSize: 13, color: "#666" }}>
                        {t.lastSentAt ? formatDate(t.lastSentAt) : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminNotifications;

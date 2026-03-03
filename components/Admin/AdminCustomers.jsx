import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const availabilityLabels = {
  weekends: "Weekends Only",
  weekdays: "Weekdays",
  flexible: "Flexible",
  events: "Events Only"
};

export default function AdminCustomers() {
  const { getAuthHeaders } = useAuth();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [edit, setEdit] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users`,
        { headers: getAuthHeaders() }
      );
      setUsers(data.users);
    } catch (e) {
      setUsers([]);
    }
    setLoading(false);
  };

  const openDetail = user => {
    setSelected(user);
    setEdit({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      isAdmin: !!user.isAdmin,
      address: user.address || { street: "", city: "", state: "", pincode: "" }
    });
    setSaveMsg("");
  };

  const closeDetail = () => {
    setSelected(null);
    setEdit({});
    setSaveMsg("");
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (["street", "city", "state", "pincode"].includes(name)) {
      setEdit({ ...edit, address: { ...edit.address, [name]: value } });
    } else if (type === "checkbox") {
      setEdit({ ...edit, [name]: checked });
    } else {
      setEdit({ ...edit, [name]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${selected._id}`,
        edit,
        { headers: getAuthHeaders() }
      );
      setSaveMsg("Saved!");
      setUsers(users =>
        users.map(u => (u._id === data._id ? { ...u, ...data } : u))
      );
      setSelected({ ...selected, ...data });
    } catch (e) {
      setSaveMsg("Failed to save.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this user?")) return;
    setSaving(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${selected._id}`,
        { headers: getAuthHeaders() }
      );
      setUsers(users => users.filter(u => u._id !== selected._id));
      closeDetail();
    } catch (e) {
      setSaveMsg("Failed to delete.");
    }
    setSaving(false);
  };

  return (
    <div>
      <h2>Customers</h2>
      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Admin</th>
              <th>Volunteer</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr
                key={u._id}
                style={{ cursor: "pointer" }}
                onClick={() => openDetail(u)}
              >
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  {u.isAdmin
                    ? <span style={{ color: "#388e3c", fontWeight: 600 }}>Yes</span>
                    : <span style={{ color: "#b62222", fontWeight: 600 }}>No</span>
                  }
                </td>
                <td>
                  {u.is_volunteer
                    ? <span style={{ color: "#388e3c", fontWeight: 600 }}>Yes</span>
                    : <span style={{ color: "#b62222", fontWeight: 600 }}>No</span>
                  }
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
            <h3 style={{ fontWeight: 600, marginBottom: 7 }}>Edit Customer</h3>
            <div style={{ marginBottom: 18 }}>
              <label>Name</label>
              <input
                name="name"
                value={edit.name}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%", marginBottom: 10 }}
              />
              <label>Email</label>
              <input
                name="email"
                value={edit.email}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%", marginBottom: 10 }}
              />
              <label>Phone</label>
              <input
                name="phone"
                value={edit.phone}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%", marginBottom: 10 }}
              />
              <label>
                <input
                  name="isAdmin"
                  type="checkbox"
                  checked={edit.isAdmin}
                  onChange={handleChange}
                  style={{ marginRight: 8 }}
                />
                Is Admin
              </label>
            </div>

            {/* Volunteer Details (Read-only, non-editable) */}
            {selected.is_volunteer && selected.volunteer && (
              <div style={{
                marginTop: 18,
                marginBottom: 16,
                background: "#f3f6fb",
                border: "1px solid #d6e3f3",
                borderRadius: 8,
                padding: "14px 16px"
              }}>
                <div style={{ fontWeight: 600, color: "#1976d2", marginBottom: 7 }}>
                  Volunteer Details
                </div>
                <div style={{ marginBottom: 5 }}>
                  <strong>City:</strong> {selected.volunteer.city || "-"}
                </div>
                <div style={{ marginBottom: 5 }}>
                  <strong>Availability:</strong>{" "}
                  {availabilityLabels[selected.volunteer.availability] || selected.volunteer.availability || "-"}
                </div>
                <div style={{ marginBottom: 5 }}>
                  <strong>Sector:</strong> {selected.volunteer.sector || "-"}
                </div>
                <div style={{ marginBottom: 5 }}>
                  <strong>Profession:</strong> {selected.volunteer.profession || "-"}
                </div>
                <div>
                  <strong>Motivation:</strong>
                  <div style={{
                    marginTop: 2,
                    background: "#fff",
                    border: "1px solid #d6e3f3",
                    borderRadius: 4,
                    padding: "7px 10px",
                    minHeight: 32
                  }}>
                    {selected.volunteer.why_do_you_want_to_join_us
                      ? selected.volunteer.why_do_you_want_to_join_us
                      : <span style={{ color: "#aaa" }}>-</span>
                    }
                  </div>
                </div>
              </div>
            )}

            <button className="admin-save-btn" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="admin-save-btn"
              style={{ background: "#b62222", marginLeft: 12 }}
              disabled={saving}
              onClick={handleDelete}
            >
              {saving ? "Deleting..." : "Delete"}
            </button>
            <div style={{
              minHeight: 28,
              marginTop: 8,
              color: saveMsg.includes("Failed") ? "#b62222" : "#388e3c",
              fontWeight: 500
            }}>
              {saveMsg}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
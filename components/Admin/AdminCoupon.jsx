import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function AdminCoupons() {
  const { getAuthHeaders } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [edit, setEdit] = useState({});
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons`,
        {
          headers: getAuthHeaders(),
        }
      );
      setCoupons(data);
    } catch (e) {
      setCoupons([]);
    }
    setLoading(false);
  };

  // ✅ Input handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Open new coupon modal
  const openNew = () => {
    setIsNew(true);
    setEdit({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderValue: 0,
      expiryDate: "",
      usageLimit: 1,
    });
    setSelected(null);
  };

  // ✅ Open edit coupon modal
  const openEdit = (coupon) => {
    setSelected(coupon);
    setEdit({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      expiryDate: coupon.expiryDate?.split("T")[0], // input type="date"
      usageLimit: coupon.usageLimit,
    });
    setIsNew(false);
  };

  // ✅ Close modal
  const closeModal = () => {
    setSelected(null);
    setIsNew(false);
    setEdit({});
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      if (isNew) {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/create`,
          edit,
          { headers: getAuthHeaders() }
        );
        setCoupons((arr) => [data, ...arr]);
        setSaveMsg("Coupon created!");
        closeModal();
      } else {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/${selected._id}`,
          edit,
          { headers: getAuthHeaders() }
        );
        setCoupons((arr) =>
          arr.map((c) => (c._id === data._id ? { ...c, ...data } : c))
        );
        setSaveMsg("Coupon updated!");
        setSelected({ ...selected, ...data });
        closeModal();
      }
    } catch (e) {
      setSaveMsg("Failed to save.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this coupon?")) return;
    setSaving(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/${selected._id}`,
        { headers: getAuthHeaders() }
      );
      setCoupons((arr) => arr.filter((c) => c._id !== selected._id));
      closeModal();
    } catch (e) {
      setSaveMsg("Failed to delete.");
    }
    setSaving(false);
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Coupons</h2>
      <button
        className="admin-save-btn"
        style={{ marginBottom: 18 }}
        onClick={openNew}
      >
        + New Coupon
      </button>
      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Order</th>
              <th>Expiry</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr
                key={coupon._id}
                style={{ cursor: "pointer" }}
                onClick={() => openEdit(coupon)}
              >
                <td style={{ fontWeight: 600 }}>{coupon.code}</td>
                <td>{coupon.discountType}</td>
                <td>
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}
                </td>
                <td>{coupon.minOrderValue || "-"}</td>
                <td
                  style={{
                    color: isExpired(coupon.expiryDate)
                      ? "#b62222"
                      : "#388e3c",
                    fontWeight: 600,
                  }}
                >
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td>
                  {coupon.usedCount}/{coupon.usageLimit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Modal */}
      {(selected || isNew) && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal}>
              &times;
            </button>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>
              {isNew ? "Add New Coupon" : "Edit Coupon"}
            </h3>
            <div style={{ marginBottom: 18 }}>
              <label>Code</label>
              <input
                name="code"
                value={edit.code}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%" }}
              />

              <label>Discount Type</label>
              <select
                name="discountType"
                value={edit.discountType}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%" }}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>

              <label>Discount Value</label>
              <input
                name="discountValue"
                type="number"
                value={edit.discountValue}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%" }}
              />

              <label>Minimum Order Value</label>
              <input
                name="minOrderValue"
                type="number"
                value={edit.minOrderValue}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%" }}
              />

              <label>Expiry Date</label>
              <input
                name="expiryDate"
                type="date"
                value={edit.expiryDate}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%" }}
              />

              <label>Usage Limit</label>
              <input
                name="usageLimit"
                type="number"
                value={edit.usageLimit}
                onChange={handleChange}
                className="admin-input"
                style={{ width: "100%" }}
              />
            </div>

            <button
              className="admin-save-btn"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Saving..." : isNew ? "Add Coupon" : "Save"}
            </button>
            {!isNew && (
              <button
                className="admin-save-btn delete"
                style={{ marginLeft: 10 }}
                disabled={saving}
                onClick={handleDelete}
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            )}
            <div
              style={{
                minHeight: 28,
                marginTop: 8,
                color: saveMsg.includes("Failed") ? "#b62222" : "#388e3c",
                fontWeight: 500,
              }}
            >
              {saveMsg}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";

const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [isDelivered, setIsDelivered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data.orders);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setStatus(order.orderStatus || "Pending");
    setIsDelivered(order.isDelivered || false);
    setSaveMsg("");
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/orders/${selectedOrder._id}`,
        { orderStatus: status, isDelivered },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSaveMsg("Order status updated!");
      setOrders((orders) =>
        orders.map((o) => (o._id === data._id ? { ...o, ...data } : o))
      );
      setSelectedOrder({ ...selectedOrder, ...data });
    } catch (e) {
      setSaveMsg("Failed to update order status.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Payment Sync Function
  const handleSyncPayment = async () => {
    if (!selectedOrder) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/check-status`,
        {
          razorpay_order_id: selectedOrder.paymentResult?.id,
          entityId: selectedOrder._id,
          entityType: "order"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ Payment synced successfully!");
        window.location.reload();
      } else {
        alert("⚠️ " + res.data.message);
      }
    } catch (err) {
      alert("❌ Sync failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Orders</h2>
      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                style={{ cursor: "pointer" }}
                onClick={() => openOrderDetail(order)}
              >
                <td style={{ color: "#388e3c", fontWeight: 600 }}>{order._id}</td>
                <td style={{ color: "#1a2332" }}>
                  {order.user?.name || ""}
                </td>
                <td style={{ color: "#388e3c", fontWeight: 500 }}>
                  {order.orderStatus || (order.isDelivered ? "Delivered" : "Pending")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Order Detail */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={closeOrderDetail}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="admin-modal-close"
              onClick={closeOrderDetail}
            >
              &times;
            </button>

            {/* ✅ Top Right Sync Payment Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Order Details</h3>
              {!selectedOrder.isPaid && (
                <button
                  onClick={handleSyncPayment}
                  className="px-3 py-1 bg-green-600 text-white rounded-md"
                >
                  Sync Payment
                </button>
              )}
            </div>

            <div style={{ marginBottom: 18, fontSize: "1.05rem" }}>
              <div><b>Order ID:</b> {selectedOrder._id}</div>
              <div><b>User Name:</b> {selectedOrder.user?.name}</div>
              <div><b>Created:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div><b>Payment:</b> {selectedOrder.paymentMethod}</div>
              <div><b>Total Amount:</b> ₹{selectedOrder.totalPrice}</div>
              <div>
                <b>Shipping:</b>{" "}
                {selectedOrder.shippingAddress?.name},{" "}
                {selectedOrder.shippingAddress?.address},{" "}
                {selectedOrder.shippingAddress?.city},{" "}
                {selectedOrder.shippingAddress?.state},{" "}
                {selectedOrder.shippingAddress?.pincode}
                <br />
                <b>Phone:</b> {selectedOrder.shippingAddress?.phone}
              </div>
              <div style={{ marginTop: 8 }}>
                <b>Items:</b>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {selectedOrder.orderItems.map((item) => (
                    <li key={item._id}>
                      {item.name} x {item.quantity} (₹{item.price})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 500, marginRight: 8 }}>Order Status: </label>
              <select
                value={status}
                style={{ padding: "6px 12px", fontSize: "1.05rem", borderRadius: 6 }}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, marginRight: 8 }}>Delivered:</label>
              <input
                type="checkbox"
                checked={isDelivered}
                onChange={(e) => setIsDelivered(e.target.checked)}
                disabled={saving}
                style={{ transform: "scale(1.3)" }}
              />
            </div>

            <button
              className="admin-save-btn"
              disabled={saving}
              onClick={handleSaveStatus}
            >
              {saving ? "Saving..." : "Save Status"}
            </button>
            <div
              style={{
                minHeight: 28,
                marginTop: 5,
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

export default AdminOrders;

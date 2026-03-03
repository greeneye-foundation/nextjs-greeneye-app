import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const ORDER_STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];

const PAYMENT_STATUS_OPTIONS = [
  "PENDING",
  "COMPLETED",
  "FAILED"
];

function AdminGiftOrders() {
  const { getAuthHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree`,
        { headers: getAuthHeaders() }
      );
      setOrders(data.data || []);
    } catch (e) {
      console.error('Failed to fetch gift orders:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.orderStatus || "PENDING");
    setPaymentStatus(order.paymentStatus || "PENDING");
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
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree/${selectedOrder.orderId}/status`,
        {
          orderStatus,
          paymentStatus
        },
        {
          headers: getAuthHeaders()
        }
      );
      
      setSaveMsg("✅ Gift order status updated!");
      
      // Update the order in the list
      setOrders((orders) =>
        orders.map((o) => 
          o._id === selectedOrder._id 
            ? { ...o, orderStatus, paymentStatus, ...data.data } 
            : o
        )
      );
      
      setSelectedOrder({ ...selectedOrder, orderStatus, paymentStatus });
      
      // Refresh orders to get latest data
      setTimeout(() => {
        fetchOrders();
      }, 1000);
      
    } catch (e) {
      console.error('Update error:', e);
      setSaveMsg("❌ Failed to update gift order status.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    if (!confirm(`Are you sure you want to delete gift order ${selectedOrder.orderId}?`)) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree/${selectedOrder.orderId}`,
        { headers: getAuthHeaders() }
      );
      
      alert("✅ Gift order deleted successfully!");
      setOrders(orders.filter(o => o._id !== selectedOrder._id));
      closeOrderDetail();
    } catch (e) {
      console.error('Delete error:', e);
      alert("❌ Failed to delete gift order.");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ff9800',
      CONFIRMED: '#2196f3',
      PROCESSING: '#9c27b0',
      SHIPPED: '#00bcd4',
      DELIVERED: '#388e3c',
      CANCELLED: '#f44336',
      COMPLETED: '#388e3c',
      FAILED: '#f44336'
    };
    return colors[status] || '#666';
  };

  const getOccasionIcon = (occasion) => {
    const icons = {
      birthday: '🎂',
      anniversary: '💑',
      wedding: '💒',
      memorial: '🕊️',
      corporate: '🏢',
      holiday: '🎄',
      'just-because': '💚'
    };
    return icons[occasion] || '🎁';
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem", display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="fas fa-gift" style={{ color: '#388e3c' }}></i>
        Gift Tree Orders
        <span style={{ 
          fontSize: 14, 
          background: '#388e3c20', 
          color: '#388e3c',
          padding: '4px 12px',
          borderRadius: 12,
          fontWeight: 600
        }}>
          {orders.length}
        </span>
      </h2>
      
      {loading ? (
        <div className="admin-loading">
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#f9f9f9',
          borderRadius: 8,
          border: '1px solid #e0e0e0'
        }}>
          <i className="fas fa-gift" style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }}></i>
          <p style={{ color: '#888', fontSize: 16 }}>No gift tree orders found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Occasion</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Trees</th>
                <th>Amount</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => openOrderDetail(order)}
                >
                  <td style={{ color: "#388e3c", fontWeight: 600 }}>
                    {order.orderId}
                  </td>
                  <td style={{ fontSize: 20 }}>
                    {getOccasionIcon(order.occasion)}
                  </td>
                  <td style={{ color: "#1a2332" }}>
                    {order.senderName}
                  </td>
                  <td style={{ color: "#1a2332" }}>
                    {order.recipientName}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>
                    {order.numberOfTrees}
                  </td>
                  <td style={{ color: "#388e3c", fontWeight: 600 }}>
                    ₹{order.totalAmount}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: getStatusColor(order.orderStatus) + '20',
                      color: getStatusColor(order.orderStatus),
                      border: `1px solid ${getStatusColor(order.orderStatus)}40`
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: getStatusColor(order.paymentStatus) + '20',
                      color: getStatusColor(order.paymentStatus),
                      border: `1px solid ${getStatusColor(order.paymentStatus)}40`
                    }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#666' }}>
                    {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Order Detail */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={closeOrderDetail}>
          <div 
            className="admin-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button
              className="admin-modal-close"
              onClick={closeOrderDetail}
            >
              &times;
            </button>

            {/* Header */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '2px solid #388e3c'
            }}>
              <h3 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fas fa-gift" style={{ color: '#388e3c' }}></i>
                Gift Tree Order Details
                <span style={{ fontSize: 32, marginLeft: 10 }}>
                  {getOccasionIcon(selectedOrder.occasion)}
                </span>
              </h3>
            </div>

            {/* Order Info */}
            <div style={{ marginBottom: 20, fontSize: "1.05rem" }}>
              <div style={{ marginBottom: 12 }}>
                <strong>Order ID:</strong> {selectedOrder.orderId}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Occasion:</strong> {selectedOrder.occasion.charAt(0).toUpperCase() + selectedOrder.occasion.slice(1)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Order Date:</strong> {new Date(selectedOrder.orderDate || selectedOrder.createdAt).toLocaleString('en-IN')}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </div>
            </div>

            {/* Sender & Recipient Info */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 16,
              marginBottom: 20
            }}>
              {/* Sender */}
              <div style={{ 
                background: '#f9f9f9', 
                padding: 16, 
                borderRadius: 8,
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: '#388e3c' }}>
                  <i className="fas fa-user-circle"></i> Sender
                </div>
                <div style={{ fontSize: 14 }}>
                  <div style={{ marginBottom: 6 }}><strong>Name:</strong> {selectedOrder.senderName}</div>
                  {selectedOrder.senderEmail && (
                    <div style={{ marginBottom: 6 }}><strong>Email:</strong> {selectedOrder.senderEmail}</div>
                  )}
                  {selectedOrder.senderPhone && (
                    <div><strong>Phone:</strong> {selectedOrder.senderPhone}</div>
                  )}
                </div>
              </div>

              {/* Recipient */}
              <div style={{ 
                background: '#e8f5e9', 
                padding: 16, 
                borderRadius: 8,
                border: '1px solid #388e3c40'
              }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: '#388e3c' }}>
                  <i className="fas fa-user-friends"></i> Recipient
                </div>
                <div style={{ fontSize: 14 }}>
                  <div style={{ marginBottom: 6 }}><strong>Name:</strong> {selectedOrder.recipientName}</div>
                  <div style={{ marginBottom: 6 }}><strong>Email:</strong> {selectedOrder.recipientEmail}</div>
                  <div><strong>Phone:</strong> {selectedOrder.recipientPhone}</div>
                </div>
              </div>
            </div>

            {/* Personal Message */}
            {selectedOrder.message && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  <i className="fas fa-heart" style={{ color: '#e91e63' }}></i> Personal Message:
                </div>
                <div style={{ 
                  background: '#fff3e0', 
                  padding: 12, 
                  borderRadius: 6,
                  fontStyle: 'italic',
                  border: '1px solid #ffb74d',
                  fontSize: 14
                }}>
                  "{selectedOrder.message}"
                </div>
              </div>
            )}

            {/* Delivery Address */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#388e3c' }}></i> Delivery Address:
              </div>
              <div style={{ 
                background: '#f9f9f9', 
                padding: 12, 
                borderRadius: 6,
                fontSize: 14,
                border: '1px solid #e0e0e0'
              }}>
                {selectedOrder.deliveryAddress.street}<br />
                {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}<br />
                {selectedOrder.deliveryAddress.pincode}, {selectedOrder.deliveryAddress.country}
                {selectedOrder.deliveryAddress.landmark && (
                  <div style={{ marginTop: 6, color: '#666' }}>
                    Landmark: {selectedOrder.deliveryAddress.landmark}
                  </div>
                )}
              </div>
            </div>

            {/* Products/Trees */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                <i className="fas fa-tree" style={{ color: '#388e3c' }}></i> Selected Trees ({selectedOrder.numberOfTrees}):
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {selectedOrder.products.map((product, idx) => (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    <strong>{product.name}</strong> - ₹{product.price}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Breakdown */}
            <div style={{ 
              background: '#f9f9f9', 
              padding: 16, 
              borderRadius: 8,
              marginBottom: 20,
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>
                <i className="fas fa-receipt"></i> Price Breakdown:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Delivery Charge:</span>
                <span style={{ color: selectedOrder.deliveryCharge === 0 ? '#388e3c' : '#333' }}>
                  {selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Tax (GST 18%):</span>
                <span>₹{selectedOrder.tax}</span>
              </div>
              <div style={{ 
                borderTop: '2px solid #388e3c', 
                paddingTop: 10,
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: 18,
                fontWeight: 700
              }}>
                <span>Total Amount:</span>
                <span style={{ color: '#388e3c' }}>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Status Updates */}
            <div style={{ 
              background: '#e8f5e9', 
              padding: 16, 
              borderRadius: 8,
              marginBottom: 16,
              border: '1px solid #388e3c40'
            }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, marginRight: 8, display: 'block', marginBottom: 6 }}>
                  <i className="fas fa-shipping-fast"></i> Order Status:
                </label>
                <select
                  value={orderStatus}
                  style={{ 
                    width: '100%',
                    padding: "8px 12px", 
                    fontSize: "1rem", 
                    borderRadius: 6,
                    border: '1px solid #388e3c'
                  }}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  disabled={saving}
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, marginRight: 8, display: 'block', marginBottom: 6 }}>
                  <i className="fas fa-money-bill-wave"></i> Payment Status:
                </label>
                <select
                  value={paymentStatus}
                  style={{ 
                    width: '100%',
                    padding: "8px 12px", 
                    fontSize: "1rem", 
                    borderRadius: 6,
                    border: '1px solid #388e3c'
                  }}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  disabled={saving}
                >
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="admin-save-btn"
                disabled={saving}
                onClick={handleSaveStatus}
                style={{ flex: 1 }}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save Status
                  </>
                )}
              </button>
              
              <button
                onClick={handleDeleteOrder}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>

            {saveMsg && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  color: saveMsg.includes("Failed") || saveMsg.includes("❌") ? "#b62222" : "#388e3c",
                  background: saveMsg.includes("Failed") || saveMsg.includes("❌") ? "#ffebee" : "#e8f5e9",
                  fontWeight: 500,
                  textAlign: 'center'
                }}
              >
                {saveMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGiftOrders;
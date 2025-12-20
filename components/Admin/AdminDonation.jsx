import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // Filters
  const [donor, setDonor] = useState("");
  const [phone, setPhone] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const fetchDonations = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      const params = new URLSearchParams();
      if (donor) params.append("donor", donor);
      if (phone) params.append("phone", phone);
      if (minAmount) params.append("minAmount", minAmount);
      if (sortBy) params.append("sortBy", sortBy);

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/donations?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDonations(data.donations || []);
    } catch (err) {
      setError("Failed to fetch donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  // ✅ Sync Payment Function
  const handleSyncPayment = async (donation) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/check-status`,
        {
          transaction_id: donation.paymentInfo?.txnid || donation.paymentInfo?.razorpay_order_id,
          entityId: donation._id,
          entityType: "donation",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ Donation payment synced successfully!");
        fetchDonations();
      } else {
        alert("⚠️ " + res.data.message);
      }
    } catch (err) {
      alert("❌ Sync failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>All Donations</h2>

      {/* Filter Form */}
      <form onSubmit={handleFilter} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Donor Name"
          value={donor}
          onChange={(e) => setDonor(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginRight: 10 }}
        >
          <option value="createdAt">Newest</option>
          <option value="amount">Amount</option>
          <option value="donorName">Donor Name</option>
          <option value="donorPhone">Donor Phone</option>
        </select>
        <button type="submit">Apply Filters</button>
      </form>

      {loading ? (
        <div>Loading donations...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Donor</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Date</th>
                <th>Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <React.Fragment key={donation._id}>
                  <tr
                    onClick={() =>
                      setExpandedRow(expandedRow === donation._id ? null : donation._id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{donation.donorName}</td>
                    <td>{donation.donorEmail}</td>
                    <td>{donation.donorPhone}</td>
                    <td>₹{donation.amount}</td>
                    <td style={{ color: donation.isPaid ? "green" : "red" }}>
                      {donation.isPaid ? "Yes" : "No"}
                    </td>
                    <td>{new Date(donation.createdAt).toLocaleString()}</td>
                    <td>{donation.paymentInfo?.mihpayid || donation.paymentInfo?.razorpay_payment_id || "-"}</td>
                  </tr>

                  {/* Expandable Row */}
                  {expandedRow === donation._id && (
                    <tr>
                      <td colSpan="8">
                        <div
                          style={{
                            background: "#f9f9f9",
                            padding: "10px",
                            marginTop: "5px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                          }}
                        >
                          <strong>Donation Details</strong>
                          <p>Transaction ID: {donation.paymentInfo?.txnid || donation.paymentInfo?.razorpay_order_id || "-"}</p>
                          <p>Status: {donation.isPaid ? "✅ Paid" : "❌ Not Paid"}</p>

                          {!donation.isPaid && (
                            <button
                              onClick={() => handleSyncPayment(donation)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md"
                            >
                              Sync Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDonation;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [giftStats, setGiftStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Fetch regular stats
      const { data: statsData } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(statsData.data);

      // Fetch gift orders stats
      try {
        const { data: giftData } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/gift-orders/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGiftStats(giftData);
      } catch (giftErr) {
        console.error('Gift stats error:', giftErr);
        // Don't fail if gift stats aren't available
      }

    } catch (err) {
      setError("Failed to load stats. Are you logged in as admin?");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#388e3c' }}></i>
        <p style={{ marginTop: 20, color: '#666' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        background: '#ffebee',
        borderRadius: 8,
        color: '#b62222'
      }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: 40, marginBottom: 16 }}></i>
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return <div>No data available.</div>;
  }

  const { today, last30Days, last1Year, totalOrders, userCount, plantCount } = stats;

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 30
      }}>
        <h1 style={{ margin: 0 }}>
          <i className="fas fa-chart-line" style={{ marginRight: 12, color: '#388e3c' }}></i>
          Admin Dashboard
        </h1>
        <button 
          onClick={fetchAllStats}
          style={{
            padding: '10px 20px',
            background: '#388e3c',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Regular Orders Section */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ 
          fontSize: 20, 
          marginBottom: 20,
          color: '#1a2332',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <i className="fas fa-box" style={{ color: '#388e3c' }}></i>
          Regular Orders
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <StatCard 
            title="Today's Orders" 
            value={today?.orders || 0} 
            amount={today?.totalOrderAmount || 0}
            icon="calendar-day"
            color="#2196f3"
          />
          <StatCard 
            title="Monthly Orders" 
            value={last30Days?.orders || 0} 
            amount={last30Days?.totalOrderAmount || 0}
            icon="calendar-alt"
            color="#9c27b0"
          />
          <StatCard 
            title="Yearly Orders" 
            value={last1Year?.orders || 0} 
            amount={last1Year?.totalOrderAmount || 0}
            icon="chart-line"
            color="#ff9800"
          />
          <StatCard 
            title="Total Orders" 
            value={totalOrders || 0}
            icon="box"
            color="#388e3c"
          />
        </div>
      </div>

      {/* Gift Tree Orders Section */}
      {giftStats && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ 
            fontSize: 20, 
            marginBottom: 20,
            color: '#1a2332',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <i className="fas fa-gift" style={{ color: '#e91e63' }}></i>
            Gift Tree Orders
            <Link 
              href="/admin/gift-orders"
              style={{
                fontSize: 14,
                color: '#388e3c',
                textDecoration: 'none',
                marginLeft: 'auto',
                fontWeight: 600
              }}
            >
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            <StatCard 
              title="Today's Gift Orders" 
              value={giftStats.today?.orders || 0} 
              amount={giftStats.today?.revenue || 0}
              subtitle={`${giftStats.today?.trees || 0} trees`}
              icon="gift"
              color="#e91e63"
            />
            <StatCard 
              title="Monthly Gift Orders" 
              value={giftStats.last30Days?.orders || 0} 
              amount={giftStats.last30Days?.revenue || 0}
              subtitle={`${giftStats.last30Days?.trees || 0} trees`}
              icon="tree"
              color="#4caf50"
            />
            <StatCard 
              title="Total Gift Orders" 
              value={giftStats.total?.orders || 0}
              amount={giftStats.total?.revenue || 0}
              icon="chart-bar"
              color="#00bcd4"
            />
          </div>
        </div>
      )}

      {/* Donations Section */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ 
          fontSize: 20, 
          marginBottom: 20,
          color: '#1a2332',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <i className="fas fa-hand-holding-heart" style={{ color: '#f44336' }}></i>
          Donations
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <StatCard 
            title="Today's Donations" 
            value={today?.donations || 0} 
            amount={today?.donationAmount || 0}
            icon="calendar-check"
            color="#f44336"
          />
          <StatCard 
            title="Monthly Donations" 
            value={last30Days?.donations || 0} 
            amount={last30Days?.donationAmount || 0}
            icon="chart-pie"
            color="#ff5722"
          />
          <StatCard 
            title="Total Donations" 
            value={last1Year?.donations || 0} 
            amount={last1Year?.donationAmount || 0}
            icon="heart"
            color="#e91e63"
          />
        </div>
      </div>

      {/* General Stats */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ 
          fontSize: 20, 
          marginBottom: 20,
          color: '#1a2332',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <i className="fas fa-info-circle" style={{ color: '#607d8b' }}></i>
          General Statistics
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <StatCard 
            title="Total Users" 
            value={userCount || 0}
            icon="users"
            color="#3f51b5"
          />
          <StatCard 
            title="Total Plants" 
            value={plantCount || 0}
            icon="seedling"
            color="#8bc34a"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, amount, subtitle, icon, color = "#388e3c" }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        minWidth: 220,
        flex: '1 1 220px',
        borderLeft: `4px solid ${color}`,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 12
      }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 600, 
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </div>
        {icon && (
          <i 
            className={`fas fa-${icon}`} 
            style={{ 
              fontSize: 24, 
              color: color,
              opacity: 0.6
            }}
          />
        )}
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>
        {value}
      </div>
      {amount !== undefined && (
        <div style={{ 
          color: color, 
          fontWeight: 600,
          fontSize: 18,
          marginTop: 8
        }}>
          ₹{amount.toLocaleString('en-IN')}
        </div>
      )}
      {subtitle && (
        <div style={{ 
          color: '#888', 
          fontSize: 13,
          marginTop: 6,
          fontWeight: 500
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
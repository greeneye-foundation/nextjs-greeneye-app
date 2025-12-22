// components/Legal/AccountDeletion.jsx - WITH DEBUG LOGS

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import axios from "axios";

const AccountDeletion = () => {
  const t = useTranslations("accountDeletion");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("authToken");
    
    if (token) {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setIsLoggedIn(true);
        setUserData(data);
        
        // Check if user has pending deletion request
        if (data.deletionRequest && data.deletionRequest.status === 'PENDING') {
          setHasPendingRequest(true);
        } else {
          setHasPendingRequest(false);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user data:", err);
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
      }
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm(t("confirmMessage"))) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/request-deletion`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update state immediately
      setHasPendingRequest(true);
      setMessage(data.message);
      
      // Refresh after a short delay
      setTimeout(async () => {
        await checkLoginStatus();
      }, 1000);
    } catch (err) {
      console.error("❌ Deletion request failed:", err.response?.data);
      setError(err.response?.data?.message || "Failed to submit deletion request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!window.confirm("Are you sure you want to cancel your deletion request?")) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/cancel-deletion`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update state immediately
      setHasPendingRequest(false);
      setMessage(data.message);
      
      // Refresh after a short delay
      setTimeout(async () => {
        await checkLoginStatus();
      }, 1000);
    } catch (err) {
      console.error("❌ Cancel failed:", err.response?.data);
      setError(err.response?.data?.message || "Failed to cancel deletion request");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-header-content">
          <div className="legal-header-icon">
            <i className="fas fa-user-times"></i>
          </div>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>
      </header>

      <div className="legal-content">
        <div className="legal-card">
          <h2>
            <i className="fas fa-info-circle"></i>
            {t("overviewTitle")}
          </h2>
          <p>{t("overviewText")}</p>

          <h2>
            <i className="fas fa-exclamation-triangle"></i>
            {t("importantTitle")}
          </h2>
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
            <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
              <li>{t("permanent")}</li>
              <li>{t("dataLoss")}</li>
              <li>{t("ordersHistory")}</li>
              <li>{t("noRecovery")}</li>
            </ul>
          </div>

          <h2>
            <i className="fas fa-database"></i>
            {t("dataDeletedTitle")}
          </h2>
          <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
            <li>{t("personalInfo")}</li>
            <li>{t("orderHistory")}</li>
            <li>{t("donationRecords")}</li>
            <li>{t("volunteerInfo")}</li>
            <li>{t("giftOrders")}</li>
            <li>{t("savedAddresses")}</li>
          </ul>

          <h2>
            <i className="fas fa-clock"></i>
            {t("processTitle")}
          </h2>
          <ol style={{ marginLeft: "20px", lineHeight: "1.8" }}>
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
            <li>{t("step4")}</li>
          </ol>

          <h2>
            <i className="fas fa-shield-alt"></i>
            {t("legalTitle")}
          </h2>
          <p>{t("legalText")}</p>

          <h2>
            <i className="fas fa-headset"></i>
            {t("supportTitle")}
          </h2>
          <p>
            {t("supportText")}{" "}
            <a href="mailto:contact@greeneye.foundation" style={{ color: "#388e3c", fontWeight: 600 }}>
              contact@greeneye.foundation
            </a>
          </p>

          {/* Action Section */}
          <div style={{
            marginTop: "40px",
            padding: "24px",
            background: "#f8f9fa",
            borderRadius: "12px",
            border: "2px solid #dee2e6"
          }}>
            {/* Debug Info (Remove in production) */}
            {/* <div style={{
              padding: "12px",
              marginBottom: "16px",
              background: "#e7f3ff",
              border: "1px solid #2196F3",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "monospace"
            }}>
              <strong>🐛 Debug Info:</strong>
              <div>hasPendingRequest: {hasPendingRequest ? "true" : "false"}</div>
              <div>userData.deletionRequest: {userData?.deletionRequest ? "EXISTS" : "null/undefined"}</div>
              {userData?.deletionRequest && (
                <div>Status: {userData.deletionRequest.status}</div>
              )}
            </div> */}

            {message && (
              <div style={{
                padding: "12px",
                marginBottom: "16px",
                background: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "8px",
                color: "#155724"
              }}>
                <i className="fas fa-check-circle" style={{ marginRight: "8px" }}></i>
                {message}
              </div>
            )}

            {error && (
              <div style={{
                padding: "12px",
                marginBottom: "16px",
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "8px",
                color: "#721c24"
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>
                {error}
              </div>
            )}

            {isLoggedIn ? (
              <div>
                <p style={{ marginBottom: "16px", fontWeight: 500 }}>
                  {t("loggedInAs")}: {userData?.name} ({userData?.email})
                </p>
                
                {hasPendingRequest ? (
                  <div>
                    <div style={{
                      padding: "16px",
                      marginBottom: "16px",
                      background: "#fff3cd",
                      border: "1px solid #ffc107",
                      borderRadius: "8px",
                      color: "#856404"
                    }}>
                      <i className="fas fa-clock" style={{ marginRight: "8px" }}></i>
                      <strong>You have a pending deletion request.</strong>
                      <p style={{ marginTop: "8px", marginBottom: 0 }}>
                        Your request is under review. You will receive an email once the admin processes your request.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleCancelRequest}
                      disabled={loading}
                      style={{
                        padding: "14px 32px",
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => !loading && (e.target.style.background = "#5a6268")}
                      onMouseLeave={(e) => !loading && (e.target.style.background = "#6c757d")}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times" style={{ marginRight: "8px" }}></i>
                          Cancel Deletion Request
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleDeleteRequest}
                    disabled={loading}
                    style={{
                      padding: "14px 32px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.background = "#c82333")}
                    onMouseLeave={(e) => !loading && (e.target.style.background = "#dc3545")}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                        {t("processing")}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash-alt" style={{ marginRight: "8px" }}></i>
                        {t("requestButton")}
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ marginBottom: "16px", fontSize: "16px", color: "#666" }}>
                  {t("loginRequired")}
                </p>
                <button
                  onClick={handleLogin}
                  style={{
                    padding: "14px 32px",
                    background: "#388e3c",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#2e7d32"}
                  onMouseLeave={(e) => e.target.style.background = "#388e3c"}
                >
                  <i className="fas fa-sign-in-alt" style={{ marginRight: "8px" }}></i>
                  {t("loginButton")}
                </button>
              </div>
            )}
          </div>

          <div className="contact-link-wrapper" style={{ marginTop: "32px" }}>
            <a href="/contact" className="contact-link">
              <i className="fas fa-envelope"></i>
              {t("contactUs")}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountDeletion;
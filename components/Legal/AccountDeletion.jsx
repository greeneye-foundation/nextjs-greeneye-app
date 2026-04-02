import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const AccountDeletion = () => {
  const t = useTranslations("accountDeletion");
  const router = useRouter();
  const { getAuthHeaders, logout } = useAuth();
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
    const headers = getAuthHeaders();

    if (headers.Authorization) {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers }
        );

        setIsLoggedIn(true);
        setUserData(data);

        if (data.deletionRequest && data.deletionRequest.status === 'PENDING') {
          setHasPendingRequest(true);
        } else {
          setHasPendingRequest(false);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user data:", err);
        setIsLoggedIn(false);
        await logout();
      }
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm(t("confirmMessage"))) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/request-deletion`,
        {},
        { headers: getAuthHeaders() }
      );

      setHasPendingRequest(true);
      setMessage(data.message);

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
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/cancel-deletion`,
        { headers: getAuthHeaders() }
      );

      setHasPendingRequest(false);
      setMessage(data.message);

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
          <div className="warning-box">
            <ul>
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
          <ul>
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
          <ol>
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
            <a href="mailto:contact@greeneye.foundation">
              contact@greeneye.foundation
            </a>
          </p>

          {/* Action Section */}
          <div className="legal-action-box">
            {message && (
              <div className="legal-alert legal-alert--success">
                <i className="fas fa-check-circle"></i>
                {message}
              </div>
            )}

            {error && (
              <div className="legal-alert legal-alert--error">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {isLoggedIn ? (
              <div>
                <p className="legal-action-user">
                  {t("loggedInAs")}: {userData?.name} ({userData?.email})
                </p>

                {hasPendingRequest ? (
                  <div>
                    <div className="legal-alert legal-alert--warning">
                      <i className="fas fa-clock"></i>
                      <div>
                        <strong>You have a pending deletion request.</strong>
                        <p>
                          Your request is under review. You will receive an email once the admin processes your request.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCancelRequest}
                      disabled={loading}
                      className="ge-btn ge-btn-ghost legal-btn-cancel"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times"></i>
                          Cancel Deletion Request
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleDeleteRequest}
                    disabled={loading}
                    className="ge-btn legal-btn-delete"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        {t("processing")}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash-alt"></i>
                        {t("requestButton")}
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="ge-text-center">
                <p className="legal-action-login-text">
                  {t("loginRequired")}
                </p>
                <button
                  onClick={handleLogin}
                  className="ge-btn ge-btn-primary"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  {t("loginButton")}
                </button>
              </div>
            )}
          </div>

          <div className="contact-link-wrapper">
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

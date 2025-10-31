// pages/otp-login.jsx
// This page now redirects to the unified login page with OTP tab

import React, { useEffect } from "react";
import { useRouter } from "next/router";

const OtpLogin = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified login page
    router.replace("/login");
  }, [router]);

  return (
    <div className="auth-container">
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#2d5a27" }}></i>
        <p style={{ marginTop: "1rem", color: "#6c757d" }}>Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default OtpLogin;

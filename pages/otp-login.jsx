// pages/otp-login.jsx
// Redirects to unified login page

import React, { useEffect } from "react";
import { useRouter } from "next/router";

const OtpLogin = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="ge-status">
      <div className="ge-status-card" style={{ maxWidth: 400, textAlign: 'center' }}>
        <div className="ge-status-icon ge-status-icon--loading">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p className="ge-status-subtitle">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default OtpLogin;

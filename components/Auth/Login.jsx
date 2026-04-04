import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { showNotification } from "@/components/Notification";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from "@/context/AuthContext";
import PhoneInput from "@/components/common/PhoneInput";

const Login = ({ onSwitch, onLogin }) => {
  const t = useTranslations("login");
  const { login } = useAuth();
  const redirectTo = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('from') || '/profile'
    : '/profile';
  const [activeTab, setActiveTab] = useState("email");
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // OTP states
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePassword = () => setShowPwd((v) => !v);

  // OTP handlers
  const handleSendOtp = async () => {
    if (!mobile.match(/^\+\d{1,3}\d{6,14}$/)) {
      showNotification(t("validMobile") || "Please enter a valid mobile number", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/otp-send', { phone: mobile });
      showNotification(t("otpSent") || "OTP sent successfully", "success");
      setOtpSent(true);
    } catch (error) {
      showNotification(error.response?.data?.message || t("otpFailed") || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.match(/^\d{4,6}$/)) {
      showNotification(t("validOtp") || "Please enter a valid OTP", "error");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/otp-login', { phone: mobile, otp });
      login(data, data.token);
      showNotification(t("loginSuccess"), "success");
      router.push(redirectTo);
      if (onLogin) onLogin(data);
    } catch (error) {
      showNotification(error.response?.data?.message || t("invalidOtp") || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid(form.email)) {
      showNotification(t("invalidEmail"), "error");
      return;
    }
    if (!form.password) {
      showNotification(t("enterPassword"), "error");
      return;
    }
    if (!executeRecaptcha) {
      showNotification("Recaptcha not ready, please try again.", "error");
      return;
    }

    setLoading(true);

    try {
      // 🔹 recaptcha token generate
      const recaptchaToken = await executeRecaptcha("login_action");
      const { data } = await axios.post('/api/auth/login', {
        email: form.email,
        password: form.password,
        recaptchaToken,
      });

      login(data, data.token);
      showNotification(t("loginSuccess"), "success");
      router.push(redirectTo);

      if (onLogin) onLogin(data);

      setForm({ email: "", password: "", remember: false });
    } catch (error) {
      showNotification(
        error.response?.data?.message || t("invalidCredentials"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h3>
          <i className="fas fa-sign-in-alt"></i> {t("signInTitle")}
        </h3>
        <p style={{ color: "#6c757d", fontSize: "0.95rem", marginTop: "0.5rem" }}>
          {t("welcomeBack") || "Welcome back! Please sign in to continue"}
        </p>
      </div>

      {/* Google Login */}
      <GoogleLoginButton onSuccess={onLogin} />

      {/* Divider */}
      <div className="auth-divider">
        <span>{t("or") || "OR"}</span>
      </div>

      {/* Tab Switcher */}
      <div className="login-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === "email" ? "active" : ""}`}
          onClick={() => setActiveTab("email")}
        >
          <i className="fas fa-envelope"></i> {t("emailPassword") || "Email / Password"}
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "otp" ? "active" : ""}`}
          onClick={() => setActiveTab("otp")}
        >
          <i className="fas fa-mobile-alt"></i> {t("otpLogin") || "OTP Login"}
        </button>
      </div>

      {/* Email/Password Tab */}
      {activeTab === "email" && (
        <form
          className="auth-form"
          id="loginForm"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Email */}
          <div className="form-group">
            <input
              type="email"
              id="loginEmail"
              name="email"
              placeholder={t("emailPlaceholder")}
              value={form.email}
              onChange={handleChange}
              className={form.email && !isEmailValid(form.email) ? "invalid" : ""}
              required
            />
            <i className="fas fa-envelope"></i>
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              type={showPwd ? "text" : "password"}
              id="loginPassword"
              name="password"
              placeholder={t("passwordPlaceholder")}
              value={form.password}
              onChange={handleChange}
              required
            />
            <i className="fas fa-lock"></i>
            <button
              type="button"
              className="password-toggle"
              onClick={togglePassword}
              tabIndex={-1}
              aria-label={showPwd ? t("hidePassword") : t("showPassword")}
            >
              <i className={`fas ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>

          {/* Remember me */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              {t("rememberMe")}
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> <span>{t("signingIn")}</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> <span>{t("signInBtn")}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* OTP Tab */}
      {activeTab === "otp" && (
        <form
          className="auth-form"
          id="otpLoginForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
        >
          <div className="form-group">
            <PhoneInput name="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="XXXXX XXXXX" />
          </div>

          {otpSent && (
            <div className="form-group">
              <input
                type="text"
                name="otp"
                placeholder={t("otpPlaceholder") || "Enter OTP"}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <i className="fas fa-key"></i>
            </div>
          )}

          {!otpSent ? (
            <button className="btn btn-primary btn-full" onClick={handleSendOtp} disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> <span>{t("sendingOtp") || "Sending OTP..."}</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> <span>{t("sendOtp") || "Send OTP"}</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button className="btn btn-primary btn-full" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> <span>{t("verifying") || "Verifying..."}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-unlock-alt"></i> <span>{t("verifyOtp") || "Verify OTP"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-link"
                onClick={handleSendOtp}
                disabled={loading}
                style={{ marginTop: "1rem" }}
              >
                {t("resendOtp") || "Resend OTP"}
              </button>
            </>
          )}
        </form>
      )}

      {/* Switch to Register */}
      <div className="auth-switch">
        <p>
          {t("newToGreenEye")}{" "}
          <button
            className="link-btn"
            type="button"
            onClick={() => router.push("/register")}
          >
            {t("createAccount")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

//'use client';
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { showNotification } from "@/components/Notification";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const Register = ({ onSwitch }) => {
  const t = useTranslations("register");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    newsletter: false,
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) =>
    /^[+]?[1-9][\d]{9,15}$/.test(phone.replace(/\s/g, ""));
  const isPasswordStrong = (pwd) =>
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd);
  const isPasswordMatch = form.password === form.confirmPassword;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePassword = (type) => {
    if (type === "password") setShowPwd((v) => !v);
    if (type === "confirm") setShowConfirmPwd((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordMatch) return showNotification(t("pwdNoMatch"), "error");
    if (!isPasswordStrong(form.password)) return showNotification(t("pwdWeak"), "error");
    if (!form.agreeTerms) return showNotification(t("agreeTermsMsg"), "error");
    if (!isEmailValid(form.email)) return showNotification(t("invalidEmail"), "error");
    if (!isPhoneValid(form.phone)) return showNotification(t("invalidPhone"), "error");
    if (!executeRecaptcha) {
      showNotification("Please verify that you are not a robot.", "error");
      return;
    }
    setLoading(true);
    try {
      const phone = form.phone.startsWith("+") ? form.phone : `+91${form.phone}`;
      // 🔹 recaptcha token generate
      const recaptchaToken = await executeRecaptcha("login_action");
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/otp/send`, {
        phone,
        email: form.email,
        recaptchaToken
      });

      showNotification("OTP sent to your SMS", "success");
      setOtpSent(true);
    } catch (err) {
      const msg = err.response?.data?.message;
      const field = err.response?.data?.field;

      if (field === "email") {
        showNotification("This email is already registered. Please login instead.", "error");
        router.push("/login");
        return;
      }

      if (field === "phone") {
        showNotification("This phone number is already registered. Please login instead.", "error");
        router.push("/login");
        return;
      }

      showNotification(msg || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!otp) return showNotification("Please enter OTP", "error");

    setLoading(true);
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        phone: form.phone,
        otp: otp,
      };

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/otp/verify`, payload);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        showNotification(t("registerSuccess"), "success");
        router.push("/profile");
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
        newsletter: false,
      });

      if (onSwitch) setTimeout(() => onSwitch(), 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || t("registerFail");
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* WhatsApp QR Section */}
      <div className="whatsapp-section">
        <div className="qr-container">
          <div className="qr-code">
            <img
              src="/assets/whatsappQR.png"
              alt={t("whatsappQRAlt")}
              className="qr-image"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling)
                  e.target.nextSibling.style.display = "block";
              }}
            />
            <div className="qr-fallback" style={{ display: "none" }}>
              <i className="fab fa-whatsapp"></i>
              <p>QR Code</p>
            </div>
          </div>
          <div className="qr-instructions">
            <h3><i className="fab fa-whatsapp"></i> {t("registerWithWhatsapp")}</h3>
            <ol>
              <li>{t("waStep1")}</li>
              <li>{t("waStep2")}</li>
              <li>{t("waStep3")}</li>
            </ol>
            <div className="whatsapp-benefits">
              <div className="benefit"><i className="fas fa-bolt"></i> <span>{t("waInstant")}</span></div>
              <div className="benefit"><i className="fas fa-bell"></i> <span>{t("waNotif")}</span></div>
              <div className="benefit"><i className="fas fa-users"></i> <span>{t("waCommunity")}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"><span>{t("or")}</span></div>

      {/* Email/Phone Registration Form */}
      <form className="auth-form" onSubmit={otpSent ? handleOTPVerification : handleSubmit}>
        <h3>{t("registerWithEmail")}</h3>

        {/* Name */}
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder={t("firstName")}
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <i className="fas fa-user"></i>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder={t("lastName")}
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <i className="fas fa-user"></i>
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder={t("email")}
            value={form.email}
            onChange={handleChange}
            required
            className={form.email && !isEmailValid(form.email) ? "invalid" : ""}
          />
          <i className="fas fa-envelope"></i>
        </div>

        {/* Phone */}
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder={t("phone")}
            value={form.phone}
            onChange={handleChange}
            required
            className={form.phone && !isPhoneValid(form.phone) ? "invalid" : ""}
          />
          <i className="fas fa-phone"></i>
        </div>

        {/* Password */}
        <div className="form-group">
          <input
            type={showPwd ? "text" : "password"}
            name="password"
            placeholder={t("createPwd")}
            value={form.password}
            onChange={handleChange}
            required
            className={form.password && !isPasswordStrong(form.password) ? "invalid" : ""}
          />
          <i className="fas fa-lock"></i>
          <button type="button" className="password-toggle" onClick={() => togglePassword("password")}>
            <i className={`fas ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <input
            type={showConfirmPwd ? "text" : "password"}
            name="confirmPassword"
            placeholder={t("confirmPwd")}
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className={!isPasswordMatch ? "invalid" : ""}
          />
          <i className="fas fa-lock"></i>
          <button type="button" className="password-toggle" onClick={() => togglePassword("confirm")}>
            <i className={`fas ${showConfirmPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        {/* OTP Input */}
        {otpSent && (
          <div className="form-group">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <i className="fas fa-key"></i>
          </div>
        )}

        {/* Terms & Newsletter */}
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={handleChange}
              required
            />
            <span className="checkmark"></span>
            {t("agreeMsg1")} <Link href="/legal/terms-of-service" className="link">{t("termsLink")}</Link>{" "}
            {t("agreeMsg2")} <Link href="/legal/privacy-policy" className="link">{t("privacyLink")}</Link>
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="newsletter"
              checked={form.newsletter}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            {t("newsletter")}
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> {otpSent ? "Verifying..." : "Sending OTP..."}
            </>
          ) : (
            <>
              <i className="fas fa-user-plus"></i> {otpSent ? "Verify OTP & Register" : t("createAccount")}
            </>
          )}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          {t("alreadyHaveAccount")}{" "}
          <button className="link-btn" type="button" onClick={() => router.push("/login")}>
            {t("signIn")}
          </button>
        </p>
      </div>
    </>
  );
};

export default Register;

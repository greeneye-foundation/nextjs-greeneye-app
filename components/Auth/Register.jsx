import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { showNotification } from "@/components/Notification";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Modal from "@/components/Modal";
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from "@/context/AuthContext";

const Register = ({ onSwitch }) => {
  const t = useTranslations("register");
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    agreeTerms: false, newsletter: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordStrong = (pwd) => pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd);
  const isPasswordMatch = form.password === form.confirmPassword;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordMatch) return showNotification(t("pwdNoMatch"), "error");
    if (!isPasswordStrong(form.password)) return showNotification(t("pwdWeak"), "error");
    if (!form.agreeTerms) return showNotification(t("agreeTermsMsg"), "error");
    if (!isEmailValid(form.email)) return showNotification(t("invalidEmail"), "error");
    if (!executeRecaptcha) { showNotification("Recaptcha not ready, please try again.", "error"); return; }
    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("register_action");
      const { data } = await axios.post('/api/auth/register', {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email, password: form.password, recaptchaToken
      });
      login(data, data.token);
      showNotification(t("registerSuccess"), "success");
      router.push("/profile");
    } catch (err) {
      if (err.response?.data?.field === "email") {
        showNotification("This email is already registered. Please login instead.", "error");
        router.push("/login");
        return;
      }
      showNotification(err.response?.data?.message || t("registerFail"), "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="ge-register">
      <div className="ge-register__split">
        {/* Left — WhatsApp */}
        <div className="ge-register__wa">
          <div className="ge-register__wa-header">
            <i className="fab fa-whatsapp"></i>
            <h3>{t("registerWithWhatsapp")}</h3>
          </div>
          <div className="ge-register__qr">
            <img src="/assets/whatsappQR.png" alt={t("whatsappQRAlt")} onError={(e) => { e.target.style.display = "none"; }} />
          </div>
          <ol className="ge-register__wa-steps">
            <li>{t("waStep1")}</li>
            <li>{t("waStep2")}</li>
            <li>{t("waStep3")}</li>
          </ol>
          <div className="ge-register__wa-perks">
            <span><i className="fas fa-bolt"></i> {t("waInstant")}</span>
            <span><i className="fas fa-bell"></i> {t("waNotif")}</span>
            <span><i className="fas fa-users"></i> {t("waCommunity")}</span>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="ge-register__divider-v">
          <span>OR</span>
        </div>

        {/* Right — Email/Google */}
        <div className="ge-register__email">
          {/* Google */}
          <div className="ge-register__google">
            <GoogleLoginButton />
          </div>

          <div className="auth-divider"><span>{t("or")}</span></div>

          {/* Email form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="firstName" placeholder={t("firstName")} value={form.firstName} onChange={handleChange} required />
                <i className="fas fa-user"></i>
              </div>
              <div className="form-group">
                <input type="text" name="lastName" placeholder={t("lastName")} value={form.lastName} onChange={handleChange} required />
                <i className="fas fa-user"></i>
              </div>
            </div>

            <div className="form-group">
              <input type="email" name="email" placeholder={t("email")} value={form.email} onChange={handleChange} required className={form.email && !isEmailValid(form.email) ? "invalid" : ""} />
              <i className="fas fa-envelope"></i>
            </div>

            <div className="form-group">
              <input type={showPwd ? "text" : "password"} name="password" placeholder={t("createPwd")} value={form.password} onChange={handleChange} required className={form.password && !isPasswordStrong(form.password) ? "invalid" : ""} />
              <i className="fas fa-lock"></i>
              <button type="button" className="password-toggle" onClick={() => setShowPwd(v => !v)}>
                <i className={`fas ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="form-group">
              <input type={showConfirmPwd ? "text" : "password"} name="confirmPassword" placeholder={t("confirmPwd")} value={form.confirmPassword} onChange={handleChange} required className={form.confirmPassword && !isPasswordMatch ? "invalid" : ""} />
              <i className="fas fa-lock"></i>
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPwd(v => !v)}>
                <i className={`fas ${showConfirmPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} required />
                {t("agreeMsg1")}{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setTermsModalOpen(true); }}>{t("termsLink")}</a>{" "}
                {t("agreeMsg2")}{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setPrivacyModalOpen(true); }}>{t("privacyLink")}</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> <span>{t("creatingAccount") || "Creating Account..."}</span></>
              ) : (
                <><i className="fas fa-user-plus"></i> <span>{t("createAccount")}</span></>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-switch">
        <p>
          {t("alreadyHaveAccount")}{" "}
          <button className="link-btn" type="button" onClick={() => router.push("/login")}>{t("signIn")}</button>
        </p>
      </div>

      <Modal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} title="Terms and Conditions" contentUrl="/content/terms-and-conditions.md" />
      <Modal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} title="Privacy Policy" contentUrl="/content/privacy-policy.md" />
    </div>
  );
};

export default Register;

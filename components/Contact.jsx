import React, { useState } from "react";
import { showNotification } from "./Notification";
import { useTranslations } from "next-intl";

const contactInfo = [
  { icon: "fab fa-whatsapp", titleKey: "whatsappTitle", content: "+91 92264 92263", href: "https://wa.me/919226492263", color: "#25D366" },
  { icon: "fas fa-phone", titleKey: "phoneTitle", content: "+91 92264 92263", href: "tel:+919226492263" },
  { icon: "fas fa-envelope", titleKey: "emailTitle", content: "contact@greeneye.foundation", href: "mailto:contact@greeneye.foundation" },
];

const Contact = () => {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, phone: form.phone, subject: form.subject, message: form.message })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send message');
      setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
      showNotification(t("successMessage") || "Message sent! We'll get back to you soon.", "success");
    } catch (error) {
      showNotification(error.message || t("errorMessage") || "Failed to send message.", "error");
    } finally { setLoading(false); }
  };

  return (
    <section className="ge-contact ge-section">
      <div className="ge-container">
        <div className="ge-contact__header">
          <span className="ge-overline">Get in Touch</span>
          <h1>We'd love to hear from you</h1>
          <p>Have questions about tree adoption, volunteering, or partnerships? Reach out.</p>
        </div>

        <div className="ge-contact__grid">
          {/* Left — Info */}
          <div className="ge-contact__info">
            <div className="ge-contact__cards">
              {contactInfo.map((item) => (
                <a key={item.titleKey} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="ge-contact__card">
                  <div className="ge-contact__card-icon" style={item.color ? { color: item.color } : {}}>
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h4>{t(item.titleKey)}</h4>
                    <span>{item.content}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Address */}
            <a href="https://maps.app.goo.gl/hc2w2LcDFF1Ax3QQ7" target="_blank" rel="noopener noreferrer" className="ge-contact__address">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>{t("locationTitle")}</h4>
                <span>G-4-2, Kanak Vrindavan, Indra Marg, Jaipur, Rajasthan 302024</span>
              </div>
            </a>

            {/* Social */}
            <div className="ge-contact__social">
              <h4>{t("followUs")}</h4>
              <div className="ge-contact__social-icons">
                <a href="https://www.facebook.com/greeneye.foundation" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="https://x.com/greeneye_org/" target="_blank" rel="noopener noreferrer" aria-label="X"><i className="fab fa-x-twitter"></i></a>
                <a href="https://www.instagram.com/greeneye.foundation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://www.linkedin.com/company/greeneye-foundation/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://www.youtube.com/@greeneye.foundation/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="ge-contact__form-wrap">
            <form className="ge-contact__form" onSubmit={handleSubmit}>
              <div className="ge-contact__row">
                <div className="ge-contact__field">
                  <label>{t("firstName")}</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
                </div>
                <div className="ge-contact__field">
                  <label>{t("lastName")}</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
                </div>
              </div>
              <div className="ge-contact__field">
                <label>{t("emailAddress")}</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>
              <div className="ge-contact__row">
                <div className="ge-contact__field">
                  <label>{t("phoneNumber")}</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="ge-contact__field">
                  <label>{t("selectSubject")}</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Select topic</option>
                    <option value="volunteer">{t("subjectVolunteer")}</option>
                    <option value="donation">{t("subjectDonation")}</option>
                    <option value="partnership">{t("subjectPartnership")}</option>
                    <option value="general">{t("subjectGeneral")}</option>
                    <option value="feedback">{t("subjectFeedback")}</option>
                  </select>
                </div>
              </div>
              <div className="ge-contact__field">
                <label>{t("yourMessage")}</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what's on your mind..." rows="5" required />
              </div>
              <button type="submit" className="ge-btn ge-btn-primary ge-btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> {t("sending")}</> : <><i className="fas fa-paper-plane"></i> {t("sendMessage")}</>}
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="ge-contact__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d259.99579073281694!2d75.70149211704879!3d26.912531353237583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4d9756a1d2b9%3A0x5c0e4e8e0e8b5d6!2sGREENEYE%E2%84%A2%20Nursery%20%26%20Sustainability%20Center!5e1!3m2!1sen!2sin!4v1772527909706!5m2!1sen!2sin"
            width="100%"
            height="360"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="GREENEYE Nursery & Sustainability Center"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;

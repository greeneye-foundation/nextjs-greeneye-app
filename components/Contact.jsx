import React, { useState, useEffect } from "react";
import { showNotification } from "./Notification";
import { useTranslations } from "next-intl";

const Contact = () => {
  const t = useTranslations("contact");

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("contactPageDarkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.querySelector(".contact")?.classList.add("dark-mode");
      document.querySelector(".page-header")?.classList.add("dark-mode");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("contactPageDarkMode", newMode.toString());
    document.querySelector(".contact")?.classList.toggle("dark-mode");
    document.querySelector(".page-header")?.classList.toggle("dark-mode");
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace this with actual API endpoint when backend is ready
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, this should send data to your contact API:
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, form);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      showNotification(
        t("successMessage", {
          defaultMessage: "Your message has been received! We will get back to you soon."
        }),
        "success"
      );
    } catch (error) {
      showNotification(
        t("errorMessage", {
          defaultMessage: "Failed to send message. Please try again or contact us directly."
        }),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        {/* Dark Mode Toggle */}
        <button
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <i className="fas fa-sun"></i>
          ) : (
            <i className="fas fa-moon"></i>
          )}
        </button>
        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon"><i className="fab fa-whatsapp"></i></div>
              <div className="contact-details">
                <h4>{t("whatsappTitle")}</h4>
                <p><a href="https://wa.me/919226492263" target="_blank" rel="noopener noreferrer">+91 92264 92263</a></p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-phone"></i></div>
              <div className="contact-details">
                <h4>{t("phoneTitle")}</h4>
                <p><a href="tel:+919226492263">+91 92264 92263</a></p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-details">
                <h4>{t("emailTitle")}</h4>
                <p><a href="mailto:contact@greeneye.foundation">contact@greeneye.foundation</a></p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="contact-details">
                <h4>{t("locationTitle")}</h4>
                <p>
                  <a
                    href="https://maps.app.goo.gl/hc2w2LcDFF1Ax3QQ7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    G-4-2, Kanak Vrindavan, Indra Marg<br />
                    Jaipur, 302024, Rajasthan, India
                  </a>
                </p>
              </div>
            </div>
            <div className="social-links">
              <h4>{t("followUs")}</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/greeneye.foundation/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://x.com/greeneye_org/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.instagram.com/greeneye.foundation/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/company/greeneye-foundation/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://www.youtube.com/@greeneye.foundation/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="contact-form-container">
            <h3>{t("formTitle")}</h3>
            <form className="contact-form" id="contactForm" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    id="contactName"
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
                    id="lastName"
                    name="lastName"
                    placeholder={t("lastName")}
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  placeholder={t("emailAddress")}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <i className="fas fa-envelope"></i>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  id="contactPhone"
                  name="phone"
                  placeholder={t("phoneNumber")}
                  value={form.phone}
                  onChange={handleChange}
                />
                <i className="fas fa-phone"></i>
              </div>
              <div className="form-group">
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("selectSubject")}</option>
                  <option value="volunteer">{t("subjectVolunteer")}</option>
                  <option value="donation">{t("subjectDonation")}</option>
                  <option value="partnership">{t("subjectPartnership")}</option>
                  <option value="general">{t("subjectGeneral")}</option>
                  <option value="feedback">{t("subjectFeedback")}</option>
                </select>
                <i className="fas fa-tag"></i>
              </div>
              <div className="form-group">
                <textarea
                  id="message"
                  name="message"
                  placeholder={t("yourMessage")}
                  rows="6"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <i className="fas fa-comment"></i>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> <span>{t("sending")}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> <span>{t("sendMessage")}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d259.99579073281694!2d75.70149211704879!3d26.912531353237583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4d9756a1d2b9%3A0x5c0e4e8e0e8b5d6!2sGREENEYE%E2%84%A2%20Nursery%20%26%20Sustainability%20Center!5e1!3m2!1sen!2sin!4v1772527909706!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="GREENEYE™ Nursery & Sustainability Center"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
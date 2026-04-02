import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { showNotification } from "@/components/Notification";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";

const cities = ["Jaipur", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Other"];
const availabilities = [
  { value: "weekends", labelKey: "weekends" }, { value: "weekdays", labelKey: "weekdays" },
  { value: "flexible", labelKey: "flexible" }, { value: "events", labelKey: "events" },
];
const sectors = ["Information Technology (IT)", "Banking & Finance", "Healthcare & Medical", "Education & Training", "Government & Public Sector", "Non-Profit / NGO", "Agriculture", "Retail & E-commerce", "Construction & Real Estate", "Legal & Law", "Arts & Media", "Travel & Hospitality", "Transportation & Logistics", "Manufacturing", "Telecommunications", "Research & Development", "Energy & Utilities", "Environment & Sustainability", "Defense & Security", "Automotive", "Entertainment & Film", "Sports & Fitness", "Marketing & Advertising", "Human Resources (HR)", "Aerospace & Aviation", "Fashion & Apparel", "Food & Beverages", "Social Work", "Freelance/Consulting", "Other"];
const professions = ["Business Owner / Entrepreneur", "Private Job", "Government Employee", "Freelancer", "Student", "Homemaker", "Retired", "Unemployed", "Teacher / Professor", "Doctor / Nurse", "Engineer", "Lawyer", "Artist / Designer", "Social Worker", "Volunteer (Full-time)", "Technician / Skilled Worker", "Manager / Executive", "Sales / Marketing Professional", "IT Professional", "Content Creator / Influencer", "Finance Professional (CA, Accountant, Banker)", "Researcher / Scientist", "Consultant", "Admin / Clerical", "Self-Employed", "Other"];

const Volunteer = () => {
  const t = useTranslations("volunteerForm");
  const { getAuthHeaders, isLoading: authLoading, isLoggedIn: ctxLoggedIn, token, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", availability: "", sector: "", profession: "", motivation: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!ctxLoggedIn) return;
    setIsLoggedIn(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setForm(f => ({ ...f, name: data.name || "", email: data.email || "", phone: data.phone || "" }));
        setIsVolunteer(data.is_volunteer === true);
      })
      .catch(() => setIsLoggedIn(false));
  }, [authLoading, ctxLoggedIn, token]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoggedIn) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/volunteer`,
          { city: form.city, availability: form.availability, sector: form.sector, profession: form.profession, why_do_you_want_to_join_us: form.motivation },
          { headers: getAuthHeaders() });
        setIsVolunteer(true);
        showNotification(t("notifVolunteerSuccess"), "success");
      } else {
        if (!form.password || form.password.length < 6) { showNotification(t("notifPasswordShort"), "error"); setLoading(false); return; }
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register-volunteer`,
          { name: form.name, email: form.email, phone: form.phone, password: form.password, city: form.city, availability: form.availability, sector: form.sector, profession: form.profession, why_do_you_want_to_join_us: form.motivation });
        if (data.token) { login(data, data.token); showNotification(t("notifRegisterSuccess"), "success"); router.push("/profile"); }
      }
    } catch (err) { showNotification(err.response?.data?.message || t("notifRegisterFail"), "error"); }
    setLoading(false);
  };

  return (
    <section className="ge-vol ge-section">
      <div className="ge-container">
        <div className="ge-vol__grid">
          {/* Image */}
          <div className="ge-vol__visual">
            <img src="/assets/Community_Volunteer.png" alt={t("volunteerImgAlt")} loading="lazy" />
            <div className="ge-vol__stats">
              <div className="ge-vol__stat"><strong>1,200+</strong><span>Active Volunteers</span></div>
              <div className="ge-vol__stat"><strong>25+</strong><span>Cities</span></div>
              <div className="ge-vol__stat"><strong>50K+</strong><span>Trees Planted</span></div>
            </div>
          </div>

          {/* Form */}
          <div className="ge-vol__form-wrap">
            {isVolunteer ? (
              <div className="ge-vol__success">
                <div className="ge-vol__success-icon"><i className="fas fa-check-circle"></i></div>
                <h3>{t("alreadyVolunteer")}</h3>
                <p>{t("thanksSupport")}</p>
                <p>{t("willContact")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="ge-vol__form">
                <h3>{t("registerTitle")}</h3>

                {/* Personal */}
                <div className="ge-vol__row">
                  <div className="ge-vol__field">
                    <label>{t("name")} *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required disabled={isLoggedIn} placeholder="Full name" />
                  </div>
                  <div className="ge-vol__field">
                    <label>{t("email")} *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required disabled={isLoggedIn} placeholder="Email" />
                  </div>
                </div>
                <div className="ge-vol__row">
                  <div className="ge-vol__field">
                    <label>{t("phone")} *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required disabled={isLoggedIn} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  {!isLoggedIn && (
                    <div className="ge-vol__field">
                      <label>{t("password")} *</label>
                      <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Create password" />
                    </div>
                  )}
                </div>

                {/* Volunteer details */}
                <div className="ge-vol__row">
                  <div className="ge-vol__field">
                    <label>{t("selectCity")} *</label>
                    <select name="city" value={form.city} onChange={handleChange} required>
                      <option value="">Select city</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="ge-vol__field">
                    <label>{t("availability")} *</label>
                    <select name="availability" value={form.availability} onChange={handleChange} required>
                      <option value="">Select availability</option>
                      {availabilities.map(a => <option key={a.value} value={a.value}>{t(`availabilityOptions.${a.labelKey}`)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="ge-vol__row">
                  <div className="ge-vol__field">
                    <label>{t("selectSector")} *</label>
                    <select name="sector" value={form.sector} onChange={handleChange} required>
                      <option value="">Select sector</option>
                      {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="ge-vol__field">
                    <label>{t("selectProfession")} *</label>
                    <select name="profession" value={form.profession} onChange={handleChange} required>
                      <option value="">Select profession</option>
                      {professions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="ge-vol__field">
                  <label>{t("motivation")}</label>
                  <textarea name="motivation" value={form.motivation} onChange={handleChange} rows={3} placeholder="Why do you want to volunteer with GreenEye?" />
                </div>

                <button type="submit" className="ge-btn ge-btn-primary ge-btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> {t("registering")}</> : <><i className="fas fa-hands-helping"></i> {t("registerBtn")}</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Volunteer;

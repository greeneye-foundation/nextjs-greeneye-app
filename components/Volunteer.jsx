import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { showNotification } from "@/components/Notification";
import { useTranslations } from "next-intl";

const cities = [
  "Jaipur", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Other"
];

const availabilities = [
  { value: "weekends", labelKey: "weekends" },
  { value: "weekdays", labelKey: "weekdays" },
  { value: "flexible", labelKey: "flexible" },
  { value: "events", labelKey: "events" },
];

const sectors = [
  "Information Technology (IT)",
  "Banking & Finance",
  "Healthcare & Medical",
  "Education & Training",
  "Government & Public Sector",
  "Non-Profit / NGO",
  "Agriculture",
  "Retail & E-commerce",
  "Construction & Real Estate",
  "Legal & Law",
  "Arts & Media",
  "Travel & Hospitality",
  "Transportation & Logistics",
  "Manufacturing",
  "Telecommunications",
  "Research & Development",
  "Energy & Utilities",
  "Environment & Sustainability",
  "Defense & Security",
  "Automotive",
  "Entertainment & Film",
  "Sports & Fitness",
  "Marketing & Advertising",
  "Human Resources (HR)",
  "Aerospace & Aviation",
  "Fashion & Apparel",
  "Food & Beverages",
  "Social Work",
  "Freelance/Consulting",
  "Other"
];

const professions = [
  "Business Owner / Entrepreneur",
  "Private Job",
  "Government Employee",
  "Freelancer",
  "Student",
  "Homemaker",
  "Retired",
  "Unemployed",
  "Teacher / Professor",
  "Doctor / Nurse",
  "Engineer",
  "Lawyer",
  "Artist / Designer",
  "Social Worker",
  "Volunteer (Full-time)",
  "Technician / Skilled Worker",
  "Manager / Executive",
  "Sales / Marketing Professional",
  "IT Professional",
  "Content Creator / Influencer",
  "Finance Professional (CA, Accountant, Banker)",
  "Researcher / Scientist",
  "Consultant",
  "Admin / Clerical",
  "Self-Employed",
  "Other"
];

const Volunteer = () => {
  const t = useTranslations("volunteerForm");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    availability: "",
    sector: "",
    profession: "",
    motivation: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const router = useRouter();

  // Safely check authToken in useEffect, not during render
  useEffect(() => {
    const fetchProfile = async () => {
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("authToken");
      }
      if (!token) return;

      setIsLoggedIn(true);

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm((f) => ({
          ...f,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        }));

        setIsVolunteer(data.is_volunteer === true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
    }

    try {
      if (isLoggedIn && token) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/volunteer`,
          {
            city: form.city,
            availability: form.availability,
            sector: form.sector,
            profession: form.profession,
            why_do_you_want_to_join_us: form.motivation,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsVolunteer(true);
        showNotification(t("notifVolunteerSuccess"), "success");
      } else {
        if (!form.password || form.password.length < 6) {
          showNotification(t("notifPasswordShort"), "error");
          setLoading(false);
          return;
        }

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register-volunteer`,
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            city: form.city,
            availability: form.availability,
            sector: form.sector,
            profession: form.profession,
            why_do_you_want_to_join_us: form.motivation,
          }
        );

        if (typeof window !== "undefined" && data.token) {
          localStorage.setItem("authToken", data.token);
          showNotification(t("notifRegisterSuccess"), "success");
          router.push("/profile");
        }

        setForm({
          name: "",
          email: "",
          phone: "",
          city: "",
          availability: "",
          sector: "",
          profession: "",
          motivation: "",
          password: "",
        });
      }
    } catch (err) {
      showNotification(err.response?.data?.message || t("notifRegisterFail"), "error");
    }

    setLoading(false);
  };

  return (
    <section className="volunteer">
      <div className="container">
        <div className="volunteer-content">
          <div className="volunteer-image">
            <img
              src="/assets/Community_Volunteer.png"
              alt={t("volunteerImgAlt")}
            />
          </div>
          <div className="volunteer-form-container">
            <h3>{t("registerTitle")}</h3>
            {isVolunteer ? (
              <div
                style={{
                  padding: "2rem",
                  color: "#388e3c",
                  background: "#e8f5e9",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  textAlign: "center"
                }}
              >
                <i className="fas fa-check-circle" style={{ fontSize: "2rem", color: "#388e3c" }}></i>
                <br />
                {t("alreadyVolunteer")}<br />
                {t("thanksSupport")}<br />
                {t("willContact")}
              </div>
            ) : (
              <form
                className="volunteer-form"
                id="volunteerForm"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t("name")}
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={isLoggedIn}
                  />
                  <i className="fas fa-user"></i>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("email")}
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={isLoggedIn}
                  />
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder={t("phone")}
                    value={form.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoggedIn}
                  />
                  <i className="fas fa-phone"></i>
                </div>
                {!isLoggedIn && (
                  <div className="form-group">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder={t("password")}
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <i className="fas fa-lock"></i>
                  </div>
                )}
                <div className="form-group">
                  <select
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("selectCity")}</option>
                    {cities.map((c) => (
                      <option key={c.toLowerCase()} value={c}>{c}</option>
                    ))}
                  </select>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="form-group">
                  <select
                    id="availability"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("availability")}</option>
                    {availabilities.map((a) => (
                      <option key={a.value} value={a.value}>
                        {t(`availabilityOptions.${a.labelKey}`)}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-calendar"></i>
                </div>
                <div className="form-group">
                  <select
                    id="sector"
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("selectSector")}</option>
                    {sectors.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="form-group">
                  <select
                    id="profession"
                    name="profession"
                    value={form.profession}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("selectProfession")}</option>
                    {professions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="form-group">
                  <textarea
                    id="motivation"
                    name="motivation"
                    placeholder={t("motivation")}
                    rows="4"
                    value={form.motivation}
                    onChange={handleChange}
                  />
                  <i className="fas fa-heart"></i>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> <span>{t("registering")}</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-hands-helping"></i> <span>{t("registerBtn")}</span>
                    </>
                  )}
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
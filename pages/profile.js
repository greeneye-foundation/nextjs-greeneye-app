import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ProfileTabs from '@/components/ProfileTabs';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { showNotification } from '@/components/Notification';
import Seo from '@/components/common/Seo';

const cities = ["Jaipur", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Other"];
const availabilities = [
  { value: "weekends", label: "Weekends Only" },
  { value: "weekdays", label: "Weekdays" },
  { value: "flexible", label: "Flexible" },
  { value: "events", label: "Events Only" },
];
const sectors = [
  "Information Technology (IT)", "Banking & Finance", "Healthcare & Medical", "Education & Training", "Government & Public Sector", "Non-Profit / NGO", "Agriculture", "Retail & E-commerce", "Construction & Real Estate", "Legal & Law", "Arts & Media", "Travel & Hospitality", "Transportation & Logistics", "Manufacturing", "Telecommunications", "Research & Development", "Energy & Utilities", "Environment & Sustainability", "Defense & Security", "Automotive", "Entertainment & Film", "Sports & Fitness", "Marketing & Advertising", "Human Resources (HR)", "Aerospace & Aviation", "Fashion & Apparel", "Food & Beverages", "Social Work", "Freelance/Consulting", "Other"
];
const professions = [
  "Business Owner / Entrepreneur", "Private Job", "Government Employee", "Freelancer", "Student", "Homemaker", "Retired", "Unemployed", "Teacher / Professor", "Doctor / Nurse", "Engineer", "Lawyer", "Artist / Designer", "Social Worker", "Volunteer (Full-time)", "Technician / Skilled Worker", "Manager / Executive", "Sales / Marketing Professional", "IT Professional", "Content Creator / Influencer", "Finance Professional (CA, Accountant, Banker)", "Researcher / Scientist", "Consultant", "Admin / Clerical", "Self-Employed", "Other"
];

export function getStaticProps({ locale }) {
  return { props: { messages: require(`../locales/${locale}.json`), locale } };
}

const Profile = () => {
  const { getAuthHeaders, isLoading: authLoading, isLoggedIn } = useAuth();
  const t = useTranslations('profilePage');
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [volEditData, setVolEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { router.push("/login?from=/profile"); return; }

    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
      headers: getAuthHeaders(),
    }).then((res) => {
      setUser(res.data);
      setEditData({
        name: res.data.name, email: res.data.email, phone: res.data.phone || "",
        address: {
          street: res.data.address?.street || "", city: res.data.address?.city || "",
          state: res.data.address?.state || "", pincode: res.data.address?.pincode || "",
        },
      });
      setVolEditData({
        city: res.data.volunteer?.city || "", availability: res.data.volunteer?.availability || "",
        sector: res.data.volunteer?.sector || "", profession: res.data.volunteer?.profession || "",
        why_do_you_want_to_join_us: res.data.volunteer?.why_do_you_want_to_join_us || "",
      });
      setLoading(false);
    }).catch(() => router.push("/login"));
  }, [authLoading, isLoggedIn]);

  const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });
  const handleAddressChange = (e) => setEditData(prev => ({ ...prev, address: { ...prev.address, [e.target.name]: e.target.value } }));
  const handleVolChange = (e) => setVolEditData({ ...volEditData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, editData,
        { headers: getAuthHeaders() }
      );
      let updatedUser = profileRes.data;
      if (user.is_volunteer) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/volunteer`, volEditData, { headers: getAuthHeaders() });
        const { data: refreshed } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, { headers: getAuthHeaders() });
        updatedUser = refreshed;
        setVolEditData({
          city: refreshed.volunteer?.city || "", availability: refreshed.volunteer?.availability || "",
          sector: refreshed.volunteer?.sector || "", profession: refreshed.volunteer?.profession || "",
          why_do_you_want_to_join_us: refreshed.volunteer?.why_do_you_want_to_join_us || "",
        });
      }
      setUser(updatedUser);
      setEditData({
        name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone || "",
        address: {
          street: updatedUser.address?.street || "", city: updatedUser.address?.city || "",
          state: updatedUser.address?.state || "", pincode: updatedUser.address?.pincode || "",
        },
      });
      setEditMode(false);
      showNotification(t("updateSuccess") || "Profile updated!", "success");
    } catch (e) {
      showNotification(e.response?.data?.message || t("updateError"), "error");
    }
    setSaving(false);
  };

  if (loading || authLoading) {
    return (
      <div className="ge-profile">
        <div className="ge-profile__container">
          <div className="ge-profile__loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo noindex title="Profile | GreenEye" />
      <section className="ge-profile">
        <div className="ge-profile__container">
          <ProfileTabs />

          {/* Profile header */}
          <div className="ge-profile__header">
            <div className="ge-profile__avatar">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ge-profile__intro">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              {user.is_volunteer && (
                <span className="ge-badge ge-badge-green">
                  <i className="fas fa-hand-holding-heart"></i> Volunteer
                </span>
              )}
            </div>
            {!editMode ? (
              <button className="ge-profile__edit-btn" onClick={() => setEditMode(true)}>
                <i className="fas fa-pen"></i> {t("editInfo")}
              </button>
            ) : (
              <div className="ge-profile__edit-actions">
                <button className="ge-profile__save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> {t("saving")}</> : <><i className="fas fa-check"></i> {t("save")}</>}
                </button>
                <button className="ge-profile__cancel-btn" onClick={() => setEditMode(false)}>
                  {t("cancel")}
                </button>
              </div>
            )}
          </div>

          {/* Personal info */}
          <div className="ge-profile__section">
            <h3><i className="fas fa-user"></i> Personal Information</h3>
            <div className="ge-profile__grid">
              <div className="ge-profile__field">
                <label>{t("name")}</label>
                <input type="text" name="name" value={editMode ? editData.name : user.name} disabled={!editMode} onChange={handleChange} />
              </div>
              <div className="ge-profile__field">
                <label>{t("email")}</label>
                <input type="email" name="email" value={editMode ? editData.email : user.email} disabled={!editMode} onChange={handleChange} />
              </div>
              <div className="ge-profile__field">
                <label>{t("phone")}</label>
                <input type="text" name="phone" value={editMode ? editData.phone : user.phone || ""} disabled={!editMode} onChange={handleChange} placeholder={editMode ? "+91XXXXXXXXXX" : ""} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="ge-profile__section">
            <h3><i className="fas fa-map-marker-alt"></i> Address</h3>
            <div className="ge-profile__grid">
              <div className="ge-profile__field ge-profile__field--full">
                <label>{t("street")}</label>
                <input type="text" name="street" value={editMode ? editData.address?.street : user.address?.street || ""} disabled={!editMode} onChange={handleAddressChange} />
              </div>
              <div className="ge-profile__field">
                <label>{t("city")}</label>
                <input type="text" name="city" value={editMode ? editData.address?.city : user.address?.city || ""} disabled={!editMode} onChange={handleAddressChange} />
              </div>
              <div className="ge-profile__field">
                <label>{t("state")}</label>
                <input type="text" name="state" value={editMode ? editData.address?.state : user.address?.state || ""} disabled={!editMode} onChange={handleAddressChange} />
              </div>
              <div className="ge-profile__field">
                <label>{t("pincode")}</label>
                <input type="text" name="pincode" value={editMode ? editData.address?.pincode : user.address?.pincode || ""} disabled={!editMode} onChange={handleAddressChange} />
              </div>
            </div>
          </div>

          {/* Volunteer details */}
          {user.is_volunteer && (
            <div className="ge-profile__section ge-profile__section--volunteer">
              <h3><i className="fas fa-hand-holding-heart"></i> {t("volunteerDetails")}</h3>
              <div className="ge-profile__grid">
                <div className="ge-profile__field">
                  <label>{t("city")}</label>
                  <select name="city" value={editMode ? volEditData.city : user.volunteer?.city || ""} disabled={!editMode} onChange={handleVolChange}>
                    <option value="">{t("selectCity")}</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="ge-profile__field">
                  <label>{t("availability")}</label>
                  <select name="availability" value={editMode ? volEditData.availability : user.volunteer?.availability || ""} disabled={!editMode} onChange={handleVolChange}>
                    <option value="">{t("select")}</option>
                    {availabilities.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div className="ge-profile__field">
                  <label>{t("sector")}</label>
                  <select name="sector" value={editMode ? volEditData.sector : user.volunteer?.sector || ""} disabled={!editMode} onChange={handleVolChange}>
                    <option value="">{t("select")}</option>
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="ge-profile__field">
                  <label>{t("profession")}</label>
                  <select name="profession" value={editMode ? volEditData.profession : user.volunteer?.profession || ""} disabled={!editMode} onChange={handleVolChange}>
                    <option value="">{t("select")}</option>
                    {professions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="ge-profile__field ge-profile__field--full">
                  <label>{t("motivation")}</label>
                  <textarea name="why_do_you_want_to_join_us" rows={3} value={editMode ? volEditData.why_do_you_want_to_join_us : user.volunteer?.why_do_you_want_to_join_us || ""} disabled={!editMode} onChange={handleVolChange} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Profile;

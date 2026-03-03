//'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import ProfileTabs from '@/components/ProfileTabs';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
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
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  };
}

const Profile = () => {
  const { getAuthHeaders } = useAuth();
  const t = useTranslations('profilePage');
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [volEditData, setVolEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Check if phone is editable
  const isPhoneEditable = () => {
    // Phone is always editable for all users (both normal and Google users)
    return true;
  };

  useEffect(() => {
    if (!getAuthHeaders().Authorization) {
      router.push("/login");
      return;
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        setUser(res.data);
        setEditData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || "",
          address: {
            street: res.data.address?.street || "",
            city: res.data.address?.city || "",
            state: res.data.address?.state || "",
            pincode: res.data.address?.pincode || "",
          },
        });
        setVolEditData({
          city: res.data.volunteer?.city || "",
          availability: res.data.volunteer?.availability || "",
          sector: res.data.volunteer?.sector || "",
          profession: res.data.volunteer?.profession || "",
          why_do_you_want_to_join_us: res.data.volunteer?.why_do_you_want_to_join_us || "",
        });
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleAddressChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleVolChange = (e) => setVolEditData({ ...volEditData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
        editData,
        { headers: getAuthHeaders() }
      );
      let updatedUser = profileRes.data;

      if (user.is_volunteer) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/volunteer`,
          volEditData,
          { headers: getAuthHeaders() }
        );
        const { data: refreshed } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: getAuthHeaders() }
        );
        updatedUser = refreshed;
        setVolEditData({
          city: refreshed.volunteer?.city || "",
          availability: refreshed.volunteer?.availability || "",
          sector: refreshed.volunteer?.sector || "",
          profession: refreshed.volunteer?.profession || "",
          why_do_you_want_to_join_us: refreshed.volunteer?.why_do_you_want_to_join_us || "",
        });
      }

      setUser(updatedUser);
      setEditData({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        address: {
          street: updatedUser.address?.street || "",
          city: updatedUser.address?.city || "",
          state: updatedUser.address?.state || "",
          pincode: updatedUser.address?.pincode || "",
        },
      });
      setEditMode(false);
      alert(t("updateSuccess") || "Profile updated successfully!");
    } catch (e) {
      alert(e.response?.data?.message || t("updateError"));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "3rem 0" }}>
        <div className="auth-card">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin fa-2x"></i>
            <p>{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  const phoneEditable = isPhoneEditable();

  return (
    <>
    <Seo noindex title="Profile | GREENEYE" />
    <section className="profile-page">
      <div className="container" style={{ maxWidth: 600, marginTop: 2 }}>
        <ProfileTabs />
        <div className="auth-card" style={{ minHeight: 350 }}>
          <div className="auth-header">
            <h2><i className="fas fa-user-circle"></i> {t("profile")}</h2>
            <p>{t("welcome")}, <b>{user.name}</b></p>
          </div>
          <div style={{ margin: "2rem 0" }}>
            <div className="form-group">
              <label>{t("name")}</label>
              <input 
                type="text" 
                name="name" 
                value={editMode ? editData.name : user.name} 
                disabled={!editMode} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>{t("email")}</label>
              <input 
                type="email" 
                name="email" 
                value={editMode ? editData.email : user.email} 
                disabled={!editMode} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>
                {t("phone")}
                {editMode && (
                  <span style={{ fontSize: '0.85em', color: '#1976d2', marginLeft: '8px' }}>
                    (Optional - Can be updated anytime)
                  </span>
                )}
              </label>
              <input
                type="text"
                name="phone"
                value={editMode ? editData.phone : user.phone || ""}
                disabled={!editMode}
                onChange={handleChange}
                placeholder={editMode ? "+91XXXXXXXXXX" : ""}
                style={{
                  background: !editMode ? "#f7f7f7" : "#fff",
                  cursor: !editMode ? "not-allowed" : "text"
                }}
              />
            </div>
            <div className="form-group">
              <label>{t("street")}</label>
              <input 
                type="text" 
                name="street" 
                value={editMode ? editData.address?.street : user.address?.street || ""} 
                disabled={!editMode} 
                onChange={handleAddressChange} 
              />
            </div>
            <div className="form-group">
              <label>{t("city")}</label>
              <input 
                type="text" 
                name="city" 
                value={editMode ? editData.address?.city : user.address?.city || ""} 
                disabled={!editMode} 
                onChange={handleAddressChange} 
              />
            </div>
            <div className="form-group">
              <label>{t("state")}</label>
              <input 
                type="text" 
                name="state" 
                value={editMode ? editData.address?.state : user.address?.state || ""} 
                disabled={!editMode} 
                onChange={handleAddressChange} 
              />
            </div>
            <div className="form-group">
              <label>{t("pincode")}</label>
              <input 
                type="text" 
                name="pincode" 
                value={editMode ? editData.address?.pincode : user.address?.pincode || ""} 
                disabled={!editMode} 
                onChange={handleAddressChange} 
              />
            </div>
            {user.is_volunteer && (
              <div style={{ marginTop: 24, background: "#f8f9fc", border: "1px solid #e0e7ef", borderRadius: 8, padding: "18px 18px 8px 18px" }}>
                <div style={{ fontWeight: 600, color: "#1976d2", marginBottom: 10 }}>{t("volunteerDetails")}</div>
                <div className="form-group">
                  <label>{t("city")}</label>
                  <select 
                    name="city" 
                    value={editMode ? volEditData.city : user.volunteer?.city || ""} 
                    disabled={!editMode} 
                    onChange={handleVolChange}
                  >
                    <option value="">{t("selectCity")}</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("availability")}</label>
                  <select 
                    name="availability" 
                    value={editMode ? volEditData.availability : user.volunteer?.availability || ""} 
                    disabled={!editMode} 
                    onChange={handleVolChange}
                  >
                    <option value="">{t("select")}</option>
                    {availabilities.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("sector")}</label>
                  <select 
                    name="sector" 
                    value={editMode ? volEditData.sector : user.volunteer?.sector || ""} 
                    disabled={!editMode} 
                    onChange={handleVolChange}
                  >
                    <option value="">{t("select")}</option>
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("profession")}</label>
                  <select 
                    name="profession" 
                    value={editMode ? volEditData.profession : user.volunteer?.profession || ""} 
                    disabled={!editMode} 
                    onChange={handleVolChange}
                  >
                    <option value="">{t("select")}</option>
                    {professions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("motivation")}</label>
                  <textarea 
                    name="why_do_you_want_to_join_us" 
                    rows={3} 
                    value={editMode ? volEditData.why_do_you_want_to_join_us : user.volunteer?.why_do_you_want_to_join_us || ""} 
                    disabled={!editMode} 
                    onChange={handleVolChange} 
                  />
                </div>
              </div>
            )}
            {!editMode ? (
              <button 
                style={{ 
                  marginTop: 18, 
                  background: "#388e3c", 
                  color: "#fff", 
                  border: 0, 
                  borderRadius: 5, 
                  padding: "10px 24px", 
                  fontWeight: 600, 
                  cursor: "pointer" 
                }} 
                onClick={() => setEditMode(true)}
              >
                {t("editInfo")}
              </button>
            ) : (
              <div style={{ marginTop: 18 }}>
                <button 
                  style={{ 
                    background: "#388e3c", 
                    color: "#fff", 
                    border: 0, 
                    borderRadius: 5, 
                    padding: "10px 24px", 
                    fontWeight: 600, 
                    cursor: "pointer", 
                    marginRight: 10 
                  }} 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  {saving ? t("saving") : t("save")}
                </button>
                <button 
                  style={{ 
                    background: "#bbb", 
                    color: "#fff", 
                    border: 0, 
                    borderRadius: 5, 
                    padding: "10px 18px", 
                    fontWeight: 500, 
                    cursor: "pointer" 
                  }} 
                  onClick={() => setEditMode(false)}
                >
                  {t("cancel")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Profile;
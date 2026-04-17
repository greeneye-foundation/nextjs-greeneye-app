import React, { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "@/components/Notification";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import PhoneInput from "@/components/common/PhoneInput";

const presetAmounts = [100, 500, 1000, 5000];

const breakdowns = [
  { amount: '100', icon: 'fas fa-seedling' },
  { amount: '500', icon: 'fas fa-tree' },
  { amount: '1,000', icon: 'fas fa-leaf' },
  { amount: '5,000', icon: 'fas fa-globe-asia' },
];

const Donate = () => {
  const { getAuthHeaders } = useAuth();
  const [amount, setAmount] = useState("");
  const [activeBtn, setActiveBtn] = useState(null);
  const [form, setForm] = useState({ donorName: "", donorEmail: "", donorPhone: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("donate");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!getAuthHeaders().Authorization) return;
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: getAuthHeaders() }
        );
        setForm((f) => ({ ...f, donorName: data.name || "", donorEmail: data.email || "", donorPhone: data.phone || "" }));
      } catch (error) { /* ignore */ }
    };
    fetchProfile();
  }, []);

  const handleAmountBtn = (amt, idx) => { setAmount(amt.toString()); setActiveBtn(idx); };
  const handleAmountChange = (e) => { setAmount(e.target.value); setActiveBtn(null); };
  const handleChange = (e) => { const { name, value } = e.target; setForm((f) => ({ ...f, [name]: value })); };

  const initiatePayUPayment = (payuData) => {
    if (!payuData.key || !payuData.txnid || !payuData.hash) {
      showNotification('Payment initialization failed', 'error');
      setLoading(false);
      return;
    }
    const payuForm = document.createElement('form');
    payuForm.setAttribute('method', 'POST');
    payuForm.setAttribute('action', process.env.NEXT_PUBLIC_PAYU_URL || 'https://test.payu.in/_payment');
    const params = {
      key: payuData.key, txnid: payuData.txnid, amount: String(payuData.amount),
      productinfo: payuData.productinfo, firstname: payuData.firstname, email: payuData.email,
      phone: payuData.phone || '', udf1: payuData.udf1, udf2: payuData.udf2,
      udf3: payuData.udf3 || '', udf4: payuData.udf4 || '', udf5: payuData.udf5 || '',
      surl: payuData.surl, furl: payuData.furl, hash: payuData.hash
    };
    Object.entries(params).forEach(([key, val]) => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = key; input.value = val;
      payuForm.appendChild(input);
    });
    document.body.appendChild(payuForm);
    payuForm.submit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseInt(amount, 10) < 1) {
      showNotification(t("minAmountError") || "Please enter a minimum donation amount of ₹1.", "error");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/create`,
        { donorName: form.donorName, donorEmail: form.donorEmail, donorPhone: form.donorPhone, amount: parseInt(amount, 10) }
      );
      if (!data.success || !data.payuData) { showNotification('Failed to create donation', 'error'); setLoading(false); return; }
      setTimeout(() => initiatePayUPayment(data.payuData), 100);
    } catch (err) {
      showNotification(t("donationFail") || "Donation failed. Please try again later.", "error");
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="ge-donate ge-section ge-section-alt">
      <div className="ge-container">
        <div className="ge-donate__grid">
          {/* Info side */}
          <div className="ge-donate__info">
            <span className="ge-overline">Make a Difference</span>
            <h2>{t("impactTitle")}</h2>
            <hr className="ge-divider" />

            <div className="ge-donate__breakdown">
              {breakdowns.map((b, i) => (
                <div key={i} className="ge-donate__tier">
                  <div className="ge-donate__tier-icon">
                    <i className={b.icon}></i>
                  </div>
                  <div>
                    <div className="ge-donate__tier-amount">₹{b.amount}</div>
                    <div className="ge-donate__tier-desc">{t(`breakdown${presetAmounts[i]}`)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="ge-donate__form-wrap">
            <div className="ge-card ge-card-elevated ge-donate__card">
              <h3>{t("formTitle")}</h3>

              <div className="ge-donate__presets">
                {presetAmounts.map((amt, idx) => (
                  <button
                    key={amt}
                    type="button"
                    className={`ge-donate__preset${activeBtn === idx ? " ge-donate__preset--active" : ""}`}
                    onClick={() => handleAmountBtn(amt, idx)}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="ge-donate__field">
                  <i className="fas fa-rupee-sign"></i>
                  <input
                    type="number"
                    className="ge-input"
                    placeholder={t("placeholderAmount")}
                    min="10"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                  />
                </div>
                <div className="ge-donate__field">
                  <i className="fas fa-user"></i>
                  <input type="text" className="ge-input" name="donorName" placeholder={t("placeholderName")} value={form.donorName} onChange={handleChange} required />
                </div>
                <div className="ge-donate__field">
                  <i className="fas fa-envelope"></i>
                  <input type="email" className="ge-input" name="donorEmail" placeholder={t("placeholderEmail")} value={form.donorEmail} onChange={handleChange} required />
                </div>
                <div className="ge-donate__field">
                  <PhoneInput name="donorPhone" value={form.donorPhone} onChange={handleChange} required placeholder="XXXXX XXXXX" />
                </div>

                <button type="submit" className="ge-btn ge-btn-gold ge-btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> {t("processing")}</>
                  ) : (
                    <><i className="fas fa-heart"></i> {t("donateNow")}</>
                  )}
                </button>
              </form>

              <p className="ge-donate__note">
                <i className="fas fa-shield-alt"></i> {t("note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;

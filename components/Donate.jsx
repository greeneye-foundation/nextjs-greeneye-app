import React, { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "@/components/Notification";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";

const presetAmounts = [100, 500, 1000, 5000];

const Donate = () => {
  const { getAuthHeaders } = useAuth();
  const [amount, setAmount] = useState("");
  const [activeBtn, setActiveBtn] = useState(null);
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("donate");

  // Auto-fill profile info if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      if (!getAuthHeaders().Authorization) return;

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: getAuthHeaders() }
        );

        setForm((f) => ({
          ...f,
          donorName: data.name || "",
          donorEmail: data.email || "",
          donorPhone: data.phone || "",
        }));
      } catch (error) {
        // ignore
      }
    };

    fetchProfile();
  }, []);

  const handleAmountBtn = (amt, idx) => {
    setAmount(amt.toString());
    setActiveBtn(idx);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setActiveBtn(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // PayU Payment Integration
  const initiatePayUPayment = (payuData, donationId) => {
    
    if (!payuData.key || !payuData.txnid || !payuData.hash) {
      console.error('Missing required PayU fields:', payuData);
      showNotification('Payment initialization failed', 'error');
      setLoading(false);
      return;
    }

    const payuForm = document.createElement('form');
    payuForm.setAttribute('method', 'POST');
    
    const payuUrl = process.env.NEXT_PUBLIC_PAYU_URL || 'https://test.payu.in/_payment';
    payuForm.setAttribute('action', payuUrl);

    const params = {
      key: payuData.key,
      txnid: payuData.txnid,
      amount: String(payuData.amount),
      productinfo: payuData.productinfo,
      firstname: payuData.firstname,
      email: payuData.email,
      phone: payuData.phone || '',
      udf1: payuData.udf1,
      udf2: payuData.udf2,
      udf3: payuData.udf3 || '',
      udf4: payuData.udf4 || '',
      udf5: payuData.udf5 || '',
      surl: payuData.surl,
      furl: payuData.furl,
      hash: payuData.hash
    };

    Object.keys(params).forEach(key => {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', params[key]);
      payuForm.appendChild(input);
    });

    document.body.appendChild(payuForm);
    payuForm.submit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseInt(amount, 10) < 10) {
      showNotification(
        t("minAmountError", { defaultMessage: "Please enter a minimum donation amount of ₹50." }),
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/create`,
        {
          donorName: form.donorName,
          donorEmail: form.donorEmail,
          donorPhone: form.donorPhone,
          amount: parseInt(amount, 10),
        }
      );

      if (!data.success || !data.payuData) {
        showNotification('Failed to create donation', 'error');
        setLoading(false);
        return;
      }

      // Initiate PayU payment
      setTimeout(() => {
        initiatePayUPayment(data.payuData, data.donationRefId);
      }, 100);

    } catch (err) {
      console.error('Donation error:', err);
      showNotification(
        t("donationFail", { defaultMessage: "Donation failed. Please try again later." }),
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="donate">
      <div className="container">
        <div className="donation-content">
          <div className="donation-info">
            <h3>{t("impactTitle")}</h3>
            <div className="donation-breakdown">
              <div className="breakdown-item">
                <div className="amount">₹100</div>
                <div className="description">{t("breakdown100")}</div>
              </div>
              <div className="breakdown-item">
                <div className="amount">₹500</div>
                <div className="description">{t("breakdown500")}</div>
              </div>
              <div className="breakdown-item">
                <div className="amount">₹1000</div>
                <div className="description">{t("breakdown1000")}</div>
              </div>
              <div className="breakdown-item">
                <div className="amount">₹5000</div>
                <div className="description">{t("breakdown5000")}</div>
              </div>
            </div>
          </div>
          <div className="donation-form-container">
            <h3>{t("formTitle")}</h3>
            <div className="donation-amounts">
              {presetAmounts.map((amt, idx) => (
                <button
                  key={amt}
                  className={`amount-btn${activeBtn === idx ? " active" : ""}`}
                  type="button"
                  onClick={() => handleAmountBtn(amt, idx)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <form className="donation-form" id="donationForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="number"
                  id="customAmount"
                  name="amount"
                  placeholder={t("placeholderAmount")}
                  min="10"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                />
                <i className="fas fa-rupee-sign"></i>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="donorName"
                  name="donorName"
                  placeholder={t("placeholderName")}
                  value={form.donorName}
                  onChange={handleChange}
                  required
                />
                <i className="fas fa-user"></i>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="donorEmail"
                  name="donorEmail"
                  placeholder={t("placeholderEmail")}
                  value={form.donorEmail}
                  onChange={handleChange}
                  required
                />
                <i className="fas fa-envelope"></i>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  id="donorPhone"
                  name="donorPhone"
                  placeholder={t("placeholderPhone")}
                  value={form.donorPhone}
                  onChange={handleChange}
                  required
                />
                <i className="fas fa-phone"></i>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> <span>{t("processing")}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-heart"></i> <span>{t("donateNow")}</span>
                  </>
                )}
              </button>
            </form>
            <p className="donation-note">
              <i className="fas fa-shield-alt"></i>
              {t("note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;

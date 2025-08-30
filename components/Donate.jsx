import React, { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "@/components/Notification";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

const presetAmounts = [100, 500, 1000, 5000];

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [activeBtn, setActiveBtn] = useState(null);
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const t = useTranslations("donate");

  // Auto-fill profile info if logged in (safe for SSR)
  useEffect(() => {
    const fetchProfile = async () => {
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("authToken");
      }
      if (!token) return;

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseInt(amount, 10) < 50) {
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

      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: t("razorpayTitle", { defaultMessage: "GreenEye Donation" }),
          description: t("razorpayDesc", { defaultMessage: "Thank you for your support!" }),
          order_id: data.orderId,
          handler: async function (response) {
            setSuccess(t("paymentProcessing"));
            setAmount("");
            setForm({ donorName: "", donorEmail: "", donorPhone: "" });
            setActiveBtn(null);
            router.push("/mydonation");
          },
          prefill: {
            name: form.donorName,
            email: form.donorEmail,
            contact: form.donorPhone,
          },
          theme: { color: "#4CAF50" },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        showNotification(
          t("donationFail", { defaultMessage: "Donation failed. Please try again later." }),
          "error"
        );
      }
    } catch (err) {
      showNotification(
        t("donationFail", { defaultMessage: "Donation failed. Please try again later." }),
        "error"
      );
    } finally {
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
                  min="50"
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
                    <i className="fas fa-spinner fa-spin"></i> {t("processing")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-heart"></i> {t("donateNow")}
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
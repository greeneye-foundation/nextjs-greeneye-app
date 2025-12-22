import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Checkout = () => {
  const t = useTranslations("checkout");
  const [cart, setCart] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Coupon States
  const [couponBoxOpen, setCouponBoxOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Read token once and reuse across all fetch functions
    const token = localStorage.getItem("authToken");

    const fetchCart = async () => {
      setError("");
      try {
        if (!token) {
          setError(t("loginRequired"));
          return;
        }
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(res.data);
      } catch (err) {
        setError(err.response?.data?.message || t("fetchCartError"));
      }
    };

    const fetchUserInfo = async () => {
      try {
        if (!token) return;

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, email, phone, address } = res.data;
        setUserInfo((prev) => ({
          ...prev,
          name,
          email,
          phone: phone || "",
          street: address?.street || "",
          city: address?.city || "",
          state: address?.state || "",
          pincode: address?.pincode || "",
        }));
      } catch (error) {
        // Failed to fetch user info - user can still fill form manually
      }
    };

    // ✅ Fetch available coupons
    const fetchCoupons = async () => {
      try {
        if (!token) return;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableCoupons(res.data);
      } catch (err) {
        // Failed to fetch coupons - user can still checkout without coupon
      }
    };

    fetchCart();
    fetchUserInfo();
    fetchCoupons();
  }, [t]);

  const total =
    cart?.items.reduce((sum, item) => sum + item.plant.price * item.quantity, 0) || 0;

  useEffect(() => {
    setFinalAmount(total - discount);
  }, [total, discount]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, email, phone, street, city, state, pincode } = userInfo;
    if (!name || !email || !phone || !street || !city || !state || !pincode)
      return t("fillAllFields");
    if (!/^\d{10}$/.test(phone)) return t("invalidPhone");
    if (!/\S+@\S+\.\S+/.test(email)) return t("invalidEmail");
    if (!/^\d{6}$/.test(pincode)) return t("invalidPincode");
    if (!cart || !cart.items || cart.items.length === 0) return t("cartEmpty");
    return "";
  };

  // ✅ Apply Coupon
  const handleApplyCoupon = async () => {
    setError("");
    setSuccess("");

    if (!couponCode.trim()) {
      setError(t("enterCouponCode") || "Please enter a coupon code");
      return;
    }

    if (appliedCouponCode) {
      setError(t("couponAlreadyApplied") || "A coupon is already applied. Remove it to apply a different one.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(t("loginRequired"));
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/apply`,
        { code: couponCode, orderAmount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiscount(res.data.discount);
      setFinalAmount(res.data.finalAmount);
      setAppliedCouponCode(couponCode);
      setSuccess(`Coupon applied! You saved ₹${res.data.discount}`);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid coupon");
    }
  };

  // ✅ Remove Coupon
  const handleRemoveCoupon = () => {
    setDiscount(0);
    setFinalAmount(0);
    setCouponCode("");
    setAppliedCouponCode(null);
    setSuccess(t("couponRemoved") || "Coupon removed");
  };

  // PayU Payment Integration
  const initiatePayUPayment = (payuData, orderId) => {
    if (!payuData.key || !payuData.txnid || !payuData.hash) {
      console.error('Missing required PayU fields:', payuData);
      setError('Payment initialization failed');
      setPlacing(false);
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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationMsg = validate();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    setPlacing(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(t("loginRequired"));
        setPlacing(false);
        return;
      }

      const orderItems = cart.items.map((item) => ({
        plant: item.plant._id,
        quantity: item.quantity,
      }));

      const shippingAddress = {
        name: userInfo.name,
        street: userInfo.street,
        city: userInfo.city,
        state: userInfo.state,
        pincode: userInfo.pincode,
        phone: userInfo.phone,
      };

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        couponCode: couponCode || null, // ✅ send couponCode
      };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdOrder = res.data;

      // 🚀 PayU Checkout if PayU selected
      if (paymentMethod === "PAYU") {
        if (!createdOrder.payuData) {
          setError("Payment initialization failed");
          setPlacing(false);
          return;
        }

        // Initiate PayU payment
        setTimeout(() => {
          initiatePayUPayment(createdOrder.payuData, createdOrder._id);
        }, 100);
      } else {
        setSuccess(t("orderPlacedCOD"));
        setCart(null);
        router.push("/myorders");
      }
    } catch (err) {
      setError(err.response?.data?.message || t("placeOrderFail"));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-container">
      <Link href="/plantshop" className="checkout-back-link">
        ← Back to Plant Shop
      </Link>

      <div className="checkout-card">
        <div className="checkout-header">
          <h1 className="checkout-title">{t("checkoutTitle")}</h1>
          <p className="checkout-subtitle">Complete your order securely</p>
        </div>

        <form onSubmit={handlePlaceOrder} autoComplete="off" className="checkout-form">
          <div className="checkout-section">
            <h3 className="section-title">Shipping Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {t("name")}<span className="required">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  value={userInfo.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("email")}<span className="required">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {t("phone")}<span className="required">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={userInfo.phone}
                  onChange={handleChange}
                  required
                  pattern="\d{10}"
                  maxLength={10}
                  className="form-input"
                  placeholder="10-digit phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("pincode")}<span className="required">*</span>
                </label>
                <input
                  name="pincode"
                  type="text"
                  value={userInfo.pincode}
                  onChange={handleChange}
                  required
                  pattern="\d{6}"
                  maxLength={6}
                  className="form-input"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t("shippingAddress")}<span className="required">*</span>
              </label>
              <textarea
                name="street"
                value={userInfo.street}
                onChange={handleChange}
                required
                className="form-textarea"
                placeholder="Enter your complete street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {t("city")}<span className="required">*</span>
                </label>
                <input
                  name="city"
                  type="text"
                  value={userInfo.city}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("state")}<span className="required">*</span>
                </label>
                <input
                  name="state"
                  type="text"
                  value={userInfo.state}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="checkout-section coupon-section">
            <button
              type="button"
              onClick={() => setCouponBoxOpen(!couponBoxOpen)}
              className="coupon-toggle-btn"
            >
              {couponBoxOpen ? "✕ Hide Coupon" : "🎟️ Apply Coupon"}
            </button>

            {couponBoxOpen && (
              <div className="coupon-box">
                <div className="coupon-input-group">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="coupon-input"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!!appliedCouponCode}
                    className="coupon-apply-btn"
                  >
                    {appliedCouponCode ? "✓ Applied" : "Apply"}
                  </button>
                  {appliedCouponCode && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="coupon-remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {availableCoupons.length > 0 && (
                  <div className="available-coupons">
                    <div className="available-coupons-title">Available Coupons:</div>
                    <ul className="coupon-list">
                      {availableCoupons.map((c) => (
                        <li
                          key={c._id}
                          className="coupon-item"
                          onClick={() => setCouponCode(c.code)}
                        >
                          <span className="coupon-code">{c.code}</span>
                          <span className="coupon-discount">
                            {c.discountType === "percentage"
                              ? `${c.discountValue}% OFF`
                              : `₹${c.discountValue} OFF`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="checkout-section">
            <h3 className="section-title">Payment Method</h3>
            <div className="payment-methods">
              {["COD", "PAYU"].map((method) => (
                <div key={method} className="payment-option">
                  <input
                    type="radio"
                    id={`payment-${method}`}
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <label htmlFor={`payment-${method}`} className="payment-label">
                    {method === "COD" ? t("cod") : t("onlinePayment")}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="order-summary">
            <h3 className="order-summary-title">{t("orderSummary")}</h3>

            {cart && cart.items?.length > 0 ? (
              <ul className="order-items">
                {cart.items.map((item) => (
                  <li key={item._id} className="order-item">
                    <div>
                      <span className="item-name">{item.plant.name}</span>
                      <span className="item-quantity">×{item.quantity}</span>
                    </div>
                    <span className="item-price">₹{item.plant.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-cart-message">{t("cartNoItems")}</div>
            )}

            {discount > 0 && (
              <div className="order-discount">
                <span>Discount Applied:</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="order-total">
              <span>{t("total")}:</span>
              <span>₹{finalAmount || total}</span>
            </div>
          </div>

          {error && <div className="message message-error">{error}</div>}
          {success && <div className="message message-success">{success}</div>}

          <button
            type="submit"
            disabled={placing || !cart?.items?.length}
            className="submit-btn"
          >
            {placing ? t("placingOrder") : t("placeOrder")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { showNotification } from "@/components/Notification";

const Checkout = () => {
  const { getAuthHeaders, isLoading: authLoading, isLoggedIn, token } = useAuth();
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
    if (authLoading) return;
    if (!isLoggedIn) { setError(t("loginRequired")); return; }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchCart = async () => {
      setError("");
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
          headers,
        });
        setCart(res.data);
      } catch (err) {
        const msg = err.response?.data?.message || t("fetchCartError");
        setError(msg);
        showNotification(msg, 'error', {
          onRetry: () => fetchCart()
        });
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
          headers,
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
        // Non-critical: user can still fill form manually
        showNotification(
          error.response?.data?.message || 'Could not load your profile. Please fill in your details.',
          'warning'
        );
      }
    };

    // ✅ Fetch available coupons
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/available`, {
          headers,
        });
        setAvailableCoupons(res.data);
      } catch (err) {
        // Non-critical: user can still checkout without coupon
        showNotification(
          err.response?.data?.message || 'Could not load coupons.',
          'warning'
        );
      }
    };

    fetchCart();
    fetchUserInfo();
    fetchCoupons();
  }, [authLoading, isLoggedIn, token]);

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
      if (!getAuthHeaders().Authorization) {
        setError(t("loginRequired"));
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/apply`,
        { code: couponCode, orderAmount: total },
        { headers: getAuthHeaders() }
      );

      setDiscount(res.data.discount);
      setFinalAmount(res.data.finalAmount);
      setAppliedCouponCode(couponCode);
      setSuccess(`Coupon applied! You saved ₹${res.data.discount}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid coupon";
      setError(msg);
      showNotification(msg, 'error');
      // No onRetry -- form submission should not auto-retry
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
      if (!getAuthHeaders().Authorization) {
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
        headers: getAuthHeaders(),
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
      const msg = err.response?.data?.message || t("placeOrderFail");
      setError(msg);
      showNotification(msg, 'error');
      // No onRetry -- form submission should not auto-retry to prevent duplicate orders
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="co">
      <div className="co__header">
        <Link href="/plantshop" className="co__back">
          <i className="fas fa-arrow-left"></i> Back to Shop
        </Link>
        <h1>Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} autoComplete="off" className="co__grid">
        {/* Left — Shipping + Payment */}
        <div className="co__left">
          {/* Shipping */}
          <div className="co__card">
            <h3 className="co__card-title"><i className="fas fa-truck"></i> Shipping Information</h3>
            <div className="co__row">
              <div className="co__field">
                <label>{t("name")} *</label>
                <input name="name" type="text" value={userInfo.name} onChange={handleChange} required />
              </div>
              <div className="co__field">
                <label>{t("email")} *</label>
                <input name="email" type="email" value={userInfo.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="co__row">
              <div className="co__field">
                <label>{t("phone")} *</label>
                <input name="phone" type="tel" value={userInfo.phone} onChange={handleChange} required pattern="\d{10}" maxLength={10} placeholder="10-digit number" />
              </div>
              <div className="co__field">
                <label>{t("pincode")} *</label>
                <input name="pincode" type="text" value={userInfo.pincode} onChange={handleChange} required pattern="\d{6}" maxLength={6} placeholder="6-digit pincode" />
              </div>
            </div>
            <div className="co__field">
              <label>{t("shippingAddress")} *</label>
              <textarea name="street" value={userInfo.street} onChange={handleChange} required placeholder="Complete street address" rows={2} />
            </div>
            <div className="co__row">
              <div className="co__field">
                <label>{t("city")} *</label>
                <input name="city" type="text" value={userInfo.city} onChange={handleChange} required />
              </div>
              <div className="co__field">
                <label>{t("state")} *</label>
                <input name="state" type="text" value={userInfo.state} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="co__card">
            <h3 className="co__card-title"><i className="fas fa-credit-card"></i> Payment Method</h3>
            <div className="co__payments">
              {["COD", "PAYU"].map((method) => (
                <label key={method} className={`co__pay-option${paymentMethod === method ? ' co__pay-option--active' : ''}`}>
                  <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span>{method === "COD" ? t("cod") : t("onlinePayment")}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Summary (sticky) */}
        <div className="co__right">
          <div className="co__summary">
            <h3 className="co__card-title">{t("orderSummary")}</h3>

            {cart && cart.items?.length > 0 ? (
              <div className="co__items">
                {cart.items.map((item) => (
                  <div key={item._id} className="co__item">
                    {item.plant?.image && <img src={item.plant.image} alt={item.plant.name} className="co__item-img" />}
                    <div className="co__item-info">
                      <strong>{item.plant?.name}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="co__item-price">₹{(item.plant?.price || 0) * item.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="co__empty">{t("cartNoItems")}</div>
            )}

            {/* Coupon */}
            <div className="co__coupon">
              {!couponBoxOpen ? (
                <button type="button" className="co__coupon-toggle" onClick={() => setCouponBoxOpen(true)}>
                  <i className="fas fa-tag"></i> Apply Coupon
                </button>
              ) : (
                <div className="co__coupon-box">
                  <div className="co__coupon-input">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" />
                    {appliedCouponCode ? (
                      <button type="button" onClick={handleRemoveCoupon} className="co__coupon-rm">Remove</button>
                    ) : (
                      <button type="button" onClick={handleApplyCoupon} className="co__coupon-apply">Apply</button>
                    )}
                  </div>
                  {availableCoupons.length > 0 && (
                    <div className="co__coupon-list">
                      {availableCoupons.map((c) => (
                        <button type="button" key={c._id} className="co__coupon-pill" onClick={() => setCouponCode(c.code)}>
                          <strong>{c.code}</strong>
                          <span>{c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`} OFF</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="co__totals">
              <div className="co__totals-row">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              {discount > 0 && (
                <div className="co__totals-row co__totals-row--discount">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="co__totals-row co__totals-row--total">
                <span>{t("total")}</span>
                <strong>₹{finalAmount || total}</strong>
              </div>
            </div>

            {error && <div className="message message-error">{error}</div>}
            {success && <div className="message message-success">{success}</div>}

            <button type="submit" disabled={placing || !cart?.items?.length} className="co__pay-btn">
              {placing ? <><i className="fas fa-spinner fa-spin"></i> {t("placingOrder")}</> : <>{t("placeOrder")} <i className="fas fa-arrow-right"></i></>}
            </button>

            <p className="co__secure"><i className="fas fa-lock"></i> Secure checkout powered by PayU</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
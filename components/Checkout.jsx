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

  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      setError("");
      try {
        const token = localStorage.getItem("authToken");
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
        const token = localStorage.getItem("authToken");
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
        console.error("Failed to fetch user info:", error);
      }
    };

    // ✅ Fetch available coupons
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableCoupons(res.data);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
      }
    };

    fetchCart();
    fetchUserInfo();
    fetchCoupons();
    // eslint-disable-next-line
  }, []);

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
      setSuccess(`Coupon applied! You saved ₹${res.data.discount}`);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid coupon");
    }
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

      // 🚀 Razorpay Checkout if Razorpay selected
      if (paymentMethod === "Razorpay") {
        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: createdOrder.finalPrice * 100,
          currency: "INR",
          name: "GreenEye Store",
          description: t("razorpayDesc"),
          order_id: createdOrder.paymentResult.id,
          handler: async function () {
            setSuccess(t("paymentProcessing"));
            setCart(null);
            router.push("/myorders");
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.phone,
          },
          theme: { color: "#388e3c" },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
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
    <div style={{
      maxWidth: 600,
      margin: "50px auto",
      padding: 24,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px #e0e0e0"
    }}>
      <Link
        href="/plantshop"
        style={{ color: "#388e3c", textDecoration: "none", fontWeight: 600 }}
      >
        ← Back to Plant Shop
      </Link>
        {/* Address Fields */}
        <h2 style={{ marginBottom: 22 }}>{t("checkoutTitle")}</h2>
      <form onSubmit={handlePlaceOrder} autoComplete="off">
        {[
          { label: t("name"), name: "name" },
          { label: t("email"), name: "email", type: "email" },
          { label: t("phone"), name: "phone", type: "tel", pattern: "\\d{10}", maxLength: 10 },
          { label: t("shippingAddress"), name: "street", isTextarea: true },
          { label: t("city"), name: "city" },
          { label: t("state"), name: "state" },
          { label: t("pincode"), name: "pincode", pattern: "\\d{6}", maxLength: 6 },
        ].map((field) => (
          <div style={{ marginBottom: 16 }} key={field.name}>
            <label>{field.label}*</label>
            {field.isTextarea ? (
              <textarea
                name={field.name}
                value={userInfo[field.name]}
                onChange={handleChange}
                required
                className="form-input"
                style={{ width: "100%", padding: 8, marginTop: 4, minHeight: 60 }}
              />
            ) : (
              <input
                name={field.name}
                type={field.type || "text"}
                value={userInfo[field.name]}
                onChange={handleChange}
                required
                pattern={field.pattern}
                maxLength={field.maxLength}
                className="form-input"
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            )}
          </div>
        ))}

        {/* ✅ Coupon Section */}
        <div style={{ marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => setCouponBoxOpen(!couponBoxOpen)}
            style={{
              background: "transparent",
              border: "1px solid #388e3c",
              padding: "6px 14px",
              borderRadius: 6,
              cursor: "pointer",
              color: "#388e3c",
              fontWeight: 600,
            }}
          >
            {couponBoxOpen ? "Hide Coupon" : "Apply Coupon"}
          </button>

          {couponBoxOpen && (
            <div style={{ marginTop: 10 }}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                style={{
                  padding: "8px 18px",
                  background: "#388e3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Apply
              </button>

              {availableCoupons.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <strong>Available Coupons:</strong>
                  <ul style={{ padding: 0, listStyle: "none" }}>
                    {availableCoupons.map((c) => (
                      <li
                        key={c._id}
                        style={{
                          cursor: "pointer",
                          padding: "6px 8px",
                          border: "1px dashed #ccc",
                          marginTop: 6,
                          borderRadius: 6,
                        }}
                        onClick={() => setCouponCode(c.code)}
                      >
                        {c.code} - {c.discountType === "percentage"
                          ? `${c.discountValue}%`
                          : `₹${c.discountValue}`}{" "}
                        off
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>{t("paymentMethod")}*</label>
          <div>
            {["COD", "Razorpay"].map((method) => (
              <label key={method} style={{ marginRight: 28 }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />{" "}
                {method === "COD" ? t("cod") : t("onlinePayment")}
              </label>
            ))}
          </div>
        </div>

        <h3>{t("orderSummary")}</h3>
        {cart && cart.items?.length > 0 ? (
          <ul style={{ padding: 0, listStyle: "none", marginBottom: 8 }}>
            {cart.items.map((item) => (
              <li key={item._id} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 500 }}>{item.plant.name}</span>
                {` x${item.quantity} `}
                <span style={{ color: "#388e3c" }}>
                  ₹{item.plant.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: "#b62222", marginBottom: 8 }}>{t("cartNoItems")}</div>
        )}

        {/* ✅ Show Discount */}
        {discount > 0 && (
          <div style={{ textAlign: "right", fontSize: 16, color: "#388e3c" }}>
            Discount: -₹{discount}
          </div>
        )}

        <div style={{ textAlign: "right", fontWeight: 600, fontSize: 18, color: "#388e3c" }}>
          {t("total")}: ₹{finalAmount || total}
        </div>

        {error && <div style={{ color: "#b62222", marginTop: 12 }}>{error}</div>}
        {success && <div style={{ color: "#388e3c", marginTop: 12 }}>{success}</div>}

        <button
          type="submit"
          disabled={placing || !cart?.items?.length}
          style={{
            marginTop: 22,
            padding: "12px 36px",
            background: "#388e3c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 17,
            cursor: placing ? "not-allowed" : "pointer",
          }}
        >
          {placing ? t("placingOrder") : t("placeOrder")}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
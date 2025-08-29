import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslations } from "next-intl";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    }
  };
}

const OrderDetails = () => {
  const t = useTranslations("orderDetails");
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 600, marginTop: 40 }}>
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <i className="fas fa-spinner fa-spin"></i> {t("loading")}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ maxWidth: 600, marginTop: 40 }}>
        <div style={{ color: "#b62222" }}>{t("notFound")}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 40 }}>
      <Link href="/myorders" passHref legacyBehavior>
        <a
          style={{
            color: "#388e3c",
            textDecoration: "none",
            marginTop: 20,
            marginBottom: 18,
            display: "inline-block",
          }}
        >
          <i className="fas fa-arrow-left"></i> {t("backToOrders")}
        </a>
      </Link>

      <div className="auth-card" style={{ padding: 32 }}>
        <h2 style={{ marginBottom: 10 }}>
          {t("order")} #{order._id.slice(-6).toUpperCase()}
        </h2>

        <div style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>
          {t("placed")}: {new Date(order.createdAt).toLocaleString()}
        </div>

        <div>
          <b>{t("status")}: </b>
          <span
            style={{
              color: order.isDelivered ? "#388e3c" : "#b62222",
              fontWeight: 600,
            }}
          >
            {order.isDelivered ? t("delivered") : t("pending")}
          </span>
        </div>

        {/* ✅ Payment Status */}
        <div style={{ marginTop: 8 }}>
          <b>{t("paymentStatus")}: </b>
          <span
            style={{
              color: order.isPaid ? "#388e3c" : "#b62222",
              fontWeight: 600,
            }}
          >
            {order.isPaid ? t("paid") : t("notPaid")}
          </span>
        </div>

        {/* ✅ Payment Method */}
        <div style={{ marginTop: 8 }}>
          <b>{t("paymentMethod")}: </b> {order.paymentMethod}
        </div>

        <div style={{ margin: "18px 0" }}>
          <b>{t("shippingAddress")}:</b>
          <div>{order.shippingAddress?.name}</div>
          <div>{order.shippingAddress?.address}</div>
          <div>
            {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
            {order.shippingAddress?.pincode}
          </div>
          <div>
            {t("phone")}: {order.shippingAddress?.phone}
          </div>
        </div>

        <div>
          <b>{t("items")}:</b>
          <ul style={{ marginTop: 8 }}>
            {order.orderItems.map((item) => (
              <li key={item._id} style={{ marginBottom: 5 }}>
                {item.name || t("product")} x {item.quantity}{" "}
                <span style={{ color: "#388e3c" }}>
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 18, fontWeight: 600 }}>
          {t("total")}: ₹
          {order.orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

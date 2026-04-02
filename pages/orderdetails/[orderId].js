import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    },
  };
}

const OrderDetails = () => {
  const { getAuthHeaders } = useAuth();
  const t = useTranslations("orderDetails");
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    if (!getAuthHeaders().Authorization) {
      router.push("/login");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="ge-detail">
        <div className="ge-detail-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="ge-detail">
        <div className="ge-detail-empty">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{t("notFound")}</p>
        </div>
      </div>
    );
  }

  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = order.discount || 0;
  const finalTotal = order.finalPrice || subtotal - discount;

  return (
    <div className="ge-detail">
      <Link href="/myorders" className="ge-detail-back">
        <i className="fas fa-arrow-left"></i> {t("backToOrders")}
      </Link>

      <div className="ge-detail-card ge-detail-card--standalone">
        {/* Header */}
        <div className="ge-detail-section">
          <h2 className="ge-detail-section-title">
            {t("order")} #{order._id.slice(-6).toUpperCase()}
          </h2>
          <p className="ge-detail-meta-label">
            {t("placed")}: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Status badges */}
        <div className="ge-detail-badges">
          <span className={`ge-badge ${order.isDelivered ? 'ge-badge-green' : 'ge-badge-gold'}`}>
            <i className={`fas ${order.isDelivered ? 'fa-check' : 'fa-clock'}`}></i>
            {order.isDelivered ? t("delivered") : t("pending")}
          </span>
          <span className={`ge-badge ${order.isPaid ? 'ge-badge-green' : 'ge-badge-red'}`}>
            <i className={`fas ${order.isPaid ? 'fa-check' : 'fa-times'}`}></i>
            {order.isPaid ? t("paid") : t("notPaid")}
          </span>
          <span className="ge-badge ge-badge-blue">
            {order.paymentMethod}
          </span>
        </div>

        {/* Shipping Address */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-truck"></i>
            {t("shippingAddress")}
          </h3>
          <div className="ge-detail-infobox">
            <div className="ge-detail-infobox-row">
              <i className="fas fa-user"></i>
              <strong>{order.shippingAddress?.name}</strong>
            </div>
            <div className="ge-detail-infobox-row">
              <i className="fas fa-map-marker-alt"></i>
              {order.shippingAddress?.address}
            </div>
            <div className="ge-detail-infobox-row">
              <i className="fas fa-city"></i>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
            </div>
            <div className="ge-detail-infobox-row">
              <i className="fas fa-phone"></i>
              {t("phone")}: {order.shippingAddress?.phone}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-shopping-bag"></i>
            {t("items")}
          </h3>
          <ul className="ge-detail-items" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {order.orderItems.map((item) => (
              <li key={item._id}>
                <span className="ge-detail-items-name">
                  {item.name || t("product")} x {item.quantity}
                </span>
                <span className="ge-detail-items-price">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Summary */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-receipt"></i>
            Payment Summary
          </h3>
          <div className="ge-detail-infobox">
            <div className="ge-detail-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {order.coupon && (
              <div className="ge-detail-summary-row">
                <span>Coupon: <strong>{order.coupon.code}</strong></span>
                <span className="ge-text-forest">Applied</span>
              </div>
            )}

            {discount > 0 && (
              <div className="ge-detail-summary-row">
                <span>Discount</span>
                <span style={{ color: 'var(--ge-error)' }}>-₹{discount}</span>
              </div>
            )}

            <div className="ge-detail-summary-total">
              <span className="ge-detail-summary-total-label">Total</span>
              <span className="ge-detail-summary-total-value">₹{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

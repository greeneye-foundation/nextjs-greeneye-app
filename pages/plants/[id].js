import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Seo from "@/components/common/Seo";
import useCart from "@/components/cart/useCart";
import CartDrawer from "@/components/cart/CartDrawer";
import { useTranslations } from "next-intl";

export default function PlantDetails() {
  const t = useTranslations("plant");
  const router = useRouter();
  const { id } = router.query;

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {
    cart, total, open, setOpen,
    addToCart, removeFromCart, changeQty,
  } = useCart();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.greeneye.foundation";

  useEffect(() => {
    if (!id) return;

    const fetchPlant = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/plants/${encodeURIComponent(id)}`);
        setPlant(data?.plant || data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id, baseUrl]);

  if (loading) {
    return (
      <div className="ge-detail ge-detail-wide">
        <div className="ge-detail-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !plant?._id) {
    return (
      <div className="ge-detail ge-detail-wide">
        <div className="ge-detail-empty">
          <i className="fas fa-seedling"></i>
          <p>{t("notFound")}</p>
        </div>
      </div>
    );
  }

  const pageUrl = `${baseUrl}/plants/${plant._id}`;
  const title = `${plant.name} | GreenEye Plant Shop`;
  const description =
    (plant.description || "").replace(/\s+/g, " ").slice(0, 160) ||
    t("defaultDescription");
  const ogImage = plant.image || "/assets/GreenLandscape.png";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plant.name,
    image: ogImage ? [ogImage] : undefined,
    description: plant.description,
    category: plant.category || "Plants",
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "INR",
      price: String(plant.price ?? 0),
      availability: plant.countInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    areaServed:
      Array.isArray(plant.country) && plant.country.length
        ? plant.country
        : undefined,
  };

  return (
    <div className="ge-detail ge-detail-wide">
      <Seo
        title={title}
        description={description}
        ogTitle={title}
        ogDescription={description}
        ogType="product"
        ogImage={ogImage}
        ogImageWidth={1200}
        ogImageHeight={630}
        ogImageAlt={plant.name}
        ogUrl={pageUrl}
        siteName="GreenEye"
        canonical={pageUrl}
        twitterCard="summary_large_image"
        structuredData={productJsonLd}
      />

      <Link href="/plantshop" className="ge-detail-back">
        <i className="fas fa-arrow-left"></i> {t("backToShop")}
      </Link>

      <div className="ge-plant-grid">
        {/* Left: Image */}
        <div className="ge-plant-image">
          {plant.image ? (
            <Image
              src={plant.image}
              alt={plant.name}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          ) : (
            <i className="fas fa-seedling ge-plant-image-placeholder"></i>
          )}
        </div>

        {/* Right: Details */}
        <div className="ge-plant-info">
          <h1 className="ge-plant-name">{plant.name}</h1>

          <div className="ge-plant-price-row">
            <span className="ge-plant-price">
              ₹{Number(plant.price || 0).toLocaleString()}
            </span>
            {plant.countInStock ? (
              <span className="ge-badge ge-badge-green">{t("inStock")}</span>
            ) : (
              <span className="ge-badge ge-badge-red">{t("outOfStock")}</span>
            )}
          </div>

          <p className="ge-plant-description">
            {plant.description || t("noDescription")}
          </p>

          <div className="ge-plant-meta">
            <div><b>{t("sku")}:</b> {plant.sku || "-"}</div>
            <div><b>{t("category")}:</b> {plant.category || t("defaultCategory")}</div>
            <div><b>{t("brand")}:</b> {plant.brand || "-"}</div>
            <div><b>{t("availableCountries")}:</b> {Array.isArray(plant.country) && plant.country.length ? plant.country.join(", ") : "-"}</div>
          </div>

          <div className="ge-plant-buttons">
            <button
              className="ge-btn ge-btn-primary ge-btn-lg"
              onClick={async () => {
                try {
                  await addToCart(plant);
                  alert(t("addedToCart"));
                } catch (e) {
                  if (e?.message === "LOGIN_REQUIRED") alert(t("pleaseLogin"));
                  else alert(t("addFailed"));
                }
              }}
            >
              <i className="fas fa-cart-plus"></i> {t("addToCart")}
            </button>

            <button
              className="ge-btn ge-btn-secondary ge-btn-lg"
              onClick={() => setOpen(true)}
            >
              <i className="fas fa-shopping-cart"></i> {t("viewCart")}
            </button>
          </div>
        </div>
      </div>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        cart={cart}
        changeQty={changeQty}
        removeFromCart={removeFromCart}
        total={total}
        t={t}
      />
    </div>
  );
}

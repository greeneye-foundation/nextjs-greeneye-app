import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Seo from "@/components/common/Seo";
import useCart from "@/components/cart/useCart";
import CartDrawer from "@/components/cart/CartDrawer";
import { useTranslations } from "next-intl"; // ✅ ADD

export default function PlantDetails() {
  const t = useTranslations("plant"); // ✅ namespace: locales/en/plant.json
  const router = useRouter();
  const { id } = router.query;

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {
    cart,
    total,
    open,
    setOpen,
    addToCart,
    removeFromCart,
    changeQty,
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

  if (loading) return <p style={{ textAlign: "center" }}>{t("loading")}</p>;
  if (error || !plant?._id) return <p style={{ textAlign: "center" }}>{t("notFound")}</p>;

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
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
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

      <Link href="/plantshop" style={{ color: "#388e3c", textDecoration: "none", fontWeight: 600 }}>
        ← {t("backToShop")}
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 30, marginTop: 20 }}>
        {/* LEFT IMAGE */}
        <div
          style={{
            background: "#f4f7f3",
            borderRadius: 16,
            minHeight: 420,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          {plant.image ? (
            <Image
              src={plant.image}
              alt={plant.name}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          ) : (
            <i className="fas fa-seedling" style={{ fontSize: 120, color: "#b6ccb9" }}></i>
          )}
        </div>

        {/* RIGHT DETAILS */}
        <div style={{
          background: "#fff",
          border: "1px solid #b6ccb9",
          borderRadius: 16,
          padding: "22px 22px 18px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
        }}>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>{plant.name}</h1>

          <div style={{ marginTop: 10, color: "#388e3c", fontWeight: 700, fontSize: 22 }}>
            ₹{Number(plant.price || 0).toLocaleString()}
            {plant.countInStock ? (
              <span style={{ marginLeft: 10, color: "#2e7d32", fontSize: 14, fontWeight: 600 }}>
                • {t("inStock")}
              </span>
            ) : (
              <span style={{ marginLeft: 10, color: "#b62222", fontSize: 14, fontWeight: 600 }}>
                • {t("outOfStock")}
              </span>
            )}
          </div>

          <div style={{ marginTop: 12, color: "#555", lineHeight: 1.6 }}>
            {plant.description || t("noDescription")}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
            <div><b>{t("sku")}:</b> {plant.sku || "-"}</div>
            <div><b>{t("category")}:</b> {plant.category || t("defaultCategory")}</div>
            <div><b>{t("brand")}:</b> {plant.brand || "-"}</div>
            <div><b>{t("availableCountries")}:</b> {Array.isArray(plant.country) && plant.country.length ? plant.country.join(", ") : "-"}</div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
            <button
              onClick={async () => {
                try {
                  await addToCart(plant);
                  alert(t("addedToCart"));
                } catch (e) {
                  if (e?.message === "LOGIN_REQUIRED") alert(t("pleaseLogin"));
                  else alert(t("addFailed"));
                }
              }}
              style={{
                background: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <i className="fas fa-cart-plus"></i> {t("addToCart")}
            </button>

            <button
              onClick={() => setOpen(true)}
              style={{
                background: "#fff",
                color: "#388e3c",
                border: "2px solid #388e3c",
                borderRadius: 8,
                padding: "12px 18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
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
        t={t} // ✅ pass translations to Drawer
      />
    </div>
  );
}

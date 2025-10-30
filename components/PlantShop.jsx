import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import useCart from "@/components/cart/useCart";
import CartDrawer from "@/components/cart/CartDrawer";
import { showNotification } from "@/components/Notification";

const formatPrice = (price = 0) => `₹${Number(price).toLocaleString()}`;

const PlantShop = () => {
  const t = useTranslations("plantshop");
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [userCountry, setUserCountry] = useState(null);
  const [countryFiltered, setCountryFiltered] = useState([]);
  const router = useRouter();

  // Reusable Cart (shared with details page)
  const {
    cart,
    cartCount,
    total,
    open,
    setOpen,
    addToCart,
    removeFromCart,
    changeQty,
  } = useCart();

  // Fetch plants
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plants`)
      .then((res) => {
        const arr = Array.isArray(res.data.plants) ? res.data.plants : [];
        setPlants(arr);
        setFilteredPlants(arr);
        if (arr.length) {
          const prices = arr.map((p) => Number(p.price || 0));
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      })
      .catch(() => {
        setPlants([]);
        setFilteredPlants([]);
      });
  }, []);

  // Fetch user's country (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetch("/api/geo")
      .then((res) => res.json())
      .then((geo) => setUserCountry(geo.countryCode))
      .catch(() => setUserCountry(null));
  }, []);

  // Filter plants by country when plants or userCountry changes
  useEffect(() => {
    if (!userCountry) return setCountryFiltered([]);
    const byCountry = plants.filter((plant) => {
      if (Array.isArray(plant.country)) {
        return plant.country.includes(userCountry);
      }
      if (typeof plant.country === "string") {
        return plant.country === userCountry;
      }
      return false;
    });
    setCountryFiltered(byCountry);
  }, [plants, userCountry]);

  // Further filter plants by search and price within the country
  useEffect(() => {
    setFilteredPlants(
      countryFiltered.filter((plant) => {
        const matchesName = (plant.name || "")
          .toLowerCase()
          .includes(search.toLowerCase());
        const price = Number(plant.price || 0);
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        return matchesName && matchesPrice;
      })
    );
  }, [search, priceRange, countryFiltered]);

  const minPrice = useMemo(
    () => (plants.length ? Math.min(...plants.map((p) => Number(p.price || 0))) : 0),
    [plants]
  );
  const maxPrice = useMemo(
    () => (plants.length ? Math.max(...plants.map((p) => Number(p.price || 0))) : 10000),
    [plants]
  );

  return (
    <div className="container" style={{ padding: "40px 10px", maxWidth: 1200 }}>
      <h1 style={{ textAlign: "center" }}>🪴 {t("storeTitle")}</h1>

      <div style={{ textAlign: "center", margin: "10px 0", color: "#388e3c" }}>
        {userCountry
          ? t("showingCountry", { country: userCountry })
          : t("detectingLocation")}
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "space-between",
          alignItems: "center",
          margin: "30px 0",
        }}
      >
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: "10px 14px",
            fontSize: 16,
            border: "1px solid #b6ccb9",
            borderRadius: 6,
          }}
        />

        <div style={{ minWidth: 250 }}>
          <label style={{ marginRight: 8 }}>{t("priceRange")}:</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            style={{ width: 110 }}
          />
          <span style={{ marginLeft: 8, fontWeight: 600 }}>
            {formatPrice(priceRange[0])}
          </span>
          <span style={{ margin: "0 6px" }}>-</span>
          <span style={{ fontWeight: 600 }}>
            {formatPrice(priceRange[1])}
          </span>
        </div>

        <button
          className="btn btn-cart"
          style={{
            padding: "10px 18px",
            background: "#388e3c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 16,
            position: "relative",
          }}
          onClick={() => setOpen((v) => !v)}
        >
          <i className="fas fa-shopping-cart"></i> {t("viewCart")}
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 8,
                background: "#fff",
                color: "#388e3c",
                borderRadius: "50%",
                padding: "3px 7px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Plant List */}
      <div
        className="plant-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 30,
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {!userCountry && (
          <p style={{ fontStyle: "italic", opacity: 0.6 }}>
            {t("loadingLocation")}
          </p>
        )}
        {userCountry && countryFiltered.length === 0 && (
          <p style={{ fontStyle: "italic", opacity: 0.6 }}>
            {t("noService")}
          </p>
        )}
        {userCountry &&
          countryFiltered.length > 0 &&
          filteredPlants.length === 0 && (
            <p style={{ fontStyle: "italic", opacity: 0.6 }}>
              {t("noPlantsFound")}
            </p>
          )}

        {filteredPlants.map((plant) => (
          <div
            key={plant._id}
            className="plant-card"
            style={{
              background: "#fff",
              border: "1px solid #b6ccb9",
              borderRadius: 10,
              padding: 20,
              width: 220,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Click image or title to go to details page by ID */}
            <Link
              href={`/plants/${encodeURIComponent(plant._id)}`}
              style={{ textDecoration: "none", color: "inherit", width: "100%" }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 16px",
                  background: "#f4f7f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {plant.image ? (
                  <img
                    src={plant.image}
                    alt={plant.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <i
                    className="fas fa-seedling"
                    style={{ fontSize: 60, color: "#b6ccb9" }}
                  ></i>
                )}
              </div>
              <h3
                style={{
                  margin: "8px 0 4px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {plant.name}
              </h3>
            </Link>

            <p
              style={{
                fontSize: 15,
                color: "#388e3c",
                fontWeight: 600,
                marginBottom: 7,
              }}
            >
              {formatPrice(plant.price)}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#7a7a7a",
                marginBottom: 10,
                minHeight: 34,
                textAlign: "center",
              }}
            >
              {plant.description || t("noDescription")}
            </p>

            <button
              onClick={async () => {
                try {
                  await addToCart(plant);
                  showNotification(t("addedToCart"), "success");
                } catch (e) {
                  if (e?.message === "LOGIN_REQUIRED") {
                    showNotification(t("loginFirst"), "error");
                  } else {
                    showNotification(e?.response?.data?.message || t("addCartFail"), "error");
                  }
                }
              }}
              style={{
                background: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              <i className="fas fa-cart-plus"></i> {t("addToCart")}
            </button>
          </div>
        ))}
      </div>

      {/* Reusable Cart Drawer */}
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
};

export default PlantShop;

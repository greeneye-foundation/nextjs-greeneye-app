import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useCart from "@/components/cart/useCart";
import CartDrawer from "@/components/cart/CartDrawer";
import { showNotification } from "@/components/Notification";
import Seo from "@/components/common/Seo";

const formatPrice = (price = 0) => `₹${Number(price).toLocaleString()}`;

const PlantShop = () => {
  const t = useTranslations("plantshop");
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [userCountry, setUserCountry] = useState(null);
  const [countryFiltered, setCountryFiltered] = useState([]);

  const { cart, cartCount, total, open, setOpen, addToCart, removeFromCart, changeQty } = useCart();

  const fetchPlants = () => {
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
      .catch((err) => {
        setPlants([]);
        setFilteredPlants([]);
        showNotification(err.response?.data?.message || 'Failed to load plants.', 'error', { onRetry: fetchPlants });
      });
  };

  useEffect(() => { fetchPlants(); }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetch("/api/geo")
      .then((res) => res.json())
      .then((geo) => setUserCountry(geo.countryCode))
      .catch(() => setUserCountry(null));
  }, []);

  useEffect(() => {
    if (!userCountry) return setCountryFiltered([]);
    setCountryFiltered(plants.filter((p) => {
      if (Array.isArray(p.country)) return p.country.includes(userCountry);
      return p.country === userCountry;
    }));
  }, [plants, userCountry]);

  useEffect(() => {
    setFilteredPlants(
      countryFiltered.filter((p) => {
        const matchName = (p.name || "").toLowerCase().includes(search.toLowerCase());
        const price = Number(p.price || 0);
        return matchName && price >= priceRange[0] && price <= priceRange[1];
      })
    );
  }, [search, priceRange, countryFiltered]);

  const minPrice = useMemo(() => plants.length ? Math.min(...plants.map(p => Number(p.price || 0))) : 0, [plants]);
  const maxPrice = useMemo(() => plants.length ? Math.max(...plants.map(p => Number(p.price || 0))) : 10000, [plants]);

  return (
    <>
      <Seo
        title="Plant Shop | GreenEye"
        description="Shop for indoor plants, outdoor plants, succulents, and plant care products."
        canonical="https://greeneye.foundation/plantshop"
        siteName="GREENEYE"
      />

      <section className="ge-shop">
        <div className="ge-container">
          {/* Header */}
          <div className="ge-shop__header">
            <div>
              <h1>Plant Shop</h1>
              <p className="ge-shop__location">
                {userCountry
                  ? <><i className="fas fa-map-marker-alt"></i> {t("showingCountry", { country: userCountry })}</>
                  : <><i className="fas fa-spinner fa-spin"></i> {t("detectingLocation")}</>
                }
              </p>
            </div>
            <button className="ge-shop__cart-btn" onClick={() => setOpen(v => !v)}>
              <i className="fas fa-shopping-bag"></i>
              {cartCount > 0 && <span className="ge-shop__cart-badge">{cartCount}</span>}
            </button>
          </div>

          {/* Filters */}
          <div className="ge-shop__filters">
            <div className="ge-shop__search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="ge-shop__price-filter">
              <span className="ge-shop__price-label">{formatPrice(priceRange[0])}</span>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="ge-shop__price-range"
              />
              <span className="ge-shop__price-label">{formatPrice(priceRange[1])}</span>
            </div>
          </div>

          {/* Empty states */}
          {!userCountry && (
            <div className="ge-shop__empty">
              <i className="fas fa-globe-asia"></i>
              <p>{t("loadingLocation")}</p>
            </div>
          )}
          {userCountry && countryFiltered.length === 0 && (
            <div className="ge-shop__empty">
              <i className="fas fa-map-marker-alt"></i>
              <p>{t("noService")}</p>
            </div>
          )}
          {userCountry && countryFiltered.length > 0 && filteredPlants.length === 0 && (
            <div className="ge-shop__empty">
              <i className="fas fa-search"></i>
              <p>{t("noPlantsFound")}</p>
            </div>
          )}

          {/* Plant Grid */}
          <div className="ge-shop__grid">
            {filteredPlants.map((plant) => (
              <div key={plant._id} className="ge-shop__card">
                <Link href={`/plants/${encodeURIComponent(plant._id)}`} className="ge-shop__card-link">
                  <div className="ge-shop__card-img">
                    {plant.image ? (
                      <img src={plant.image} alt={plant.name} loading="lazy" />
                    ) : (
                      <i className="fas fa-seedling"></i>
                    )}
                  </div>
                  <h3 className="ge-shop__card-name">{plant.name}</h3>
                </Link>
                <p className="ge-shop__card-price">{formatPrice(plant.price)}</p>
                <p className="ge-shop__card-desc">{plant.description || t("noDescription")}</p>
                <button
                  className="ge-shop__card-add"
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
                >
                  <i className="fas fa-plus"></i> {t("addToCart")}
                </button>
              </div>
            ))}
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
      </section>
    </>
  );
};

export default PlantShop;

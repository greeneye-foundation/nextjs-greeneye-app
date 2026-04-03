"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/", labelKey: "home" },
  { href: "/programs", labelKey: "projects" },
  { href: "/gift-a-tree", labelKey: "giftTree" },
  { href: "/plantshop", labelKey: "nursery", tagline: "buyPlants" },
  { href: "/blog", labelKey: "blog" },
];

const Navbar = () => {
  const router = useRouter();
  const navMenuRef = useRef();
  const dropdownRef = useRef(null);
  const [menuActive, setMenuActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, user, logout, isLoading } = useAuth();

  const t = useTranslations("navbar");

  // Close menu and dropdown on route change
  useEffect(() => {
    setMenuActive(false);
    setDropdownOpen(false);
  }, [router.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuActive ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuActive]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isActive = (path) => router.pathname === path;
  const userName = user?.name || "";

  return (
    <>
      <nav className={`ge-nav${scrolled ? " ge-nav--scrolled" : ""}`}>
        <div className="ge-nav__inner">
          {/* Logo */}
          <Link href="/" className="ge-nav__logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M14 2C14 2 6 8 6 16c0 4.4 3.6 8 8 8s8-3.6 8-8c0-8-8-14-8-14z" fill="currentColor" opacity="0.15"/>
              <path d="M14 6c0 0-5 4.5-5 10a5 5 0 0010 0c0-5.5-5-10-5-10z" fill="currentColor"/>
              <path d="M14 10v12M11 15l3-3 3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ge-nav__logo-text">GreenEye</span>
          </Link>

          {/* Desktop Nav */}
          <ul ref={navMenuRef} className={`ge-nav__menu${menuActive ? " ge-nav__menu--active" : ""}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="ge-nav__item">
                <Link
                  href={link.href}
                  className={`ge-nav__link${isActive(link.href) ? " ge-nav__link--active" : ""}`}
                  onClick={() => setMenuActive(false)}
                >
                  {link.tagline ? (
                    <span className="ge-nav__link-group">
                      <span>{t(link.labelKey)}</span>
                      <span className="ge-nav__tagline">{t(link.tagline)}</span>
                    </span>
                  ) : (
                    t(link.labelKey)
                  )}
                </Link>
              </li>
            ))}

            {/* Divider — mobile only */}
            <li className="ge-nav__divider" aria-hidden="true" />

            {isLoggedIn && (
              <>
                {/* My Trees — visible as top-level link on both mobile and desktop */}
                <li className="ge-nav__item">
                  <Link href="/my-trees" className={`ge-nav__link${isActive("/my-trees") ? " ge-nav__link--active" : ""}`} onClick={() => setMenuActive(false)}>
                    <i className="fas fa-tree" style={{ fontSize: 14 }}></i>
                    {t("myTrees")}
                  </Link>
                </li>

                {/* Account links — visible in mobile slide-out only */}
                <li className="ge-nav__item ge-nav__item--mobile-only">
                  <Link href="/profile" className={`ge-nav__link${isActive("/profile") ? " ge-nav__link--active" : ""}`} onClick={() => setMenuActive(false)}>
                    {t("profile")}
                  </Link>
                </li>
                <li className="ge-nav__item ge-nav__item--mobile-only">
                  <Link href="/myorders" className="ge-nav__link" onClick={() => setMenuActive(false)}>
                    {t("myOrders")}
                  </Link>
                </li>
                <li className="ge-nav__item ge-nav__item--mobile-only">
                  <Link href="/mydonation" className="ge-nav__link" onClick={() => setMenuActive(false)}>
                    {t("myDonations")}
                  </Link>
                </li>
                <li className="ge-nav__item ge-nav__item--mobile-only">
                  <Link href="/mygift" className="ge-nav__link" onClick={() => setMenuActive(false)}>
                    {t("myGifts")}
                  </Link>
                </li>
                {user?.isAdmin && (
                  <li className="ge-nav__item ge-nav__item--mobile-only">
                    <Link href="/admin" className="ge-nav__link ge-nav__link--admin" onClick={() => setMenuActive(false)}>
                      Admin
                    </Link>
                  </li>
                )}
                <li className="ge-nav__item ge-nav__item--mobile-only">
                  <button className="ge-nav__link ge-nav__link--btn" onClick={handleLogout}>
                    {t("logout")}
                  </button>
                </li>

                {/* Avatar dropdown — desktop only (hidden on mobile via CSS) */}
                <li className="ge-nav__item ge-nav__item--dropdown">
                  <div className="ge-nav__dropdown" ref={dropdownRef}>
                    <button className="ge-nav__avatar" onClick={() => setDropdownOpen(v => !v)} aria-expanded={dropdownOpen} aria-haspopup="true">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </button>
                    {dropdownOpen && (
                      <div className="ge-nav__dropdown-menu" role="menu">
                        <Link href="/profile" className="ge-nav__dropdown-link" role="menuitem" onClick={() => setDropdownOpen(false)}>{t("profile")}</Link>
                        <Link href="/myorders" className="ge-nav__dropdown-link" role="menuitem" onClick={() => setDropdownOpen(false)}>{t("myOrders")}</Link>
                        <Link href="/mydonation" className="ge-nav__dropdown-link" role="menuitem" onClick={() => setDropdownOpen(false)}>{t("myDonations")}</Link>
                        <Link href="/mygift" className="ge-nav__dropdown-link" role="menuitem" onClick={() => setDropdownOpen(false)}>{t("myGifts")}</Link>
                        {user?.isAdmin && <Link href="/admin" className="ge-nav__dropdown-link ge-nav__dropdown-link--admin" role="menuitem" onClick={() => setDropdownOpen(false)}>Admin</Link>}
                        <div className="ge-nav__dropdown-divider" />
                        <button className="ge-nav__dropdown-link ge-nav__dropdown-link--logout" role="menuitem" onClick={() => { setDropdownOpen(false); handleLogout(); }}>{t("logout")}</button>
                      </div>
                    )}
                  </div>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <>
                <li className="ge-nav__item">
                  <Link
                    href="/login"
                    className={`ge-nav__link${isActive("/login") ? " ge-nav__link--active" : ""}`}
                    onClick={() => setMenuActive(false)}
                  >
                    {t("login")}
                  </Link>
                </li>
                <li className="ge-nav__item ge-nav__item--cta">
                  <Link
                    href="/register"
                    className="ge-nav__cta"
                    onClick={() => setMenuActive(false)}
                  >
                    {t("register")}
                  </Link>
                </li>
              </>
            )}

            <li className="ge-nav__item ge-nav__item--lang">
              <LanguageSwitcher />
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className={`ge-nav__burger${menuActive ? " ge-nav__burger--active" : ""}`}
            onClick={() => setMenuActive((a) => !a)}
            aria-label={menuActive ? "Close menu" : "Open menu"}
            aria-expanded={menuActive}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {menuActive && (
        <div className="ge-nav__overlay" onClick={() => setMenuActive(false)} />
      )}
    </>
  );
};

export default Navbar;

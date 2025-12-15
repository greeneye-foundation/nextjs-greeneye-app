//'use client'
import Link from 'next/link'
import { useRouter } from "next/router";
import { useTranslations } from 'next-intl'

export default function ProfileTabs() {
  const router = useRouter();
  const t = useTranslations('profileTabs')

  const tabStyle = (active) => ({
    padding: "12px 28px 10px 0",
    fontWeight: 600,
    textDecoration: "none",
    color: active ? "#388e3c" : "#222",
    borderBottom: active ? "3px solid #388e3c" : "3px solid transparent",
    position: "sticky",
    top: "64px",
  })

  return (
    <div style={{ display: "flex", borderBottom: "1px solid #eee", marginTop: 5, marginBottom: 10 }}>
      <Link href="/profile" className="profile-tab" style={tabStyle(router.pathname === "/profile")}>
        {t('profile')}
      </Link>
      <Link href="/myorders" className="profile-tab" style={tabStyle(router.pathname.startsWith("/myorders"))}>
        {t('myOrders')}
      </Link>
      <Link href="/mydonation" className="profile-tab" style={tabStyle(router.pathname.startsWith("/mydonation"))}>
        {t('myDonation')}
      </Link>
      <Link href="/mygift" className="profile-tab" style={tabStyle(router.pathname.startsWith("/mygift"))}>
        {t('myGift')}
      </Link>
    </div>
  )
}
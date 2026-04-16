import Link from 'next/link';
import { useRouter } from "next/router";
import { useTranslations } from 'next-intl';

const tabs = [
  { href: "/profile", labelKey: "profile", icon: "fas fa-user" },
  { href: "/myorders", labelKey: "myOrders", icon: "fas fa-box" },
  { href: "/mydonation", labelKey: "myDonation", icon: "fas fa-heart" },
  { href: "/mygift", labelKey: "myGift", icon: "fas fa-gift" },
];

export default function ProfileTabs() {
  const router = useRouter();
  const t = useTranslations('profileTabs');

  return (
    <nav className="ge-profile-tabs" aria-label="Account navigation">
      {tabs.map((tab) => {
        const isActive = router.pathname === tab.href || router.pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`ge-profile-tabs__tab${isActive ? ' ge-profile-tabs__tab--active' : ''}`}
          >
            <i className={tab.icon}></i>
            <span>{t(tab.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

//'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useAuth } from "@/context/AuthContext"

export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    }
  };
}

export default function DonationDetails() {
  const { getAuthHeaders } = useAuth();
  const t = useTranslations("donationDetails")
  const router = useRouter()
  const { id } = router.query

  const [donation, setDonation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    if (!getAuthHeaders().Authorization) {
      router.push("/login")
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/${id}`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setDonation(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  }, [id, router])

  if (loading) {
    return (
      <div className="ge-detail">
        <div className="ge-detail-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!donation) {
    return (
      <div className="ge-detail">
        <div className="ge-detail-empty">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{t("notFound")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="ge-detail">
      <Link href="/mydonation" className="ge-detail-back">
        <i className="fas fa-arrow-left"></i> {t("backToDonations")}
      </Link>

      <div className="ge-detail-card ge-detail-card--standalone">
        {/* Header */}
        <div className="ge-detail-section">
          <h2 className="ge-detail-section-title">
            <i className="fas fa-heart"></i>
            {t("donation")} #{donation._id.slice(-6).toUpperCase()}
          </h2>
          <p className="ge-detail-meta-label">
            {t("date")}: {new Date(donation.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Amount & Status */}
        <div className="ge-detail-section">
          <div className="ge-detail-infobox">
            <div className="ge-detail-summary-row">
              <span>{t("amount")}</span>
              <span className="ge-detail-summary-total-value">₹{donation.amount}</span>
            </div>
            <div className="ge-detail-summary-row">
              <span>{t("status")}</span>
              <span className={`ge-badge ${donation.isPaid ? 'ge-badge-green' : 'ge-badge-red'}`}>
                {donation.isPaid ? t("paid") : t("pending")}
              </span>
            </div>
          </div>
        </div>

        {/* Donor Information */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-user"></i>
            Donor Information
          </h3>
          <div className="ge-detail-infobox">
            <div className="ge-detail-infobox-row">
              <i className="fas fa-user"></i>
              <strong>{donation.donorName}</strong>
            </div>
            <div className="ge-detail-infobox-row">
              <i className="fas fa-envelope"></i>
              {donation.donorEmail}
            </div>
            <div className="ge-detail-infobox-row">
              <i className="fas fa-phone"></i>
              {donation.donorPhone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

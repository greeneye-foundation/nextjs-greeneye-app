"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Seo from "@/components/common/Seo";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    },
  };
}

const API_KEY = process.env.NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const TYPE_CONFIG = {
  plant:   { label: "Plant",   icon: "🌿", color: "#2A7A4E" },
  topic:   { label: "Topic",   icon: "🌍", color: "#1565c0" },
  policy:  { label: "Policy",  icon: "📋", color: "#c62828" },
  product: { label: "Product", icon: "♻️",  color: "#e65100" },
};

const getImageSrc = (src) => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
};

export default function EncyclopediaArticlePage() {
  const router = useRouter();
  const { slug } = router.query;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch(`${API_BASE}/api/encyclopedia/articles/${slug}`, {
      headers: { "x-api-key": API_KEY || "" },
    })
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success) {
          setArticle(data.data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        <div className="encyc-article-loading">
          <div className="encyc-article-skeleton-hero" />
          <div className="encyc-article-skeleton-body">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="encyc-article-skeleton-line" style={{ width: i % 3 === 0 ? "60%" : "100%" }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <div className="encyc-article-notfound">
          <span>🌱</span>
          <h2>Article Not Found</h2>
          <p>This article may have been moved or does not exist.</p>
          <Link href="/blog" className="encyc-back-btn">← Back to Blog</Link>
        </div>
      </>
    );
  }

  const typeSlug = article.articleType?.slug || "topic";
  const typeConf = TYPE_CONFIG[typeSlug] || TYPE_CONFIG.topic;
  const imgSrc = getImageSrc(article.featuredImage);
  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";

  return (
    <>
      <Seo
        title={`${article.title?.en || "Article"} | GreenEye Encyclopedia`}
        description={article.excerpt?.en || article.metaDescription?.en || ""}
        ogTitle={article.title?.en}
        ogDescription={article.excerpt?.en}
        ogImage={imgSrc}
        canonical={`https://greeneye.foundation/encyclopedia/${slug}`}
      />

      <div className="encyc-article-page">
        {/* ── Hero ── */}
        <div className="encyc-article-hero">
          {imgSrc && (
            <div className="encyc-article-hero-img">
              <Image
                src={imgSrc}
                alt={article.title?.en || "Article"}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="encyc-article-hero-overlay" />
            </div>
          )}
          <div className="encyc-article-hero-content" style={{ position: "relative", zIndex: 2 }}>
            {/* Breadcrumb */}
            <nav className="encyc-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>Encyclopedia</span>
            </nav>

            {/* Badges */}
            <div className="encyc-article-badges">
              <span className="encyc-article-type-badge" style={{ background: typeConf.color }}>
                {typeConf.icon} {article.articleType?.name?.en || typeConf.label}
              </span>
              {article.categories?.slice(0, 2).map((cat) => (
                <span key={cat.slug} className="encyc-article-cat-badge">
                  {cat.name?.en}
                </span>
              ))}
            </div>

            <h1 className="encyc-article-title">{article.title?.en}</h1>

            {article.excerpt?.en && (
              <p className="encyc-article-excerpt">{article.excerpt.en}</p>
            )}

            {/* Meta */}
            <div className="encyc-article-meta">
              {article.author && (
                <div className="encyc-article-author">
                  {article.author.avatarUrl ? (
                    <img src={article.author.avatarUrl} alt={article.author.name} className="encyc-article-avatar" />
                  ) : (
                    <div className="encyc-article-avatar-fallback">
                      {(article.author.name || "G")[0]}
                    </div>
                  )}
                  <span>{article.author.name || "GreenEye"}</span>
                </div>
              )}
              {publishDate && <span className="encyc-article-date">📅 {publishDate}</span>}
              {article.viewCount > 0 && (
                <span className="encyc-article-views">👁 {article.viewCount} views</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="encyc-article-body-wrap">
          <div className="encyc-article-body">
            {/* Plant info box */}
            {typeSlug === "plant" && article.typeData?.plant && (
              <div className="encyc-plant-info-box">
                <h3>🌿 Plant Information</h3>
                <div className="encyc-plant-info-grid">
                  {article.typeData.plant.scientificName && (
                    <div><strong>Scientific Name</strong><span>{article.typeData.plant.scientificName}</span></div>
                  )}
                  {article.typeData.plant.family && (
                    <div><strong>Family</strong><span>{article.typeData.plant.family}</span></div>
                  )}
                  {article.typeData.plant.nativeRegion && (
                    <div><strong>Native Region</strong><span>{article.typeData.plant.nativeRegion}</span></div>
                  )}
                  {article.typeData.plant.careLevel && (
                    <div><strong>Care Level</strong><span style={{ textTransform: "capitalize" }}>{article.typeData.plant.careLevel}</span></div>
                  )}
                  {article.typeData.plant.waterRequirements && (
                    <div><strong>Water</strong><span style={{ textTransform: "capitalize" }}>{article.typeData.plant.waterRequirements}</span></div>
                  )}
                  {article.typeData.plant.growthRate && (
                    <div><strong>Growth Rate</strong><span style={{ textTransform: "capitalize" }}>{article.typeData.plant.growthRate}</span></div>
                  )}
                </div>
              </div>
            )}

            {/* Main content */}
            <div
              className="encyc-article-content"
              dangerouslySetInnerHTML={{ __html: article.content?.en || "" }}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="encyc-article-tags">
                <span>Tags:</span>
                {article.tags.map((tag) => (
                  <span key={tag.slug} className="encyc-tag">{tag.name?.en || tag.slug}</span>
                ))}
              </div>
            )}

            {/* Back */}
            <div className="encyc-article-back">
              <Link href="/blog" className="encyc-back-btn">
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const API_KEY = process.env.NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const TYPE_CONFIG = {
  plant:   { label: "Plant",   icon: "🌿", color: "#2A7A4E", bg: "#e8f5ee" },
  topic:   { label: "Topic",   icon: "🌍", color: "#1565c0", bg: "#e3f2fd" },
  policy:  { label: "Policy",  icon: "📋", color: "#c62828", bg: "#ffebee" },
  product: { label: "Product", icon: "♻️",  color: "#e65100", bg: "#fff3e0" },
};

const FILTERS = [
  { key: "all",     label: "All",      icon: "🌱" },
  { key: "plant",   label: "Plants",   icon: "🌿" },
  { key: "topic",   label: "Topics",   icon: "🌍" },
  { key: "policy",  label: "Policy",   icon: "📋" },
  { key: "product", label: "Products", icon: "♻️"  },
];

const resolveUrl = (src) => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="encyc-card encyc-skeleton-card">
    <div className="encyc-skeleton-img" />
    <div className="encyc-card-body">
      <div className="encyc-skeleton-line short" />
      <div className="encyc-skeleton-line" />
      <div className="encyc-skeleton-line" />
      <div className="encyc-skeleton-line medium" />
      <div className="encyc-skeleton-footer">
        <div className="encyc-skeleton-avatar" />
        <div className="encyc-skeleton-line short" style={{ flex: 1, margin: 0 }} />
      </div>
    </div>
  </div>
);

// ─── Article Card ──────────────────────────────────────────────────────────────
const ArticleCard = ({ article }) => {
  const typeSlug = article.articleType?.slug || "topic";
  const typeConf = TYPE_CONFIG[typeSlug] || TYPE_CONFIG.topic;
  const imgSrc = resolveUrl(article.featuredImage);
  const category = article.categories?.[0];
  const dateStr = formatDate(article.publishedAt);

  return (
    <Link href={`/encyclopedia/${article.slug}`} className="encyc-card">
      <div className="encyc-card-img-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={article.title?.en || "Article"}
            className="encyc-card-img"
            loading="lazy"
          />
        ) : (
          <div className="encyc-card-img-placeholder">
            <span>{typeConf.icon}</span>
          </div>
        )}
        <span className="encyc-type-badge" style={{ background: typeConf.color }}>
          {typeConf.icon} {article.articleType?.name?.en || typeConf.label}
        </span>
      </div>

      <div className="encyc-card-body">
        {category && (
          <span className="encyc-category-tag">{category.name?.en}</span>
        )}
        <h3 className="encyc-card-title">{article.title?.en || "Untitled"}</h3>
        <p className="encyc-card-excerpt">{article.excerpt?.en || ""}</p>

        <div className="encyc-card-footer">
          <div className="encyc-author-row">
            {article.author?.avatarUrl ? (
              <img src={article.author.avatarUrl} alt={article.author.name || ""} className="encyc-author-avatar" />
            ) : (
              <div className="encyc-author-avatar-fallback">
                {(article.author?.name || "G")[0].toUpperCase()}
              </div>
            )}
            <span className="encyc-author-name">{article.author?.name || "GreenEye"}</span>
          </div>
          <div className="encyc-meta-right">
            {dateStr && <span className="encyc-date">{dateStr}</span>}
            {article.viewCount > 0 && (
              <span className="encyc-views">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {article.viewCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="encyc-card-read-more">
        Read Article
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
};

// ─── Main Section ──────────────────────────────────────────────────────────────
const EncyclopediaArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchArticles = useCallback(async (filter) => {
    setLoading(true);
    const params = new URLSearchParams({ status: "published", limit: "6", sortBy: "latest" });
    if (filter !== "all") params.set("type", filter);

    try {
      const res = await fetch(`${API_BASE}/api/encyclopedia/articles?${params}`, {
        headers: { "x-api-key": API_KEY || "" },
      });
      const data = await res.json();
      const rawArticles = data.data?.articles || [];

      // Parallel-fetch media for cards that don't have a featuredImage
      const articlesWithImages = await Promise.all(
        rawArticles.map(async (article) => {
          if (article.featuredImage) return article;
          try {
            const mRes = await fetch(
              `${API_BASE}/api/encyclopedia/media/article/${article.slug}`,
              { headers: { "x-api-key": API_KEY || "" } }
            );
            const mData = await mRes.json();
            const firstImg = (mData.data || []).find((m) => m.type === "image");
            if (firstImg) return { ...article, featuredImage: firstImg.url };
          } catch {}
          return article;
        })
      );

      setArticles(articlesWithImages);
    } catch {
      setArticles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles(activeFilter);
  }, [activeFilter, fetchArticles]);

  return (
    <section className="encyc-section">
      <div className="encyc-blob encyc-blob-1" aria-hidden="true" />
      <div className="encyc-blob encyc-blob-2" aria-hidden="true" />

      <div className="encyc-container">
        {/* Header */}
        <div className="encyc-header">
          <span className="encyc-eyebrow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 22H5.71C5.84 21.53 5.99 21.06 6.16 20.59C6.77 18.85 7.77 17.27 9.09 16.08C10.4 14.89 12.5 14.08 14.76 13.71C13.23 16.61 12.07 19.96 12 22H14C14.06 19.96 14.98 17.75 16.19 15.78C17.41 13.81 18.95 12.09 20.41 10.67C20.79 10.31 21 9.82 21 9.3C21 8.22 20.12 7.34 19.04 7.34C18.51 7.34 18 7.55 17.6 7.93C17.4 8.12 17.2 8.06 17 8Z"/>
            </svg>
            Green Encyclopedia
          </span>
          <h2 className="encyc-title">Explore Our Environmental Knowledge Base</h2>
          <p className="encyc-subtitle">
            Discover in-depth articles about plants, environmental topics, policies, and sustainable products
          </p>
        </div>

        {/* Filters */}
        <div className="encyc-filters" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              className={`encyc-filter-btn${activeFilter === f.key ? " active" : ""}`}
              onClick={() => { if (f.key !== activeFilter) setActiveFilter(f.key); }}
            >
              <span className="encyc-filter-icon">{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="encyc-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="encyc-empty">
            <span className="encyc-empty-icon">🌱</span>
            <p>No articles found. Check back soon!</p>
          </div>
        ) : (
          <div className="encyc-grid">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && articles.length > 0 && (
          <div className="encyc-cta-wrap">
            <Link href="/encyclopedia" className="encyc-cta-btn">
              View All Articles
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EncyclopediaArticlesSection;

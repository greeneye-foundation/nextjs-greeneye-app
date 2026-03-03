"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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

const resolveUrl = (src) => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
};

// ═══════════════════════════════════════════════
// IMAGE CAROUSEL
// ═══════════════════════════════════════════════
const ImageCarousel = ({ images, onOpenLightbox }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback((len) => {
    clearInterval(timerRef.current);
    if (len > 1) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % len);
      }, 3500);
    }
  }, []);

  useEffect(() => {
    if (!paused) resetTimer(images.length);
    return () => clearInterval(timerRef.current);
  }, [images.length, paused, resetTimer]);

  const goTo = (idx) => {
    setActive(idx);
    resetTimer(images.length);
  };

  if (images.length === 0) return null;

  return (
    <div
      className="encyc-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main viewport */}
      <div className="encyc-carousel-viewport">
        <div
          className="encyc-carousel-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((img, i) => (
            <div
              key={img._id || i}
              className="encyc-carousel-slide"
              onClick={() => onOpenLightbox(i)}
              title="Click to enlarge"
            >
              <img
                src={resolveUrl(img.url)}
                alt={img.altText?.en || img.title?.en || `Photo ${i + 1}`}
                className="encyc-carousel-img"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {(img.title?.en || img.altText?.en) && (
                <div className="encyc-carousel-caption">
                  {img.title?.en || img.altText?.en}
                </div>
              )}
              <div className="encyc-carousel-zoom-hint">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  <path d="M11 8v6M8 11h6"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              className="encyc-carousel-btn prev"
              onClick={(e) => { e.stopPropagation(); goTo((active - 1 + images.length) % images.length); }}
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button
              className="encyc-carousel-btn next"
              onClick={(e) => { e.stopPropagation(); goTo((active + 1) % images.length); }}
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <div className="encyc-carousel-count">{active + 1} / {images.length}</div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="encyc-thumb-strip">
          {images.map((img, i) => (
            <button
              key={img._id || i}
              className={`encyc-thumb${i === active ? " active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
            >
              <img
                src={resolveUrl(img.url)}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators (mobile) */}
      {images.length > 1 && (
        <div className="encyc-carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`encyc-dot${i === active ? " active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════
const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, onPrev, onNext]);

  const img = images[index];
  if (!img) return null;

  return (
    <div className="encyc-lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <div className="encyc-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="encyc-lightbox-close" onClick={onClose} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {images.length > 1 && (
          <>
            <button className="encyc-lightbox-nav prev" onClick={onPrev} aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="encyc-lightbox-nav next" onClick={onNext} aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </>
        )}

        <img
          src={resolveUrl(img.url)}
          alt={img.altText?.en || img.title?.en || ""}
          className="encyc-lightbox-img"
        />

        {(img.title?.en || img.altText?.en) && (
          <div className="encyc-lightbox-caption">{img.title?.en || img.altText?.en}</div>
        )}

        {images.length > 1 && (
          <div className="encyc-lightbox-count">{index + 1} / {images.length}</div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// YOUTUBE EMBED
// ═══════════════════════════════════════════════
const YouTubeCard = ({ video }) => (
  <div className="encyc-yt-card">
    <div className="encyc-yt-embed-wrap">
      <iframe
        src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`}
        title={video.title?.en || "YouTube Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="encyc-yt-iframe"
      />
    </div>
    {(video.title?.en || video.description?.en) && (
      <div className="encyc-yt-info">
        {video.title?.en && <p className="encyc-yt-title">{video.title.en}</p>}
        {video.description?.en && <p className="encyc-yt-desc">{video.description.en}</p>}
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════
// INSTAGRAM CARD
// ═══════════════════════════════════════════════
const InstagramCard = ({ video }) => (
  <a
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    className="encyc-ig-card"
  >
    <div className="encyc-ig-icon-wrap">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433"/>
            <stop offset="25%" stopColor="#e6683c"/>
            <stop offset="50%" stopColor="#dc2743"/>
            <stop offset="75%" stopColor="#cc2366"/>
            <stop offset="100%" stopColor="#bc1888"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#igGrad)"/>
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="white"/>
      </svg>
    </div>
    <div className="encyc-ig-info">
      {video.title?.en
        ? <p className="encyc-ig-title">{video.title.en}</p>
        : <p className="encyc-ig-title">View on Instagram</p>
      }
      {video.description?.en && <p className="encyc-ig-desc">{video.description.en}</p>}
      <span className="encyc-ig-link">Open Reel →</span>
    </div>
    <div className="encyc-ig-play">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
  </a>
);

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
export default function EncyclopediaArticlePage() {
  const router = useRouter();
  const { slug } = router.query;

  const [article, setArticle]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [images, setImages]     = useState([]);
  const [videos, setVideos]     = useState([]);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setArticle(null);
    setImages([]);
    setVideos([]);

    const headers = { "x-api-key": API_KEY || "" };

    Promise.allSettled([
      fetch(`${API_BASE}/api/encyclopedia/articles/${slug}`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/encyclopedia/media/article/${slug}`, { headers }).then((r) => r.json()),
    ]).then(([articleResult, mediaResult]) => {
      // Article
      if (articleResult.status === "fulfilled" && articleResult.value?.success) {
        setArticle(articleResult.value.data);
      } else {
        setNotFound(true);
      }
      // Media
      if (mediaResult.status === "fulfilled" && mediaResult.value?.success) {
        const all = mediaResult.value.data || [];
        setImages(all.filter((m) => m.type === "image").sort((a, b) => a.order - b.order));
        setVideos(all.filter((m) => m.type === "youtube_video" || m.type === "instagram_reel").sort((a, b) => a.order - b.order));
      }
      setLoading(false);
    });
  }, [slug]);

  const openLightbox  = (i) => setLightbox({ open: true, index: i });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const prevLightbox  = () => setLightbox((l) => ({ ...l, index: (l.index - 1 + images.length) % images.length }));
  const nextLightbox  = () => setLightbox((l) => ({ ...l, index: (l.index + 1) % images.length }));

  // ── Loading ──
  if (loading) {
    return (
      <div className="encyc-article-loading">
        <div className="encyc-article-skeleton-hero" />
        <div className="encyc-article-skeleton-body">
          {[100, 100, 60, 100, 100, 80, 100, 40].map((w, i) => (
            <div key={i} className="encyc-article-skeleton-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Not Found ──
  if (notFound) {
    return (
      <div className="encyc-article-notfound">
        <span>🌱</span>
        <h2>Article Not Found</h2>
        <p>This article may have been moved or does not exist.</p>
        <Link href="/blog" className="encyc-back-btn">← Back to Blog</Link>
      </div>
    );
  }

  const typeSlug  = article.articleType?.slug || "topic";
  const typeConf  = TYPE_CONFIG[typeSlug] || TYPE_CONFIG.topic;
  const heroImg   = resolveUrl(article.featuredImage) || (images[0] ? resolveUrl(images[0].url) : null);
  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const youtubeVideos   = videos.filter((v) => v.type === "youtube_video");
  const instagramVideos = videos.filter((v) => v.type === "instagram_reel");

  return (
    <>
      <Seo
        title={`${article.title?.en || "Article"} | GreenEye Encyclopedia`}
        description={article.excerpt?.en || article.metaDescription?.en || ""}
        ogTitle={article.title?.en}
        ogDescription={article.excerpt?.en}
        ogImage={heroImg}
        canonical={`https://greeneye.foundation/encyclopedia/${slug}`}
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
      />

      <div className="encyc-article-page">

        {/* ══════════ HERO ══════════ */}
        <div className="encyc-article-hero">
          {heroImg && (
            <div className="encyc-article-hero-img">
              <img src={heroImg} alt={article.title?.en || ""} className="encyc-hero-bg-img" />
              <div className="encyc-article-hero-overlay" />
            </div>
          )}
          <div className="encyc-article-hero-content">
            <nav className="encyc-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <Link href="/encyclopedia">Encyclopedia</Link>
              <span>/</span>
              <span>{article.title?.en?.substring(0, 30)}{article.title?.en?.length > 30 ? "…" : ""}</span>
            </nav>

            <div className="encyc-article-badges">
              <span className="encyc-article-type-badge" style={{ background: typeConf.color }}>
                {typeConf.icon} {article.articleType?.name?.en || typeConf.label}
              </span>
              {article.categories?.slice(0, 2).map((cat) => (
                <span key={cat.slug} className="encyc-article-cat-badge">{cat.name?.en}</span>
              ))}
            </div>

            <h1 className="encyc-article-title">{article.title?.en}</h1>

            {article.excerpt?.en && (
              <p className="encyc-article-excerpt">{article.excerpt.en}</p>
            )}

            <div className="encyc-article-meta">
              {article.author && (
                <div className="encyc-article-author">
                  {article.author.avatarUrl ? (
                    <img src={article.author.avatarUrl} alt={article.author.name || ""} className="encyc-article-avatar" />
                  ) : (
                    <div className="encyc-article-avatar-fallback">
                      {(article.author.name || "G")[0]}
                    </div>
                  )}
                  <span>{article.author.name || "GreenEye"}</span>
                </div>
              )}
              {publishDate && <span className="encyc-article-date">📅 {publishDate}</span>}
              {article.viewCount > 0 && <span className="encyc-article-views">👁 {article.viewCount} views</span>}
            </div>
          </div>
        </div>

        {/* ══════════ BODY ══════════ */}
        <div className="encyc-article-body-wrap">
          <div className="encyc-article-body">

            {/* Plant info box */}
            {typeSlug === "plant" && article.typeData?.plant && (() => {
              const p = article.typeData.plant;
              const rows = [
                { label: "Scientific Name", value: p.scientificName },
                { label: "Family",          value: p.family },
                { label: "Native Region",   value: p.nativeRegion },
                { label: "Care Level",      value: p.careLevel },
                { label: "Water",           value: p.waterRequirements },
                { label: "Growth Rate",     value: p.growthRate },
                { label: "Mature Size",     value: p.matureSize },
              ].filter((r) => r.value);
              return rows.length > 0 ? (
                <div className="encyc-plant-info-box">
                  <h3>🌿 Plant Information</h3>
                  <div className="encyc-plant-info-grid">
                    {rows.map((r) => (
                      <div key={r.label}>
                        <strong>{r.label}</strong>
                        <span style={{ textTransform: "capitalize" }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Content */}
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

            <div className="encyc-article-back">
              <Link href="/blog" className="encyc-back-btn">← Back to Blog</Link>
            </div>
          </div>
        </div>

        {/* ══════════ MEDIA SECTION ══════════ */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="encyc-media-section">
            <div className="encyc-media-container">

              {/* ── Photos ── */}
              {images.length > 0 && (
                <div className="encyc-media-block">
                  <div className="encyc-media-block-header">
                    <div className="encyc-media-block-icon photos">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="encyc-media-block-title">Photo Gallery</h2>
                      <p className="encyc-media-block-sub">{images.length} photo{images.length > 1 ? "s" : ""} · Click to enlarge</p>
                    </div>
                  </div>

                  <ImageCarousel images={images} onOpenLightbox={openLightbox} />
                </div>
              )}

              {/* ── YouTube Videos ── */}
              {youtubeVideos.length > 0 && (
                <div className="encyc-media-block">
                  <div className="encyc-media-block-header">
                    <div className="encyc-media-block-icon youtube">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="encyc-media-block-title">Videos</h2>
                      <p className="encyc-media-block-sub">{youtubeVideos.length} video{youtubeVideos.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="encyc-video-grid">
                    {youtubeVideos.map((v, i) => (
                      <YouTubeCard key={v._id || i} video={v} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Instagram Reels ── */}
              {instagramVideos.length > 0 && (
                <div className="encyc-media-block">
                  <div className="encyc-media-block-header">
                    <div className="encyc-media-block-icon instagram">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="encyc-media-block-title">Instagram Reels</h2>
                      <p className="encyc-media-block-sub">{instagramVideos.length} reel{instagramVideos.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="encyc-ig-grid">
                    {instagramVideos.map((v, i) => (
                      <InstagramCard key={v._id || i} video={v} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <Lightbox
          images={images}
          index={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </>
  );
}

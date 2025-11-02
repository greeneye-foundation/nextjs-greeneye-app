"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

const PREVIEW_LINES = 4;

const BlogIndex = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`)
      .then((res) => {
        setBlogs(res.data.blogs || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Scroll by one card width approximately
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading blogs...</div>;

  const publishedBlogs = blogs.filter((b) => b.published);

  return (
    <section className="blog-section">
      <div className="container" style={{ maxWidth: 1100, margin: "40px auto 0 auto" }}>
        <h2 style={{ marginTop: 50, marginBottom: 30, letterSpacing: 1.5 }}>
          {locale === "fr" ? "Notre Blog" : "Our Blog"}
        </h2>

        <div className="blog-scroll-wrapper">
          {publishedBlogs.length > 0 && (
            <>
              <button
                className="blog-scroll-btn blog-scroll-left"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="blog-scroll-container" ref={scrollContainerRef}>
                {publishedBlogs.map((b) => {
                  const translation = b.translations?.[locale] || b.translations?.en || {};

                  return (
                    <Link
                      key={b.slug}
                      href={`/blog/${b.slug}`}
                      title="Read more"
                      className="blog-card"
                    >
                      {b.image && (
                        <div className="blog-card-image">
                          <Image
                            src={b.image}
                            alt={translation.title || "Blog Image"}
                            fill
                            style={{
                              objectFit: "contain",
                              background: "transparent",
                            }}
                          />
                        </div>
                      )}
                      <div className="blog-card-content">
                        <h3 className="blog-card-title">
                          {translation.title || "No title"}
                        </h3>

                        <div className="blog-card-preview">
                          {translation.content || "No content available"}
                          <div className="blog-card-gradient" />
                        </div>

                        <div className="blog-card-meta">
                          <span className="blog-card-date">
                            {new Date(b.createdAt).toLocaleDateString(locale)}
                          </span>
                          <span className="blog-card-author">{b.author || "GreenEye"}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <button
                className="blog-scroll-btn blog-scroll-right"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogIndex;

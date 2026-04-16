"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

const BlogGrid = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`)
      .then((res) => { setBlogs(res.data.blogs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const publishedBlogs = blogs.filter((b) => b.published);

  if (loading) {
    return (
      <section className="ge-section">
        <div className="ge-container">
          <div className="ge-blog-grid__loading">
            <i className="fas fa-spinner fa-spin"></i> Loading...
          </div>
        </div>
      </section>
    );
  }

  if (publishedBlogs.length === 0) {
    return (
      <section className="ge-section">
        <div className="ge-container">
          <div className="ge-blog-grid__empty">
            <i className="fas fa-newspaper"></i>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ge-section">
      <div className="ge-container">
        <div className="ge-blog-grid">
          {publishedBlogs.map((b) => {
            const tr = b.translations?.[locale] || b.translations?.en || {};
            return (
              <Link key={b.slug} href={`/blog/${b.slug}`} className="ge-blog-grid__card">
                {b.image && (
                  <div className="ge-blog-grid__img">
                    <Image src={b.image} alt={tr.title || "Blog"} fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <div className="ge-blog-grid__body">
                  <h3>{tr.title || "Untitled"}</h3>
                  <p className="ge-blog-grid__excerpt">
                    {(tr.content || "").substring(0, 140)}...
                  </p>
                  <div className="ge-blog-grid__meta">
                    <span><i className="fas fa-calendar-alt"></i> {new Date(b.createdAt).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span><i className="fas fa-user"></i> {b.author || "GreenEye"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;

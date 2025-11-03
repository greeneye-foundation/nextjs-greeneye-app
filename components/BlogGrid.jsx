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
      .then((res) => {
        setBlogs(res.data.blogs || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading blogs...</div>;

  const publishedBlogs = blogs.filter((b) => b.published);

  if (publishedBlogs.length === 0) {
    return (
      <section className="blog-grid-section">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
            No blogs available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-grid-section">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <div className="blog-grid">
          {publishedBlogs.map((b) => {
            const translation = b.translations?.[locale] || b.translations?.en || {};

            return (
              <Link
                key={b.slug}
                href={`/blog/${b.slug}`}
                title="Read more"
                className="blog-grid-card"
              >
                {b.image && (
                  <div className="blog-grid-card-image">
                    <Image
                      src={b.image}
                      alt={translation.title || "Blog Image"}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <div className="blog-grid-card-content">
                  <h3 className="blog-grid-card-title">
                    {translation.title || "No title"}
                  </h3>

                  <div className="blog-grid-card-preview">
                    {translation.content || "No content available"}
                  </div>

                  <div className="blog-grid-card-meta">
                    <span className="blog-grid-card-date">
                      {new Date(b.createdAt).toLocaleDateString(locale)}
                    </span>
                    <span className="blog-grid-card-author">{b.author || "GreenEye"}</span>
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

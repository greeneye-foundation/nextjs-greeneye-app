"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

const PREVIEW_LINES = 4;

const BlogIndex = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale(); // Get current locale

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`)
      .then((res) => {
        setBlogs(res.data.blogs || []);
        setLoading(false);
      })
      .catch((err) => {
        // Error fetching blogs - show empty state
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading blogs...</div>;

  return (
    <section className="container" style={{ maxWidth: 1100, margin: "40px auto 0 auto" }}>
      <h2 style={{ marginTop: 50, marginBottom: 30, letterSpacing: 1.5 }}>
        {locale === "fr" ? "Notre Blog" : "Our Blog"}
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem" }}>
        {blogs
          .filter((b) => b.published)
          .map((b) => {
            const translation = b.translations?.[locale] || b.translations?.en || {}; // fallback to English

            return (
              <Link
                key={b.slug}
                href={`/blog/${b.slug}`}
                title="Read more"
                style={{
                  flex: "1 1 320px",
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
                  padding: 0,
                  maxWidth: 370,
                  minHeight: 360,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "box-shadow .2s, transform .2s",
                  overflow: "hidden",
                  position: "relative",
                  textDecoration: "none",
                }}
              >
                {b.image && (
                  <div
                    style={{
                      marginTop: 6,
                      width: "100%",
                      height: 190,
                      background: "#f7f9fc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: 14,
                      borderTopRightRadius: 14,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
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
                <div
                  style={{
                    padding: "20px 20px 22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    position: "relative",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontWeight: 700,
                      fontSize: 21,
                      color: "#212529",
                      letterSpacing: 0.5,
                    }}
                  >
                    {translation.title || "No title"}
                  </h3>

                  <div
                    style={{
                      position: "relative",
                      minHeight: 85,
                      maxHeight: `calc(1.4em * ${PREVIEW_LINES})`,
                      overflow: "hidden",
                      marginBottom: 10,
                      color: "#555",
                      fontSize: 16,
                      lineHeight: "1.4",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {translation.content || "No content available"}
                    <div
                      style={{
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 34,
                        background:
                          "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.95) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#aaa",
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>
                      {new Date(b.createdAt).toLocaleDateString(locale)}
                    </span>
                    <span style={{ fontStyle: "italic" }}>{b.author || "GreenEye"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
};

export default BlogIndex;

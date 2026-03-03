"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Seo from "@/components/common/Seo";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    }
  };
}

const BlogDetails = () => {
  const router = useRouter();
  const slug = router.query.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const locale = useLocale();
  const t = useTranslations("blog");

  useEffect(() => {
    if (!slug) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${slug}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/blog");
      });
  }, [slug, router]);

  if (loading) return <div style={{ padding: 40 }}>{t("loading")}</div>;
  if (!blog) return <div style={{ padding: 40 }}>{t("notFound")}</div>;

  const tr = blog.translations?.[locale] || blog.translations?.en || {};
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greeneye.foundation";
  const pagePath = `/blog/${slug}`;
  const pageUrl = `${baseUrl}${pagePath}`;

  const metaTitle = tr.title ? `${tr.title} | GreenEye Blog` : t("defaultMetaTitle");
  const metaDescription = (tr.content || "").replace(/\s+/g, " ").slice(0, 160) || t("defaultMetaDescription");
  const metaImage = blog.image || "/default-og-image.jpg";

  // Optional image dimensions/alt 
  const ogImageWidth = 1200;
  const ogImageHeight = 630;
  const ogImageAlt = tr.title || "Blog image";

  // Article dates
  const published = blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined;
  const modified = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : published;

  
  const alternates = [];
  const supportedLocales = ['en', 'fr', 'es', 'ar', 'zh', 'ja']; 
  supportedLocales.forEach((loc) => {
    const tLoc = blog.translations?.[loc] ? loc : "en";
    alternates.push({
      hrefLang: loc,
      href: `${baseUrl}/${loc}/blog/${slug}`,
    });
  });
  alternates.push({ hrefLang: "x-default", href: pageUrl });

  // BlogPosting JSON-LD
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": tr.title || "GreenEye Blog",
    "description": metaDescription,
    "image": metaImage ? [metaImage] : undefined,
    "author": {
      "@type": "Person",
      "name": blog.author || "GreenEye"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GreenEye",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/assets/GreenLandscape.png`
      }
    },
    "datePublished": published,
    "dateModified": modified,
    "inLanguage": locale || "en"
  };

  return (
    <article
      style={{
        maxWidth: 700,
        margin: "60px auto 40px auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        padding: "0 0 42px 0",
        overflow: "hidden",
      }}
    >
      {/* CENTRALIZED SEO */}
      <Seo
        title={metaTitle}
        description={metaDescription}
        ogTitle={metaTitle}
        ogDescription={metaDescription}
        ogType="article"
        ogImage={metaImage}
        ogImageWidth={ogImageWidth}
        ogImageHeight={ogImageHeight}
        ogImageAlt={ogImageAlt}
        ogUrl={pageUrl}
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
        locale={locale === "hi" ? "hi_IN" : "en_US"}
        canonical={pageUrl}
        twitterCard="summary_large_image"
        articlePublishedTime={published}
        articleModifiedTime={modified}
        articleAuthorUrl="https://greeneye.foundation/about" // author page/FB profile
        articleSection={blog.category || "Environment"}
        articleTags={blog.tags || []}
        alternates={alternates}
        structuredData={structuredData}
        noindex={false}
      />

      <Link
        href="/blog"
        style={{
          display: "inline-block",
          margin: "22px 0 0 32px",
          color: "#3ca87c",
          fontWeight: 600,
          textDecoration: "none",
          fontSize: 15,
          letterSpacing: 0.5,
        }}
      >
        &larr; {t("backToBlogs")}
      </Link>

      <header>
        <h1
          style={{
            margin: "24px 32px 0 32px",
            fontSize: "2.5rem",
            fontWeight: 800,
            letterSpacing: 1,
            color: "#222",
          }}
        >
          {tr.title || t("noTitle")}
        </h1>
      </header>

      {blog.image && (
        <div
          style={{
            width: "100%",
            height: 330,
            overflow: "hidden",
            marginTop: 30,
            borderRadius: "14px 14px 0 0",
            background: "#f7f9fc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Image
            src={blog.image}
            alt={tr.title || "Blog image"}
            fill
            style={{ objectFit: "contain", background: "transparent" }}
            priority
          />
        </div>
      )}

      <section
        style={{
          margin: "36px 32px 0 32px",
          marginRight: 44,
          fontSize: "1.15rem",
          color: "#343a40",
          lineHeight: 1.7,
          fontWeight: 400,
          letterSpacing: 0.1,
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {tr.content || t("noContent")}
      </section>

      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "44px 32px 0 32px",
          color: "#888",
          fontSize: 15,
          borderTop: "1px solid #eee",
          paddingTop: 22,
        }}
      >
        <span>
          <i className="far fa-calendar-alt" style={{ marginRight: 6 }}></i>
          {new Date(blog.createdAt).toLocaleDateString(locale)}
        </span>
        <span style={{ fontWeight: 600 }}>
          <i className="far fa-user" style={{ marginRight: 6 }}></i>
          {blog.author || "GreenEye"}
        </span>
      </footer>
    </article>
  );
};

export default BlogDetails;

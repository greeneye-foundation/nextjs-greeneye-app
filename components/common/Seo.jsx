// components/common/Seo.jsx
import Head from "next/head";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function Seo({
  title,
  description,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogImage = "/assets/GreenLandscape.png",
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  ogUrl = "https://greeneye.foundation",
  siteName = "GreenEye",
  locale = "en_US",
  canonical,
  // Twitter
  twitterCard = "summary_large_image",
  twitterSite,   // e.g. "@GreenEye"
  twitterCreator, // e.g. "@PiyushGupta"
  // Facebook / Meta (IG/Messenger use the same OG)
  fbAppId,       // Optional: your FB app id
  fbPageUrl,     // Optional: "https://www.facebook.com/yourpage"
  fbAdmins,      // Optional: comma sep ids
  // Article-specific (for blog posts)
  articlePublishedTime,
  articleModifiedTime,
  articleAuthorUrl,   // e.g. author FB profile or site author page
  articleSection,     // e.g. "Sustainability"
  articleTags = [],   // e.g. ["green", "plants"]
  // Robots
  noindex = false,
  // Hreflang alternates
  alternates = [], // [{ hrefLang: 'en', href: 'https://.../en/...' }, ...]
  // JSON-LD (structured data)
  structuredData, // object or array of objects
}) {
  const safeTitle = ogTitle || title;


  // Ensure ogImage is absolute
  const resolvedOgImage = ogImage?.startsWith("https")
    ? ogImage
    : `${SITE_URL}${ogImage}`;

  return (
    <Head>
      {/* Basic */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow, noarchive" : "index, follow"}
      />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Hreflang alternates */}
      {alternates.map((alt) => (
        <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}

      {/* Open Graph / Facebook / Instagram / WhatsApp */}
      <meta property="og:type" content={ogType} />
      {safeTitle && <meta property="og:title" content={safeTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={resolvedOgImage} />}
      {ogImage && <meta property="og:image:secure_url" content={resolvedOgImage} />}
      {ogImageWidth && <meta property="og:image:width" content={String(ogImageWidth)} />}
      {ogImageHeight && <meta property="og:image:height" content={String(ogImageHeight)} />}
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {siteName && <meta property="og:site_name" content={siteName} />}
      {locale && <meta property="og:locale" content={locale} />}

      {/* Facebook specific */}
      {fbAppId && <meta property="fb:app_id" content={fbAppId} />}
      {fbAdmins && <meta property="fb:admins" content={fbAdmins} />}
      {fbPageUrl && <meta property="article:publisher" content={fbPageUrl} />}

      {/* Article meta (for blog detail pages) */}
      {articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {articleAuthorUrl && <meta property="article:author" content={articleAuthorUrl} />}
      {articleSection && <meta property="article:section" content={articleSection} />}
      {articleTags.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      {safeTitle && <meta name="twitter:title" content={safeTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      {ogImage && <meta name="twitter:image" content={resolvedOgImage} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
              .replace(/</g, '\\u003c')
              .replace(/>/g, '\\u003e')
              .replace(/&/g, '\\u0026'),
          }}
        />
      )}
    </Head>
  );
}

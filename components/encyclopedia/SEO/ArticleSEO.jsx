"use client";

import React from 'react';
import Head from 'next/head';
import { useEncyclopedia } from '@/context/EncyclopediaContext';

const ArticleSEO = ({ article, url }) => {
  const { language, getText } = useEncyclopedia();

  if (!article) return null;

  const title = getText(article.metaTitle) || getText(article.title);
  const description = getText(article.metaDescription) || getText(article.excerpt);
  const keywords = article.keywords?.join(', ') || '';
  const publishedTime = article.publishedAt;
  const modifiedTime = article.updatedAt;
  const authorName = article.author?.name || 'GreenEye';

  // Get featured image
  const featuredImage = article.media?.find(m => m.mediaType === 'image')?.url ||
                       article.featuredImage?.url ||
                       '/images/default-article.jpg';

  // Build canonical URL
  const canonicalUrl = url || `https://greeneye.com/encyclopedia/${article.slug}`;

  // Schema.org structured data
  const getSchemaData = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': article.articleType?.schemaType || 'Article',
      headline: title,
      description: description,
      image: featuredImage,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: {
        '@type': 'Person',
        name: authorName,
        ...(article.author?.bio && { description: article.author.bio })
      },
      publisher: {
        '@type': 'Organization',
        name: 'GreenEye',
        logo: {
          '@type': 'ImageObject',
          url: 'https://greeneye.com/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    };

    // Add type-specific schema data
    if (article.articleType?.slug === 'plant' && article.typeData?.plant) {
      const plant = article.typeData.plant;
      return {
        ...baseSchema,
        '@type': 'Article',
        about: {
          '@type': 'Thing',
          name: plant.scientificName || getText(article.title),
          ...(plant.scientificName && { alternateName: plant.scientificName }),
          ...(plant.family && { additionalType: plant.family }),
          description: description
        }
      };
    }

    if (article.articleType?.slug === 'product' && article.typeData?.product) {
      const product = article.typeData.product;
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.productName,
        description: description,
        image: featuredImage,
        brand: {
          '@type': 'Brand',
          name: product.manufacturer
        },
        ...(product.ecoRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ecoRating,
            bestRating: '5',
            ratingCount: '1'
          }
        }),
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: product.currency || 'USD',
          lowPrice: product.priceRangeMin,
          highPrice: product.priceRangeMax,
          availability: 'https://schema.org/InStock'
        }
      };
    }

    if (article.articleType?.slug === 'policy' && article.typeData?.policy) {
      const policy = article.typeData.policy;
      return {
        ...baseSchema,
        '@type': 'Article',
        articleSection: 'Environmental Policy',
        ...(policy.yearEnacted && { temporalCoverage: policy.yearEnacted.toString() }),
        spatialCoverage: {
          '@type': 'Country',
          name: policy.countryCode
        }
      };
    }

    return baseSchema;
  };

  const schemaData = getSchemaData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={authorName} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={`${canonicalUrl}?lang=en`} />
      <link rel="alternate" hrefLang="hi" href={`${canonicalUrl}?lang=hi`} />
      <link rel="alternate" hrefLang="zh" href={`${canonicalUrl}?lang=zh`} />
      <link rel="alternate" hrefLang="ar" href={`${canonicalUrl}?lang=ar`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph Tags (Facebook, LinkedIn) */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={featuredImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="GreenEye Encyclopedia" />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : `${language}_${language.toUpperCase()}`} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="article:author" content={authorName} />
      {article.tags?.map(tag => (
        <meta key={tag.slug} property="article:tag" content={getText(tag.name)} />
      ))}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={featuredImage} />
      <meta name="twitter:site" content="@GreenEyeOrg" />
      <meta name="twitter:creator" content="@GreenEyeOrg" />

      {/* Additional Meta Tags for SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026'),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://greeneye.com'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Encyclopedia',
                item: 'https://greeneye.com/encyclopedia'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: title,
                item: canonicalUrl
              }
            ]
          })
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026'),
        }}
      />
    </Head>
  );
};

export default ArticleSEO;

# Performance Optimization Guide

Based on PageSpeed Insights report, here are comprehensive performance improvements for your website.

## 🚀 Already Implemented

### ✅ Loading Indicator
- Added `LoadingBar` component that shows during route transitions
- Top loading bar + centered spinner overlay
- Prevents user confusion during page loads
- Located in: `components/LoadingBar.jsx`

## 🎯 Critical Issues to Fix

### 1. Image Optimization (HIGH PRIORITY)

**Problem:** Images are not optimized and use external URLs from Unsplash
**Impact:** Slow LCP (Largest Contentful Paint)

**Solution:**

#### Step 1: Use Next.js Image Component
Replace all `<img>` tags with Next.js `<Image>` component:

```javascript
// Before
<img src="https://images.unsplash.com/photo-..." alt="..." />

// After
import Image from 'next/image';
<Image
  src="https://images.unsplash.com/photo-..."
  alt="..."
  width={400}
  height={400}
  priority // For above-the-fold images
  quality={75}
/>
```

#### Step 2: Configure next.config.js for External Images

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

#### Step 3: Download and Self-Host Critical Images

Instead of using Unsplash URLs, download important images to `/public/images/`:

```bash
/public/images/
  ├── hero/
  ├── collections/
  ├── plants/
  └── optimized/
```

Then use:
```javascript
<Image src="/images/hero/banner.jpg" width={1920} height={1080} priority />
```

### 2. Reduce Unused JavaScript (HIGH PRIORITY)

**Problem:** Large JavaScript bundles
**Impact:** Slow page load times

**Solutions:**

#### Dynamic Imports for Heavy Components

```javascript
// Before
import HeroCarousel from '@/components/HeroCarousel';

// After - Lazy load
import dynamic from 'next/dynamic';
const HeroCarousel = dynamic(() => import('@/components/HeroCarousel'), {
  loading: () => <div>Loading...</div>,
  ssr: false // if not needed on server
});
```

#### Components to Lazy Load:
- `HeroCarousel` (only needed on homepage)
- `ShopCollections` (only on shop page)
- `AQIWidget` (can load after initial render)
- `Modal` (only when opened)
- Framer Motion animations

#### Example Implementation:

```javascript
// pages/index.js
import dynamic from 'next/dynamic';

const HeroCarousel = dynamic(() => import('@/components/HeroCarousel'), {
  ssr: false,
  loading: () => <div className="loading-placeholder">Loading...</div>
});

const AQIWidget = dynamic(() => import('@/components/AQIWidget'), {
  ssr: false
});
```

### 3. Font Optimization (MEDIUM PRIORITY)

**Problem:** Custom fonts blocking render
**Impact:** Poor FCP (First Contentful Paint)

**Solution:**

#### Use Next.js Font Optimization

```javascript
// pages/_app.js
import { Montserrat, Open_Sans } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat'
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-open-sans'
});

// In return
<div className={`${montserrat.variable} ${openSans.variable}`}>
  {/* Your app */}
</div>
```

#### Update CSS to use variables:

```css
/* globals.css */
body {
  font-family: var(--font-open-sans), sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-montserrat), sans-serif;
}
```

### 4. Reduce CSS Bundle Size (MEDIUM PRIORITY)

**Problem:** Unused CSS and large stylesheets
**Impact:** Slower parsing and rendering

**Solutions:**

#### Consolidate CSS Files
Instead of 13+ separate CSS files, consider:
- Grouping related styles
- Using CSS modules for component-specific styles
- Removing duplicate styles

#### Critical CSS Inlining
Extract critical CSS for above-the-fold content:

```javascript
// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: `
            /* Critical CSS here */
            .nav { ... }
            .hero { ... }
          `}} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

### 5. Enable Compression (HIGH PRIORITY)

**Problem:** Resources not compressed
**Impact:** Large transfer sizes

**Solution:**

#### Update next.config.js:

```javascript
// next.config.js
module.exports = {
  compress: true, // Enable gzip compression
  poweredByHeader: false,

  // Additional optimizations
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}
```

### 6. Implement Caching Strategy (MEDIUM PRIORITY)

**Problem:** No cache headers
**Impact:** Repeated downloads

**Solution:**

#### Configure Cache Headers in next.config.js:

```javascript
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/:path*.{jpg,jpeg,png,gif,svg,ico,webp}',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### 7. Optimize Third-Party Scripts (HIGH PRIORITY)

**Problem:** Blocking third-party scripts
**Impact:** Delayed interactive time

**Current Implementation (Good ✅):**
```javascript
<Script strategy="afterInteractive" /> // Already using this!
```

**Additional Optimization:**

```javascript
// Defer non-critical scripts
<Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="lazyOnload" // Only load when needed
  onLoad={() => console.log('Razorpay loaded')}
/>
```

### 8. Add Resource Hints (LOW PRIORITY)

**Problem:** No preconnect/prefetch
**Impact:** Slower external resource loading

**Solution:**

```javascript
// pages/_document.js or _app.js
<Head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
  <link rel="preconnect" href="https://checkout.razorpay.com" />
</Head>
```

### 9. Reduce Layout Shift (CLS) (HIGH PRIORITY)

**Problem:** Elements shifting during load
**Impact:** Poor user experience

**Solutions:**

#### Reserve Space for Images:
```javascript
<Image
  src="..."
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL="data:image/..." // or use static import
/>
```

#### Reserve Space for Dynamic Content:
```css
.skeleton-loader {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
```

### 10. Database and API Optimization (BACKEND)

**Problem:** Slow API responses
**Impact:** Delayed content rendering

**Solutions:**

#### Implement ISR (Incremental Static Regeneration):
```javascript
// pages/plantshop.js
export async function getStaticProps() {
  const plants = await fetchPlants();

  return {
    props: { plants },
    revalidate: 60, // Regenerate every 60 seconds
  };
}
```

#### Add API Response Caching:
```javascript
// pages/api/plants.js
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  const plants = await db.plants.find();
  res.json({ plants });
}
```

## 📊 Priority Implementation Order

### Week 1 (Critical):
1. ✅ Add loading indicator (DONE)
2. Implement Next.js Image optimization
3. Enable compression in next.config.js
4. Add dynamic imports for heavy components

### Week 2 (High Priority):
5. Optimize fonts with next/font
6. Configure proper caching headers
7. Fix layout shift issues
8. Optimize third-party scripts

### Week 3 (Medium Priority):
9. Consolidate CSS files
10. Implement ISR for static pages
11. Add resource hints
12. Database query optimization

## 🔍 Monitoring Tools

Use these tools to track improvements:
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Lighthouse** (Chrome DevTools)
- **WebPageTest**: https://www.webpagetest.org/
- **Next.js Analytics** (if using Vercel)

## 📈 Expected Results

After implementing all optimizations:
- **LCP**: < 2.5s (currently ~4s)
- **FID**: < 100ms (currently good)
- **CLS**: < 0.1 (currently ~0.25)
- **Performance Score**: 90+ (currently ~65)

## 🛠 Quick Wins (Implement Today)

1. ✅ Loading indicator (Already done!)
2. Enable compression: Add `compress: true` to next.config.js
3. Lazy load Framer Motion: Use dynamic imports
4. Optimize 2-3 largest images: Download and self-host

## 📝 Code Examples Repository

All example code is available in:
- `components/LoadingBar.jsx` ✅
- `styles/loading-bar.css` ✅
- This file for reference

## 🤝 Need Help?

- Check Next.js docs: https://nextjs.org/docs/optimization
- Performance patterns: https://web.dev/patterns
- Image optimization: https://nextjs.org/docs/api-reference/next/image

---

Last Updated: January 2025

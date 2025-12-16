# Sitemap Setup Guide for Google Search Console

## ✅ What Has Been Created

Two dynamic Next.js route handlers have been created:

1. **`app/sitemap.js`** - Generates XML sitemap dynamically
2. **`app/robots.js`** - Generates robots.txt file

These files automatically generate:
- Sitemap at: `https://yourdomain.com/sitemap.xml`
- Robots.txt at: `https://yourdomain.com/robots.txt`

---

## 🎯 What's Included in the Sitemap

The sitemap automatically includes:

### Static Pages
- Homepage (/)
- About page (/about)
- Services (/services)
- Contact (/contact)
- Encyclopedia home (/encyclopedia)

### Dynamic Pages (from API)
- **All published articles** (`/encyclopedia/article-slug`)
- **All categories** (`/encyclopedia/category/category-slug`)
- **All tags** (`/encyclopedia/tag/tag-slug`)

### SEO Properties
Each URL includes:
- `lastModified` - When the page was last updated
- `changeFrequency` - How often it changes (daily/weekly/monthly)
- `priority` - Importance (0.0 to 1.0)

---

## 🚀 Setup Instructions

### Step 1: Update Environment Variables

Add to your `.env.local` file:

```env
# Production domain
NEXT_PUBLIC_SITE_URL=https://greeneye.org

# Or for local testing
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Test Locally

1. **Start your development server**:
```bash
npm run dev
```

2. **Access the sitemap**:
```
http://localhost:3000/sitemap.xml
```

3. **Access robots.txt**:
```
http://localhost:3000/robots.txt
```

### Step 3: Verify Sitemap Output

The sitemap.xml should look like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://greeneye.org</loc>
    <lastmod>2025-01-14T10:30:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://greeneye.org/encyclopedia/mango-tree</loc>
    <lastmod>2025-01-10T15:20:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

The robots.txt should look like this:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://greeneye.org/sitemap.xml
```

---

## 📤 Submitting to Google Search Console

### Step 1: Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account

### Step 2: Add Your Property

If you haven't added your website:

1. Click **"Add Property"**
2. Choose **"URL prefix"**: `https://greeneye.org`
3. Click **Continue**

### Step 3: Verify Ownership

Google will ask you to verify ownership. Choose one method:

**Option A: HTML File Upload**
- Download the verification file
- Place it in your `public` folder
- Deploy your site
- Click "Verify" in Search Console

**Option B: HTML Tag**
- Copy the meta tag
- Add to your `app/layout.js` in the `<head>` section:
```jsx
<meta name="google-site-verification" content="YOUR_CODE" />
```
- Deploy and verify

**Option C: DNS Record** (if you control DNS)
- Add a TXT record to your domain's DNS
- Click "Verify"

### Step 4: Submit Sitemap

Once verified:

1. In Google Search Console, go to **"Sitemaps"** in the left menu
2. Enter your sitemap URL: `sitemap.xml` (just the filename)
3. Click **"Submit"**

**Full URL will be**: `https://greeneye.org/sitemap.xml`

### Step 5: Wait for Indexing

- Google will process your sitemap (can take a few days)
- Check the "Sitemaps" section for status
- You'll see:
  - ✅ "Success" - Sitemap processed
  - Number of discovered URLs
  - Number of indexed URLs

---

## 🔄 Automatic Updates

The sitemap automatically updates because:

1. **It's dynamic** - Generated on each request
2. **Fetches from API** - Always includes latest articles
3. **No manual updates needed** - New articles appear automatically

### Refresh Sitemap in Google

To make Google re-crawl your sitemap:

1. Go to **Search Console → Sitemaps**
2. Click on your sitemap URL
3. Click **"Remove"** then **"Submit"** again

Or wait - Google automatically re-crawls sitemaps periodically.

---

## 📊 Monitoring Your Sitemap

### Check Coverage

1. Go to **Search Console → Coverage**
2. See which pages are:
   - ✅ Indexed
   - ⚠️ Excluded
   - ❌ Errors

### Check Performance

1. Go to **Search Console → Performance**
2. See:
   - Total clicks
   - Total impressions
   - Average position
   - Click-through rate (CTR)

### Check Enhancements

1. Go to **Search Console → Enhancements**
2. Check:
   - Mobile usability
   - Core Web Vitals
   - Breadcrumbs (if implemented)

---

## 🐛 Troubleshooting

### Sitemap Shows 404 Error

**Problem**: Can't access sitemap.xml

**Solution**:
1. Verify `app/sitemap.js` exists
2. Restart Next.js dev server
3. Check for build errors: `npm run build`
4. In production, ensure file is deployed

### Sitemap is Empty

**Problem**: No URLs in sitemap

**Solution**:
1. Check `NEXT_PUBLIC_SITE_URL` is set
2. Verify API is running and returning articles
3. Check `NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY` is valid
4. Look for console errors

### Google Says "Couldn't Fetch"

**Problem**: Google can't access your sitemap

**Solution**:
1. Ensure site is publicly accessible (not localhost)
2. Check robots.txt isn't blocking Google
3. Verify HTTPS is working (no SSL errors)
4. Check firewall/server settings

### Some URLs Not Indexed

**Problem**: Google found URLs but didn't index them

**Possible Reasons**:
- **Quality issues** - Content too thin or duplicate
- **Blocked by robots.txt** - Check your robots.txt
- **Noindex tag** - Remove if present
- **Low priority** - Give important pages higher priority

**Solution**:
1. Request indexing via **URL Inspection** tool
2. Improve content quality
3. Check for technical SEO issues
4. Wait - indexing takes time

---

## 🎨 Customization

### Add More Static Pages

Edit `app/sitemap.js`:

```javascript
const staticPages = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  // Add your page here
  {
    url: `${baseUrl}/your-page`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
];
```

### Change Priorities

Edit `app/sitemap.js` and adjust priority values:

- **1.0** - Most important (homepage)
- **0.8-0.9** - Very important (main sections)
- **0.5-0.7** - Normal pages (articles, categories)
- **0.3-0.4** - Less important (tags, old content)

### Change Frequencies

Valid values:
- `always`
- `hourly`
- `daily`
- `weekly`
- `monthly`
- `yearly`
- `never`

### Exclude Pages from Sitemap

To exclude certain pages, add filtering:

```javascript
const articles = data.data.filter(article => {
  // Exclude draft articles
  return article.status === 'published';
});
```

---

## 📱 Additional SEO Files

### Create Humans.txt

Create `public/humans.txt`:

```
/* TEAM */
Developer: Your Name
Contact: email@example.com
Location: Your Location

/* SITE */
Last update: 2025/01/14
Standards: HTML5, CSS3, JavaScript
Components: Next.js, React, MongoDB
Software: VS Code
```

### Create Favicon

Ensure you have:
- `public/favicon.ico` (16x16, 32x32)
- `public/apple-touch-icon.png` (180x180)
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`

---

## ✅ Checklist for Production

Before going live:

- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Verify sitemap.xml loads correctly
- [ ] Verify robots.txt loads correctly
- [ ] Test sitemap with Google Search Console URL Inspection
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Add structured data to pages
- [ ] Set up Google Analytics
- [ ] Configure OpenGraph images
- [ ] Test mobile-friendliness
- [ ] Check Core Web Vitals
- [ ] Ensure HTTPS is working
- [ ] Test page load speed

---

## 🔗 Useful Links

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google's Sitemap Guidelines](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [Next.js Metadata Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

---

## 🎯 Expected Results

After submitting your sitemap:

**Week 1:**
- Google discovers your sitemap
- Starts crawling URLs
- Some pages indexed

**Week 2-4:**
- Most pages indexed
- Appearing in search results
- Coverage report populated

**Ongoing:**
- New articles indexed within days
- Search traffic increases
- Rankings improve with quality content

---

**Status**: Sitemap Ready for Submission ✅
**Last Updated**: 2025
**Version**: 1.0.0

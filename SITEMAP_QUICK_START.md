# Sitemap Quick Start Guide

## ✅ Files Created

1. **`app/sitemap.js`** - Dynamic sitemap generator
2. **`app/robots.js`** - Robots.txt generator
3. **`docs/SITEMAP_SETUP_GUIDE.md`** - Complete documentation

---

## 🚀 Quick Setup (3 Steps)

### 1. Update `.env.local`

Add your domain:
```env
NEXT_PUBLIC_SITE_URL=https://greeneye.org
```

For local testing:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Test Locally

```bash
npm run dev
```

Visit:
- **Sitemap**: http://localhost:3000/sitemap.xml
- **Robots**: http://localhost:3000/robots.txt

### 3. Deploy & Submit

1. Deploy to production
2. Go to [Google Search Console](https://search.google.com/search-console)
3. Add property: `https://greeneye.org`
4. Verify ownership
5. Submit sitemap: `sitemap.xml`

---

## 📊 What's Included

Your sitemap automatically includes:

✅ **Static Pages**
- Homepage
- About, Services, Contact
- Encyclopedia home

✅ **Dynamic Pages** (from API)
- All published articles
- All categories
- All tags

✅ **SEO Data**
- Last modified dates
- Change frequency
- Priority scores

---

## 🔍 Verify It's Working

### Check Sitemap Format

Your sitemap should show:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://greeneye.org</loc>
    <lastmod>2025-01-14T...</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  ...
</urlset>
```

### Check Robots.txt

Your robots.txt should show:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://greeneye.org/sitemap.xml
```

---

## 🎯 Submit to Google

1. **Open**: https://search.google.com/search-console
2. **Add Property**: Your domain
3. **Verify**: Download HTML file or use meta tag
4. **Go to Sitemaps** (left menu)
5. **Enter**: `sitemap.xml`
6. **Click**: Submit

**Done!** Google will start indexing your site.

---

## ⚡ Pro Tips

### Automatic Updates
- Sitemap updates automatically when new articles are published
- No manual intervention needed
- Google re-crawls periodically

### Monitor Progress
Go to Search Console → Coverage to see:
- How many pages are indexed
- Which pages have errors
- Indexing status

### Speed Up Indexing
After publishing new articles:
1. Go to **URL Inspection** in Search Console
2. Enter the article URL
3. Click **Request Indexing**

---

## 🐛 Troubleshooting

**Can't see sitemap?**
- Restart dev server: `npm run dev`
- Check file exists: `app/sitemap.js`
- Verify no build errors

**Empty sitemap?**
- Set `NEXT_PUBLIC_SITE_URL` in `.env.local`
- Ensure backend API is running
- Check API key is valid

**Google can't fetch?**
- Site must be publicly accessible (not localhost)
- Check HTTPS is working
- Verify no server/firewall blocks

---

## 📚 Full Documentation

For complete details, see:
- **`docs/SITEMAP_SETUP_GUIDE.md`** - Full guide with troubleshooting

---

**URLs to Access:**
- Sitemap: `https://yourdomain.com/sitemap.xml`
- Robots: `https://yourdomain.com/robots.txt`
- Google Console: https://search.google.com/search-console

**Ready to submit!** 🎉

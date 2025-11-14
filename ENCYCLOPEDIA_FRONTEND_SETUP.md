# Encyclopedia Frontend - API Integration Setup Guide

## ✅ What Has Been Integrated

The encyclopedia admin frontend is now fully integrated with the backend API:

### API Client Library
- **File**: `lib/api/encyclopedia.js`
- Handles all API requests with authentication
- Includes endpoints for:
  - Articles (CRUD operations)
  - Categories
  - Tags
  - Countries
  - Search
  - Media
  - Analytics
  - Authors
  - Article Types

### Updated Components

1. **Article Create/Edit Page** (`app/admin/encyclopedia/articles/create/page.jsx`)
   - ✅ Real API calls for creating articles
   - ✅ Save Draft functionality
   - ✅ Submit for Review functionality
   - ✅ Publish Now functionality
   - ✅ Error handling and loading states

2. **BasicInfoSection** (`components/encyclopedia/admin/article-form/BasicInfoSection.jsx`)
   - ✅ Fetches article types from API
   - ✅ Fallback to default types if API fails

3. **TaxonomySection** (`components/encyclopedia/admin/article-form/TaxonomySection.jsx`)
   - ✅ Fetches categories from API
   - ✅ Fetches tags from API
   - ✅ Create new tags via API

4. **PublishingSection** (`components/encyclopedia/admin/article-form/PublishingSection.jsx`)
   - ✅ Fetches authors from API

---

## 🚀 Setup Instructions

### Step 1: Run the Backend Seed Script

First, seed the backend database with initial data:

```bash
# Navigate to your backend directory
cd path/to/backend

# Run the seed script
npm run seed-encyclopedia
```

**IMPORTANT**: The script will output an API key. **Copy and save it!**

Example output:
```
==========================================
IMPORTANT: Save this API key securely!
API Key: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...
==========================================
```

### Step 2: Create Environment File

In your Next.js frontend root directory, create a `.env.local` file:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY=YOUR_API_KEY_FROM_SEED_SCRIPT

# Replace YOUR_API_KEY_FROM_SEED_SCRIPT with the actual API key from Step 1
```

**Example**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Step 3: Start Both Servers

**Terminal 1 - Backend**:
```bash
cd path/to/backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd path/to/nextjs-greeneye-app
npm run dev
```

### Step 4: Verify Backend is Running

Open your browser or use curl:
```bash
curl http://localhost:5000/api/encyclopedia
```

Expected response:
```json
{
  "success": true,
  "message": "GreenEye Encyclopedia API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## 🧪 Testing the Integration

### 1. Access the Article Create Page

Navigate to:
```
http://localhost:3000/admin/encyclopedia/articles/create
```

### 2. Test Article Type Loading

- Check the **Basic Info** tab
- The **Article Type** dropdown should populate with:
  - Plant
  - Environmental Topic
  - Policy
  - Sustainable Product

**If dropdown is empty**:
- Check browser console for errors
- Verify backend is running
- Check that API key is correct in `.env.local`

### 3. Test Categories and Tags Loading

- Navigate to **Categories & Tags** tab
- Categories and tags should load from the database
- If empty, they will be empty arrays (no errors)

**Create a Test Tag**:
- Scroll to "Create New Tag" section
- Type "Test Tag" and click "Create Tag"
- It should create via API and appear in the list

### 4. Test Authors Loading

- Navigate to **Publishing** tab
- **Author** dropdown should show authors from database
- If you see "Bot User" or similar, the API is working

### 5. Test Article Creation

Fill out the form:

1. **Basic Info** tab:
   - Article Type: `Plant`
   - URL Slug: `test-neem-tree`
   - Title (English): `Neem Tree - Nature's Pharmacy`
   - Excerpt (English): `The Neem tree is one of India's most revered medicinal plants...`

2. **Content** tab:
   - Write some content in English (at least 100 words)

3. **Type-Specific** tab (Plant fields will appear):
   - Scientific Name: `Azadirachta indica`
   - Family: `Meliaceae`
   - Care Level: `Easy`

4. **Categories & Tags** tab:
   - Select a category (if available)
   - Select or create a tag

5. **Publishing** tab:
   - Select an author
   - Keep "Global Article" selected
   - Status: `Draft`

6. **Click "Save Draft"**

**Expected Result**:
- Green message: "Draft saved successfully"
- Console shows: `Draft saved: { success: true, data: {...} }`
- Article is created in MongoDB

---

## 🔍 Troubleshooting

### Error: "API key is required"

**Problem**: Missing or invalid API key

**Solution**:
1. Check `.env.local` file exists
2. Verify `NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY` is set
3. Restart Next.js dev server after changing `.env.local`
4. Generate a new API key if needed:

```bash
npm run seed-encyclopedia
```

### Error: "Failed to fetch" or Network Error

**Problem**: Backend is not running or wrong URL

**Solution**:
1. Verify backend is running: `curl http://localhost:5000/api/encyclopedia`
2. Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Check for CORS issues in backend console
4. Verify ports (backend: 5000, frontend: 3000)

### Empty Dropdowns (Article Types, Authors, etc.)

**Problem**: Seed script not run or API endpoints returning empty

**Solution**:
1. Run seed script: `npm run seed-encyclopedia`
2. Check backend console for errors
3. Verify MongoDB is running
4. Check browser console for API errors

### "Validation errors" when saving

**Problem**: Required fields not filled

**Solution**:
1. Fill at least:
   - Article Type
   - URL Slug
   - Title (English)
   - Content (English)
   - Type-specific required fields (e.g., Scientific Name for plants)

### CORS Errors

**Problem**: Browser blocks requests due to CORS policy

**Solution**:
Add to backend `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 📊 API Response Format

All API calls return data in this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Article created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

## 🔐 API Authentication

All requests include the `x-api-key` header automatically:

```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': process.env.NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY
}
```

---

## 📝 Creating Your First Complete Article

Here's a complete test scenario:

### 1. Prepare Data
- Backend running on port 5000
- Frontend running on port 3000
- `.env.local` configured with API key
- Seed script has been run

### 2. Create Plant Article

**Basic Info**:
```
Article Type: Plant
Slug: mango-tree
Title (EN): Mango Tree - The King of Fruits
Excerpt (EN): Mango trees are tropical fruit trees known for producing one of the world's most beloved fruits.
```

**Content**:
```
The mango tree (Mangifera indica) is a tropical evergreen tree that produces the popular mango fruit. Native to South Asia, it has been cultivated for thousands of years and is now grown in many tropical and subtropical regions worldwide.

Mango trees can grow up to 30 meters tall and have a dense, spreading canopy. The leaves are lance-shaped and aromatic when crushed. The tree produces small, fragrant flowers that develop into the juicy mango fruits.

(Continue with more content...)
```

**Type-Specific (Plant)**:
```
Scientific Name: Mangifera indica
Family: Anacardiaceae
Care Level: Easy
Water Requirement: Moderate
Sunlight Requirement: Full Sun
Growth Rate: Moderate
Conservation Status: LC (Least Concern)
```

**Categories & Tags**:
```
Categories: Plants & Trees
Tags: fruit trees, tropical plants, edible
```

**Publishing**:
```
Author: (Select from dropdown)
Global Article: Yes
Status: Published
```

**SEO**:
```
Meta Title: Mango Tree Growing Guide - Complete Care Instructions
Meta Description: Learn how to grow and care for mango trees. Complete guide covering planting, watering, fertilizing, and harvesting the king of fruits.
Keywords: mango tree, Mangifera indica, growing mangoes, fruit trees, tropical gardening
```

### 3. Click "Publish Now"

### 4. Verify Creation

**Check Backend**:
```bash
curl -X GET "http://localhost:5000/api/encyclopedia/articles?language=en" \
  -H "x-api-key: YOUR_API_KEY"
```

**Check Frontend**:
- Should redirect to articles list page
- Article should appear in list

---

## 🎉 Success Indicators

You've successfully integrated the frontend with the backend when:

1. ✅ Article types load in dropdown
2. ✅ Categories and tags load from API
3. ✅ Authors load from API
4. ✅ Can create new tags via UI
5. ✅ Save Draft creates article in MongoDB
6. ✅ Submit for Review creates article with status "pending_review"
7. ✅ Publish Now creates article with status "published"
8. ✅ No CORS errors in console
9. ✅ API calls show in Network tab with 200 status
10. ✅ Error messages display when API fails

---

## 📚 Next Steps

After successful integration:

1. **Test all article types**:
   - Create a Plant article
   - Create a Topic article
   - Create a Policy article
   - Create a Product article

2. **Test media uploads** (requires additional setup):
   - Configure file storage (AWS S3 or local)
   - Test image uploads
   - Test YouTube/Instagram embeds

3. **Build article listing page**:
   - Display created articles
   - Implement filters
   - Add edit functionality

4. **Add user authentication**:
   - Integrate with your auth system
   - Set authorId from logged-in user

5. **Deploy to production**:
   - Update environment variables
   - Generate production API keys
   - Configure CORS for production domain

---

## 🆘 Support

If you encounter issues:

1. **Check backend logs**: Look for errors in backend terminal
2. **Check frontend console**: Look for JavaScript errors
3. **Check Network tab**: Verify API calls are being made
4. **Verify environment**: Ensure `.env.local` is correct
5. **Test API directly**: Use curl or Postman to test endpoints

---

**Status**: Frontend API Integration Complete ✅
**Last Updated**: 2025
**Version**: 1.0.0

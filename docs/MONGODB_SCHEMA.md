# Environmental Encyclopedia - MongoDB Schema Design

## Database: `greeneye_encyclopedia`

---

## Collections Overview

1. **countries** - Country master data
2. **categories** - Hierarchical categories and subcategories
3. **articleTypes** - Article type templates (plant, topic, policy, product)
4. **authors** - Content creators and admins
5. **articles** - Main articles collection with type-specific data
6. **tags** - Reusable tags
7. **media** - Images and videos linked to articles
8. **socialPosts** - Auto-generated social media content
9. **reviews** - Article approval workflow
10. **searchQueries** - Search analytics
11. **articleViews** - View tracking
12. **apiKeys** - API authentication
13. **rateLimits** - API rate limiting

---

## Collection Schemas

### 1. countries

```javascript
{
  _id: ObjectId,
  code: String, // ISO 3166-1 alpha-3 (IND, CHN, ARE, USA, BRA) - UNIQUE
  name: String, // "India"
  nativeName: String, // "भारत"
  flagEmoji: String, // "🇮🇳"
  overview: String,
  capital: String,
  population: Number,
  areaKm2: Number,
  languages: [String], // ["English", "Hindi"]
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.countries.createIndex({ code: 1 }, { unique: true })
db.countries.createIndex({ name: 1 })
```

### 2. categories

```javascript
{
  _id: ObjectId,
  slug: String, // "plants", "climate-change" - UNIQUE
  name: {
    en: String, // "Plants"
    hi: String, // "पौधे"
    zh: String, // "植物"
    ar: String  // "نباتات"
  },
  description: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  icon: String, // "fa-seedling"
  parentId: ObjectId, // Reference to parent category (null for main categories)
  displayOrder: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ parentId: 1 })
db.categories.createIndex({ isActive: 1 })
```

### 3. articleTypes

```javascript
{
  _id: ObjectId,
  slug: String, // "plant", "topic", "policy", "product" - UNIQUE
  name: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  templateName: String, // "PlantArticle", "TopicArticle"
  schemaType: String, // Schema.org type: "Article", "Product"
  customFields: Object, // Dynamic fields specific to this type
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.articleTypes.createIndex({ slug: 1 }, { unique: true })
```

### 4. authors

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Link to main users collection if exists
  name: String,
  email: String, // UNIQUE
  role: String, // "admin", "content_creator", "bot"
  bio: String,
  avatarUrl: String,
  expertise: [String], // ["Botany", "Climate Policy"]
  countryCode: String, // Reference to countries.code
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.authors.createIndex({ email: 1 }, { unique: true })
db.authors.createIndex({ role: 1 })
db.authors.createIndex({ isActive: 1 })
```

### 5. articles (Main Collection - Complex)

```javascript
{
  _id: ObjectId,
  slug: String, // "mango-tree-cultivation" - UNIQUE
  articleTypeId: ObjectId, // Reference to articleTypes

  // Multi-language content
  title: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  excerpt: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  content: {
    en: String, // Rich text HTML or Markdown
    hi: String,
    zh: String,
    ar: String
  },

  // Author and workflow
  authorId: ObjectId, // Reference to authors
  status: String, // "draft", "pending_review", "published", "archived"

  // Publishing settings
  isGlobal: Boolean, // true = visible to all countries
  publishedCountries: [String], // ["IND", "CHN"] - if not global

  // SEO
  metaTitle: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  metaDescription: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  keywords: [String], // ["sustainability", "renewable energy"]

  // Categories and tags
  categoryIds: [ObjectId], // References to categories (many-to-many)
  tagIds: [ObjectId], // References to tags (many-to-many)

  // Related countries (for cross-references)
  relatedCountries: [
    {
      countryCode: String,
      relevance: String // "primary", "secondary", "mentioned"
    }
  ],

  // Type-specific data (embedded based on articleTypeId)
  typeData: {
    // For Plants
    plant: {
      scientificName: String,
      commonNames: {
        en: [String],
        hi: [String],
        zh: [String],
        ar: [String]
      },
      family: String,
      genus: String,
      nativeRegions: [String],
      climateZones: [String],
      careLevel: String, // "easy", "moderate", "difficult"
      waterRequirements: String, // "low", "moderate", "high"
      sunlightRequirements: String, // "full_sun", "partial_shade", "full_shade"
      soilType: String,
      growthRate: String, // "slow", "moderate", "fast"
      matureHeightCm: Number,
      matureWidthCm: Number,
      floweringSeason: String,
      environmentalBenefits: [String],
      medicinalUses: String,
      toxicityInfo: String,
      conservationStatus: String // "LC", "NT", "VU", "EN", "CR", "EW", "EX"
    },

    // For Policies
    policy: {
      countryCode: String,
      policyTitle: String,
      policyNumber: String,
      yearEnacted: Number,
      yearAmended: Number,
      status: String, // "active", "repealed", "under_review", "proposed"
      policyType: String, // "legislation", "regulation", "treaty", "guideline"
      summary: String,
      keyPoints: [String],
      fullTextUrl: String,
      responsibleMinistry: String,
      impactAssessment: String,
      relatedSDGs: [Number] // UN Sustainable Development Goals: [7, 13, 15]
    },

    // For Products
    product: {
      productName: String,
      manufacturer: String,
      category: String,
      availableCountries: [String],
      certifications: [String],
      priceRangeMin: Number,
      priceRangeMax: Number,
      currency: String, // "USD", "INR", "CNY"
      ecoRating: Number, // 0.00 to 5.00
      carbonFootprintKg: Number,
      recyclable: Boolean,
      biodegradable: Boolean,
      websiteUrl: String,
      purchaseLinks: {
        amazon: String,
        official: String
      }
    },

    // For Topics
    topic: {
      topicType: String, // "Climate Change", "Biodiversity", "Pollution"
      urgencyLevel: String, // "low", "medium", "high", "critical"
      globalImpact: Boolean,
      affectedRegions: [String],
      timeline: String, // "2020-2050"
      keyStatistics: [
        {
          label: String,
          value: String
        }
      ],
      solutions: [String],
      challenges: [String]
    }
  },

  // Media references (stored separately but referenced here)
  mediaIds: [ObjectId], // References to media collection

  // Related articles
  relatedArticleIds: [
    {
      articleId: ObjectId,
      relevanceScore: Number, // 0.00 to 1.00
      relationshipType: String // "similar", "referenced", "prerequisite"
    }
  ],

  // Dates
  publishedAt: Date,
  archivedAt: Date,
  createdAt: Date,
  updatedAt: Date,

  // Analytics
  viewCount: Number,
  shareCount: Number
}

// Indexes
db.articles.createIndex({ slug: 1 }, { unique: true })
db.articles.createIndex({ articleTypeId: 1 })
db.articles.createIndex({ status: 1 })
db.articles.createIndex({ publishedAt: -1 })
db.articles.createIndex({ isGlobal: 1 })
db.articles.createIndex({ publishedCountries: 1 })
db.articles.createIndex({ categoryIds: 1 })
db.articles.createIndex({ tagIds: 1 })
db.articles.createIndex({ "title.en": "text", "title.hi": "text", "title.zh": "text", "title.ar": "text", "content.en": "text" }) // Full-text search
db.articles.createIndex({ "typeData.plant.scientificName": 1 })
db.articles.createIndex({ "typeData.policy.countryCode": 1 })
db.articles.createIndex({ "typeData.product.category": 1 })
```

### 6. tags

```javascript
{
  _id: ObjectId,
  slug: String, // "renewable-energy" - UNIQUE
  name: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  usageCount: Number, // Auto-incremented when used
  createdAt: Date
}

// Indexes
db.tags.createIndex({ slug: 1 }, { unique: true })
db.tags.createIndex({ usageCount: -1 })
```

### 7. media

```javascript
{
  _id: ObjectId,
  articleId: ObjectId, // Reference to articles
  mediaType: String, // "image", "youtube_video", "youtube_short", "instagram_reel"
  url: String,
  embedCode: String, // For videos
  thumbnailUrl: String,
  title: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  caption: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  altText: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  credits: String, // Photo credit/copyright
  displayOrder: Number, // 0-9 (max 10 images)
  width: Number,
  height: Number,
  fileSizeKb: Number,
  createdAt: Date
}

// Indexes
db.media.createIndex({ articleId: 1 })
db.media.createIndex({ mediaType: 1 })
db.media.createIndex({ displayOrder: 1 })
```

### 8. socialPosts

```javascript
{
  _id: ObjectId,
  articleId: ObjectId, // Reference to articles
  platform: String, // "twitter", "facebook", "instagram", "linkedin"
  content: {
    en: String,
    hi: String,
    zh: String,
    ar: String
  },
  hashtags: [String], // ["#Sustainability", "#GreenEnergy"]
  isAutoGenerated: Boolean,
  status: String, // "draft", "ready", "posted"
  postedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.socialPosts.createIndex({ articleId: 1 })
db.socialPosts.createIndex({ platform: 1 })
db.socialPosts.createIndex({ status: 1 })
```

### 9. reviews

```javascript
{
  _id: ObjectId,
  articleId: ObjectId, // Reference to articles
  reviewerId: ObjectId, // Reference to authors
  status: String, // "approved", "rejected", "needs_changes"
  comments: String,
  reviewedAt: Date
}

// Indexes
db.reviews.createIndex({ articleId: 1 })
db.reviews.createIndex({ reviewerId: 1 })
db.reviews.createIndex({ status: 1 })
```

### 10. searchQueries

```javascript
{
  _id: ObjectId,
  query: String,
  language: String, // "en", "hi", "zh", "ar"
  countryCode: String,
  resultsCount: Number,
  clickedArticleId: ObjectId, // Reference to articles
  userIp: String,
  createdAt: Date
}

// Indexes
db.searchQueries.createIndex({ query: 1 })
db.searchQueries.createIndex({ language: 1 })
db.searchQueries.createIndex({ createdAt: -1 })
```

### 11. articleViews

```javascript
{
  _id: ObjectId,
  articleId: ObjectId, // Reference to articles
  countryCode: String,
  language: String,
  userIp: String,
  userAgent: String,
  referer: String,
  viewedAt: Date
}

// Indexes
db.articleViews.createIndex({ articleId: 1 })
db.articleViews.createIndex({ countryCode: 1 })
db.articleViews.createIndex({ viewedAt: -1 })
```

### 12. apiKeys

```javascript
{
  _id: ObjectId,
  keyHash: String, // SHA-256 hash of API key - UNIQUE
  name: String, // "N8N Bot", "Public API User"
  ownerEmail: String,
  type: String, // "public", "internal", "bot"
  rateLimitPerHour: Number, // 100, 1000, etc.
  isActive: Boolean,
  allowedIps: [String], // ["192.168.1.1"] or empty for any
  createdAt: Date,
  expiresAt: Date,
  lastUsedAt: Date
}

// Indexes
db.apiKeys.createIndex({ keyHash: 1 }, { unique: true })
db.apiKeys.createIndex({ isActive: 1 })
```

### 13. rateLimits

```javascript
{
  _id: ObjectId,
  apiKeyId: ObjectId, // Reference to apiKeys
  endpoint: String, // "/api/articles", "/api/search"
  requestCount: Number,
  windowStart: Date, // Start of current hour
  createdAt: Date
}

// Indexes
db.rateLimits.createIndex({ apiKeyId: 1, windowStart: 1 })
db.rateLimits.createIndex({ endpoint: 1 })
// TTL index to auto-delete old records after 24 hours
db.rateLimits.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 })
```

---

## Initial Seed Data

### Countries

```javascript
db.countries.insertMany([
  {
    code: "IND",
    name: "India",
    nativeName: "भारत",
    flagEmoji: "🇮🇳",
    capital: "New Delhi",
    languages: ["English", "Hindi"]
  },
  {
    code: "CHN",
    name: "China",
    nativeName: "中国",
    flagEmoji: "🇨🇳",
    capital: "Beijing",
    languages: ["Chinese"]
  },
  {
    code: "ARE",
    name: "United Arab Emirates",
    nativeName: "الإمارات العربية المتحدة",
    flagEmoji: "🇦🇪",
    capital: "Abu Dhabi",
    languages: ["Arabic", "English"]
  },
  {
    code: "USA",
    name: "United States",
    nativeName: "United States",
    flagEmoji: "🇺🇸",
    capital: "Washington, D.C.",
    languages: ["English"]
  },
  {
    code: "BRA",
    name: "Brazil",
    nativeName: "Brasil",
    flagEmoji: "🇧🇷",
    capital: "Brasília",
    languages: ["Portuguese"]
  }
]);
```

### Categories

```javascript
db.categories.insertMany([
  {
    slug: "plants",
    name: { en: "Plants", hi: "पौधे", zh: "植物", ar: "نباتات" },
    description: { en: "Information about plants and trees" },
    icon: "fa-seedling",
    parentId: null,
    displayOrder: 1,
    isActive: true
  },
  {
    slug: "topics",
    name: { en: "Environmental Topics", hi: "पर्यावरण विषय", zh: "环境主题", ar: "المواضيع البيئية" },
    description: { en: "Topics related to environment and sustainability" },
    icon: "fa-globe",
    parentId: null,
    displayOrder: 2,
    isActive: true
  },
  {
    slug: "policies",
    name: { en: "Policies", hi: "नीतियां", zh: "政策", ar: "سياسات" },
    description: { en: "Environmental policies and regulations" },
    icon: "fa-file-contract",
    parentId: null,
    displayOrder: 3,
    isActive: true
  },
  {
    slug: "products",
    name: { en: "Sustainable Products", hi: "सतत उत्पाद", zh: "可持续产品", ar: "منتجات مستدامة" },
    description: { en: "Eco-friendly and sustainable products" },
    icon: "fa-leaf",
    parentId: null,
    displayOrder: 4,
    isActive: true
  }
]);
```

### Article Types

```javascript
db.articleTypes.insertMany([
  {
    slug: "plant",
    name: { en: "Plant", hi: "पौधा", zh: "植物", ar: "نبات" },
    templateName: "PlantArticle",
    schemaType: "Article",
    customFields: {},
    isActive: true
  },
  {
    slug: "topic",
    name: { en: "Environmental Topic", hi: "पर्यावरण विषय", zh: "环境主题", ar: "موضوع بيئي" },
    templateName: "TopicArticle",
    schemaType: "Article",
    customFields: {},
    isActive: true
  },
  {
    slug: "policy",
    name: { en: "Policy", hi: "नीति", zh: "政策", ar: "سياسة" },
    templateName: "PolicyArticle",
    schemaType: "Article",
    customFields: {},
    isActive: true
  },
  {
    slug: "product",
    name: { en: "Sustainable Product", hi: "सतत उत्पाद", zh: "可持续产品", ar: "منتج مستدام" },
    templateName: "ProductArticle",
    schemaType: "Product",
    customFields: {},
    isActive: true
  }
]);
```

---

## Notes for Backend Implementation

### 1. **Mongoose Models**
- Create separate Mongoose models for each collection
- Use virtuals for computed properties
- Implement pre/post hooks for:
  - Auto-updating `updatedAt`
  - Incrementing tag `usageCount`
  - Updating article `viewCount`

### 2. **Validation**
- Validate country codes against countries collection
- Ensure at least one language is provided in multi-language fields
- Limit media to 10 items per article
- Validate social post character limits (Twitter: 280)

### 3. **Performance**
- Use MongoDB aggregation pipeline for complex queries
- Implement caching for frequently accessed data (countries, categories)
- Use lean() for read-only queries

### 4. **Security**
- Hash API keys before storing
- Sanitize user inputs
- Implement proper authentication middleware
- Use rate limiting middleware

### 5. **Search**
- Use MongoDB text search for basic search
- Consider implementing Elasticsearch for advanced search features
- Build autocomplete using aggregation pipeline on searchQueries collection

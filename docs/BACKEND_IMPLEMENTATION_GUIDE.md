# Backend Implementation Guide - Quick Start

## Tech Stack Recommendation

- **Node.js** (v18+)
- **Express.js** or **Fastify**
- **MongoDB** (v6+) with **Mongoose**
- **Redis** (for caching and rate limiting)
- **JWT** (for authentication)
- **Multer** (for file uploads)
- **Sharp** (for image processing)

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── constants.js
│   ├── models/
│   │   ├── Country.js
│   │   ├── Category.js
│   │   ├── ArticleType.js
│   │   ├── Author.js
│   │   ├── Article.js
│   │   ├── Tag.js
│   │   ├── Media.js
│   │   ├── SocialPost.js
│   │   ├── Review.js
│   │   ├── SearchQuery.js
│   │   ├── ArticleView.js
│   │   ├── ApiKey.js
│   │   └── RateLimit.js
│   ├── routes/
│   │   ├── articles.js
│   │   ├── categories.js
│   │   ├── countries.js
│   │   ├── tags.js
│   │   ├── search.js
│   │   ├── media.js
│   │   ├── socialPosts.js
│   │   ├── admin.js
│   │   └── analytics.js
│   ├── controllers/
│   │   ├── articlesController.js
│   │   ├── categoriesController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimit.js
│   │   ├── validateRequest.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── searchService.js
│   │   ├── socialPostGenerator.js
│   │   ├── seoService.js
│   │   └── analyticsService.js
│   ├── utils/
│   │   ├── slugify.js
│   │   ├── sanitize.js
│   │   └── helpers.js
│   └── app.js
├── .env
└── package.json
```

---

## Environment Variables (.env)

```bash
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1
BASE_URL=http://localhost:5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/greeneye_encyclopedia
MONGODB_OPTIONS=retryWrites=true&w=majority

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=20971520
UPLOAD_PATH=./uploads
CDN_URL=https://cdn.greeneye.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=1000

# External APIs (if needed)
YOUTUBE_API_KEY=
INSTAGRAM_API_KEY=

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://greeneye.com
```

---

## Key Mongoose Model Examples

### 1. Article Model (articles.js)

```javascript
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  articleTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArticleType',
    required: true
  },

  // Multi-language fields
  title: {
    en: { type: String, required: true },
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
    en: { type: String, required: true },
    hi: String,
    zh: String,
    ar: String
  },

  // Author and status
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'archived'],
    default: 'draft'
  },

  // Publishing settings
  isGlobal: {
    type: Boolean,
    default: true
  },
  publishedCountries: [String],

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
  keywords: [String],

  // Relations
  categoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tagIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],

  relatedCountries: [{
    countryCode: String,
    relevance: {
      type: String,
      enum: ['primary', 'secondary', 'mentioned']
    }
  }],

  // Type-specific data (flexible schema)
  typeData: {
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
      careLevel: {
        type: String,
        enum: ['easy', 'moderate', 'difficult']
      },
      waterRequirements: {
        type: String,
        enum: ['low', 'moderate', 'high']
      },
      sunlightRequirements: {
        type: String,
        enum: ['full_sun', 'partial_shade', 'full_shade']
      },
      soilType: String,
      growthRate: {
        type: String,
        enum: ['slow', 'moderate', 'fast']
      },
      matureHeightCm: Number,
      matureWidthCm: Number,
      floweringSeason: String,
      environmentalBenefits: [String],
      medicinalUses: String,
      toxicityInfo: String,
      conservationStatus: {
        type: String,
        enum: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX']
      }
    },

    policy: {
      countryCode: String,
      policyTitle: String,
      policyNumber: String,
      yearEnacted: Number,
      yearAmended: Number,
      status: {
        type: String,
        enum: ['active', 'repealed', 'under_review', 'proposed']
      },
      policyType: {
        type: String,
        enum: ['legislation', 'regulation', 'treaty', 'guideline', 'other']
      },
      summary: String,
      keyPoints: [String],
      fullTextUrl: String,
      responsibleMinistry: String,
      impactAssessment: String,
      relatedSDGs: [Number]
    },

    product: {
      productName: String,
      manufacturer: String,
      category: String,
      availableCountries: [String],
      certifications: [String],
      priceRangeMin: Number,
      priceRangeMax: Number,
      currency: String,
      ecoRating: Number,
      carbonFootprintKg: Number,
      recyclable: Boolean,
      biodegradable: Boolean,
      websiteUrl: String,
      purchaseLinks: {
        amazon: String,
        official: String
      }
    },

    topic: {
      topicType: String,
      urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      globalImpact: Boolean,
      affectedRegions: [String],
      timeline: String,
      keyStatistics: [{
        label: String,
        value: String
      }],
      solutions: [String],
      challenges: [String]
    }
  },

  mediaIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],

  relatedArticleIds: [{
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    },
    relevanceScore: Number,
    relationshipType: String
  }],

  // Dates
  publishedAt: Date,
  archivedAt: Date,

  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
articleSchema.index({ slug: 1 });
articleSchema.index({ articleTypeId: 1 });
articleSchema.index({ status: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ isGlobal: 1 });
articleSchema.index({ publishedCountries: 1 });
articleSchema.index({ categoryIds: 1 });
articleSchema.index({ tagIds: 1 });

// Full-text search index
articleSchema.index({
  'title.en': 'text',
  'title.hi': 'text',
  'title.zh': 'text',
  'title.ar': 'text',
  'content.en': 'text'
});

// Virtual for populated media
articleSchema.virtual('media', {
  ref: 'Media',
  localField: '_id',
  foreignField: 'articleId'
});

// Methods
articleSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return this.save();
};

articleSchema.methods.canBeEditedBy = function(authorId) {
  return this.authorId.toString() === authorId.toString() ||
         this.status === 'draft';
};

// Statics
articleSchema.statics.findPublished = function(filters = {}) {
  return this.find({
    status: 'published',
    publishedAt: { $lte: new Date() },
    ...filters
  });
};

module.exports = mongoose.model('Article', articleSchema);
```

---

## Middleware Examples

### 1. Auth Middleware (auth.js)

```javascript
const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');

module.exports = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'API key is required'
        }
      });
    }

    // Hash the API key
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Find API key in database
    const keyDoc = await ApiKey.findOne({
      keyHash,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    if (!keyDoc) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired API key'
        }
      });
    }

    // Check IP whitelist if configured
    if (keyDoc.allowedIps && keyDoc.allowedIps.length > 0) {
      const clientIp = req.ip || req.connection.remoteAddress;
      if (!keyDoc.allowedIps.includes(clientIp)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'IP address not allowed'
          }
        });
      }
    }

    // Update last used timestamp
    keyDoc.lastUsedAt = new Date();
    await keyDoc.save();

    // Attach API key info to request
    req.apiKey = keyDoc;

    next();
  } catch (error) {
    next(error);
  }
};
```

### 2. Rate Limit Middleware (rateLimit.js)

```javascript
const RateLimit = require('../models/RateLimit');

module.exports = async (req, res, next) => {
  try {
    const apiKey = req.apiKey;
    const endpoint = req.path;

    // Get current hour window
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

    // Find or create rate limit record
    let rateLimitDoc = await RateLimit.findOne({
      apiKeyId: apiKey._id,
      windowStart
    });

    if (!rateLimitDoc) {
      rateLimitDoc = new RateLimit({
        apiKeyId: apiKey._id,
        endpoint,
        requestCount: 0,
        windowStart
      });
    }

    // Check if limit exceeded
    if (rateLimitDoc.requestCount >= apiKey.rateLimitPerHour) {
      const resetTime = new Date(windowStart.getTime() + 3600000); // +1 hour

      res.set({
        'X-RateLimit-Limit': apiKey.rateLimitPerHour,
        'X-RateLimit-Remaining': 0,
        'X-RateLimit-Reset': Math.floor(resetTime.getTime() / 1000)
      });

      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit of ${apiKey.rateLimitPerHour} requests per hour exceeded`,
          retryAfter: Math.floor((resetTime - now) / 1000)
        }
      });
    }

    // Increment counter
    rateLimitDoc.requestCount += 1;
    await rateLimitDoc.save();

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': apiKey.rateLimitPerHour,
      'X-RateLimit-Remaining': apiKey.rateLimitPerHour - rateLimitDoc.requestCount,
      'X-RateLimit-Reset': Math.floor((windowStart.getTime() + 3600000) / 1000)
    });

    next();
  } catch (error) {
    next(error);
  }
};
```

---

## Controller Example (articlesController.js)

```javascript
const Article = require('../models/Article');
const Media = require('../models/Media');
const Tag = require('../models/Tag');
const { generateSlug, sanitizeHtml } = require('../utils/helpers');

// Get all articles
exports.getArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'published',
      type,
      category,
      country,
      language = 'en',
      tags,
      sortBy = 'latest'
    } = req.query;

    // Build query
    const query = { status };

    if (type) {
      const articleType = await ArticleType.findOne({ slug: type });
      if (articleType) {
        query.articleTypeId = articleType._id;
      }
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categoryIds = categoryDoc._id;
      }
    }

    if (country) {
      query.$or = [
        { isGlobal: true },
        { publishedCountries: country }
      ];
    }

    if (tags) {
      const tagSlugs = tags.split(',');
      const tagDocs = await Tag.find({ slug: { $in: tagSlugs } });
      if (tagDocs.length > 0) {
        query.tagIds = { $in: tagDocs.map(t => t._id) };
      }
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'popular':
        sort = { viewCount: -1 };
        break;
      case 'views':
        sort = { viewCount: -1 };
        break;
      case 'latest':
      default:
        sort = { publishedAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const articles = await Article.find(query)
      .populate('articleTypeId', 'slug name')
      .populate('authorId', 'name avatarUrl')
      .populate('categoryIds', 'slug name')
      .populate('tagIds', 'slug name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Article.countDocuments(query);

    // Get featured image for each article
    for (let article of articles) {
      const media = await Media.findOne({
        articleId: article._id,
        mediaType: 'image'
      }).sort({ displayOrder: 1 });

      if (media) {
        article.featuredImage = {
          url: media.url,
          altText: media.altText
        };
      }
    }

    res.json({
      success: true,
      data: {
        articles: articles.map(a => ({
          ...a,
          title: a.title[language] || a.title.en,
          excerpt: a.excerpt[language] || a.excerpt.en
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalArticles: total,
          hasMore: skip + articles.length < total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single article
exports.getArticle = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { language = 'en', country } = req.query;

    const article = await Article.findOne({ slug, status: 'published' })
      .populate('articleTypeId', 'slug name templateName schemaType')
      .populate('authorId', 'name bio avatarUrl expertise')
      .populate('categoryIds', 'slug name')
      .populate('tagIds', 'slug name')
      .lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ARTICLE_NOT_FOUND',
          message: `Article with slug '${slug}' not found`
        }
      });
    }

    // Check country access
    if (!article.isGlobal && country) {
      if (!article.publishedCountries.includes(country)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Article not available in your country'
          }
        });
      }
    }

    // Get media
    const media = await Media.find({ articleId: article._id })
      .sort({ displayOrder: 1 })
      .lean();

    // Get related articles
    const relatedArticles = await Article.find({
      _id: { $in: article.relatedArticleIds.map(r => r.articleId) },
      status: 'published'
    })
      .select('slug title excerpt')
      .limit(5)
      .lean();

    // Get related countries info
    if (article.relatedCountries && article.relatedCountries.length > 0) {
      const countries = await Country.find({
        code: { $in: article.relatedCountries.map(rc => rc.countryCode) }
      }).lean();

      article.relatedCountries = article.relatedCountries.map(rc => {
        const country = countries.find(c => c.code === rc.countryCode);
        return {
          ...rc,
          countryName: country ? country.name : rc.countryCode
        };
      });
    }

    res.json({
      success: true,
      data: {
        article: {
          ...article,
          media,
          relatedArticles
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create article
exports.createArticle = async (req, res, next) => {
  try {
    const articleData = req.body;

    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = generateSlug(articleData.title.en);
    }

    // Sanitize HTML content
    if (articleData.content) {
      for (let lang in articleData.content) {
        articleData.content[lang] = sanitizeHtml(articleData.content[lang]);
      }
    }

    // Create article
    const article = new Article({
      ...articleData,
      authorId: req.apiKey.ownerId || articleData.authorId
    });

    await article.save();

    res.status(201).json({
      success: true,
      data: {
        article: {
          _id: article._id,
          slug: article.slug,
          title: article.title,
          status: article.status,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt
        }
      },
      message: 'Article created successfully'
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: 'Article with this slug already exists'
        }
      });
    }
    next(error);
  }
};

// ... more controller methods
```

---

## Search Service Example (searchService.js)

```javascript
const Article = require('../models/Article');
const SearchQuery = require('../models/SearchQuery');

exports.searchArticles = async (filters) => {
  const {
    q,
    language = 'en',
    type,
    category,
    country,
    tags,
    page = 1,
    limit = 20
  } = filters;

  // Build search query
  const query = {
    status: 'published',
    $text: { $search: q }
  };

  // Apply filters (similar to getArticles controller)
  // ...

  // Execute search
  const articles = await Article.find(query, {
    score: { $meta: 'textScore' }
  })
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('articleTypeId categoryIds tagIds')
    .lean();

  // Log search query for analytics
  await SearchQuery.create({
    query: q,
    language,
    country,
    resultsCount: articles.length
  });

  return articles;
};

exports.getAutocomplete = async (q, language = 'en', limit = 10) => {
  // Aggregate popular search queries
  const suggestions = await SearchQuery.aggregate([
    {
      $match: {
        query: { $regex: `^${q}`, $options: 'i' },
        language
      }
    },
    {
      $group: {
        _id: '$query',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);

  return suggestions.map(s => ({
    text: s._id,
    count: s.count,
    type: 'article'
  }));
};
```

---

## Package.json Dependencies

```json
{
  "name": "greeneye-encyclopedia-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "seed": "node src/scripts/seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "redis": "^4.6.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",
    "slugify": "^1.6.6",
    "sanitize-html": "^2.11.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## Next Steps for Backend Team

1. ✅ Review MongoDB schema and API documentation
2. ✅ Set up Node.js + Express project structure
3. ✅ Create Mongoose models based on schema
4. ✅ Implement authentication and rate limiting middleware
5. ✅ Build API routes and controllers
6. ✅ Add validation using Joi
7. ✅ Implement search functionality
8. ✅ Set up file upload for media
9. ✅ Create seed scripts for initial data
10. ✅ Write unit tests
11. ✅ Deploy and test with frontend

---

## Questions or Issues?

Contact: backend@greeneye.com

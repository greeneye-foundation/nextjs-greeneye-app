# Environmental Encyclopedia - API Documentation

**Base URL**: `https://api.greeneye.com/v1`
**Authentication**: API Key via `X-API-Key` header
**Rate Limit**: Varies by API key type (100-1000 requests/hour)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Articles API](#articles-api)
3. [Categories API](#categories-api)
4. [Countries API](#countries-api)
5. [Tags API](#tags-api)
6. [Search API](#search-api)
7. [Media API](#media-api)
8. [Social Posts API](#social-posts-api)
9. [Admin/Workflow API](#adminworkflow-api)
10. [Analytics API](#analytics-api)
11. [Error Codes](#error-codes)

---

## Authentication

### Request Header
```
X-API-Key: your_api_key_here
```

### Response Codes
- `401` - Missing or invalid API key
- `403` - API key expired or inactive
- `429` - Rate limit exceeded

---

## Articles API

### 1. Get All Articles (Public)

**Endpoint**: `GET /articles`

**Query Parameters**:
```javascript
{
  page: Number, // Default: 1
  limit: Number, // Default: 20, Max: 100
  status: String, // "published" (default), "draft", "archived"
  type: String, // "plant", "topic", "policy", "product"
  category: String, // Category slug
  country: String, // Country code (IND, CHN, etc.)
  language: String, // "en" (default), "hi", "zh", "ar"
  tags: String, // Comma-separated tag slugs
  sortBy: String, // "latest" (default), "popular", "views"
}
```

**Example Request**:
```bash
GET /articles?type=plant&country=IND&language=en&page=1&limit=10
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "articles": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "slug": "mango-tree-cultivation",
        "title": {
          "en": "Mango Tree: Complete Guide to Cultivation",
          "hi": "आम का पेड़: खेती के लिए पूर्ण गाइड"
        },
        "excerpt": {
          "en": "Learn everything about growing mango trees..."
        },
        "articleType": {
          "_id": "507f1f77bcf86cd799439012",
          "slug": "plant",
          "name": { "en": "Plant" }
        },
        "author": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Dr. Rajesh Kumar",
          "avatarUrl": "https://..."
        },
        "categories": [
          {
            "_id": "507f1f77bcf86cd799439014",
            "slug": "plants",
            "name": { "en": "Plants" }
          }
        ],
        "tags": [
          {
            "_id": "507f1f77bcf86cd799439015",
            "slug": "fruit-trees",
            "name": { "en": "Fruit Trees" }
          }
        ],
        "featuredImage": {
          "url": "https://...",
          "altText": { "en": "Mango tree with fruits" }
        },
        "publishedAt": "2025-01-10T10:00:00Z",
        "viewCount": 1523,
        "isGlobal": true
      }
      // ... more articles
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 45,
      "totalArticles": 892,
      "hasMore": true
    }
  }
}
```

---

### 2. Get Single Article

**Endpoint**: `GET /articles/:slug`

**Path Parameters**:
- `slug`: Article slug (e.g., "mango-tree-cultivation")

**Query Parameters**:
```javascript
{
  language: String, // "en" (default), "hi", "zh", "ar"
  country: String // Optional: User's country code for relevance
}
```

**Example Request**:
```bash
GET /articles/mango-tree-cultivation?language=en&country=IND
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "article": {
      "_id": "507f1f77bcf86cd799439011",
      "slug": "mango-tree-cultivation",
      "title": {
        "en": "Mango Tree: Complete Guide to Cultivation"
      },
      "content": {
        "en": "<h2>Introduction</h2><p>The mango tree...</p>"
      },
      "excerpt": {
        "en": "Learn everything about growing mango trees..."
      },
      "articleType": { "slug": "plant", "name": { "en": "Plant" } },
      "author": {
        "name": "Dr. Rajesh Kumar",
        "bio": "Botanist with 20 years experience",
        "avatarUrl": "https://...",
        "expertise": ["Botany", "Horticulture"]
      },
      "categories": [
        { "slug": "plants", "name": { "en": "Plants" } },
        { "slug": "fruit-trees", "name": { "en": "Fruit Trees" } }
      ],
      "tags": [
        { "slug": "tropical-plants", "name": { "en": "Tropical Plants" } },
        { "slug": "fruit-trees", "name": { "en": "Fruit Trees" } }
      ],

      // Type-specific data (for plant articles)
      "typeData": {
        "plant": {
          "scientificName": "Mangifera indica",
          "commonNames": {
            "en": ["Mango", "Common Mango"],
            "hi": ["आम", "अम्ब"]
          },
          "family": "Anacardiaceae",
          "genus": "Mangifera",
          "nativeRegions": ["India", "Southeast Asia"],
          "climateZones": ["Tropical", "Subtropical"],
          "careLevel": "moderate",
          "waterRequirements": "moderate",
          "sunlightRequirements": "full_sun",
          "soilType": "Well-drained loamy soil",
          "growthRate": "moderate",
          "matureHeightCm": 1000,
          "matureWidthCm": 800,
          "floweringSeason": "December to February",
          "environmentalBenefits": [
            "Carbon sequestration",
            "Provides shade",
            "Supports wildlife"
          ],
          "medicinalUses": "Rich in vitamins, antioxidants",
          "conservationStatus": "LC"
        }
      },

      // Media (images and videos)
      "media": [
        {
          "_id": "507f1f77bcf86cd799439020",
          "mediaType": "image",
          "url": "https://cdn.greeneye.com/mango-tree-1.jpg",
          "thumbnailUrl": "https://cdn.greeneye.com/mango-tree-1-thumb.jpg",
          "caption": { "en": "Mature mango tree in full bloom" },
          "altText": { "en": "Mango tree with white flowers" },
          "credits": "Photo by John Doe",
          "displayOrder": 0
        },
        {
          "_id": "507f1f77bcf86cd799439021",
          "mediaType": "youtube_video",
          "url": "https://www.youtube.com/watch?v=xyz123",
          "embedCode": "<iframe src='...'></iframe>",
          "thumbnailUrl": "https://img.youtube.com/vi/xyz123/0.jpg",
          "title": { "en": "How to Grow Mango Tree from Seed" },
          "displayOrder": 1
        }
      ],

      // Related articles
      "relatedArticles": [
        {
          "_id": "507f1f77bcf86cd799439022",
          "slug": "guava-tree-care",
          "title": { "en": "Guava Tree Care Guide" },
          "excerpt": { "en": "Complete guide to growing guava..." },
          "featuredImage": { "url": "https://..." },
          "relationshipType": "similar"
        }
      ],

      // Related countries
      "relatedCountries": [
        {
          "countryCode": "IND",
          "countryName": "India",
          "relevance": "primary"
        }
      ],

      // SEO
      "metaTitle": { "en": "Mango Tree Cultivation Guide - Complete Care Instructions" },
      "metaDescription": { "en": "Learn how to grow and care for mango trees..." },
      "keywords": ["mango tree", "cultivation", "tropical fruit"],

      // Publishing info
      "isGlobal": true,
      "publishedAt": "2025-01-10T10:00:00Z",
      "updatedAt": "2025-01-12T15:30:00Z",
      "viewCount": 1523,
      "shareCount": 45
    }
  }
}
```

**Error Response** (`404 Not Found`):
```javascript
{
  "success": false,
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article with slug 'mango-tree-cultivation' not found"
  }
}
```

---

### 3. Create Article (Admin/Bot)

**Endpoint**: `POST /articles`

**Authentication**: Required (Admin or Bot role)

**Request Body**:
```javascript
{
  "slug": "solar-panels-india-2025",
  "articleTypeId": "507f1f77bcf86cd799439012", // or slug: "product"
  "title": {
    "en": "Best Solar Panels in India 2025",
    "hi": "2025 में भारत के सर्वश्रेष्ठ सोलर पैनल"
  },
  "excerpt": {
    "en": "Comprehensive guide to choosing solar panels in India...",
    "hi": "भारत में सोलर पैनल चुनने के लिए व्यापक गाइड..."
  },
  "content": {
    "en": "<h2>Introduction</h2><p>Solar energy is...</p>",
    "hi": "<h2>परिचय</h2><p>सौर ऊर्जा...</p>"
  },
  "authorId": "507f1f77bcf86cd799439013",
  "status": "draft", // or "pending_review", "published"
  "isGlobal": false,
  "publishedCountries": ["IND"],
  "categoryIds": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"],
  "tagIds": ["507f1f77bcf86cd799439016"],

  // Type-specific data (for product)
  "typeData": {
    "product": {
      "productName": "Luminous Solar Panel 500W",
      "manufacturer": "Luminous Power Technologies",
      "category": "Solar Panels",
      "availableCountries": ["IND"],
      "certifications": ["ISO 9001", "BIS"],
      "priceRangeMin": 15000,
      "priceRangeMax": 18000,
      "currency": "INR",
      "ecoRating": 4.5,
      "recyclable": true,
      "websiteUrl": "https://www.luminousindia.com"
    }
  },

  "metaTitle": {
    "en": "Best Solar Panels in India 2025 - Reviews & Buying Guide"
  },
  "metaDescription": {
    "en": "Find the best solar panels in India. Compare prices, efficiency, and warranties..."
  },
  "keywords": ["solar panels", "India", "renewable energy", "2025"]
}
```

**Response** (`201 Created`):
```javascript
{
  "success": true,
  "data": {
    "article": {
      "_id": "507f1f77bcf86cd799439030",
      "slug": "solar-panels-india-2025",
      "title": { "en": "Best Solar Panels in India 2025" },
      "status": "draft",
      "createdAt": "2025-01-13T10:00:00Z",
      "updatedAt": "2025-01-13T10:00:00Z"
    }
  },
  "message": "Article created successfully"
}
```

**Error Response** (`400 Bad Request`):
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title.en",
        "message": "English title is required"
      },
      {
        "field": "slug",
        "message": "Slug already exists"
      }
    ]
  }
}
```

---

### 4. Update Article

**Endpoint**: `PUT /articles/:id` or `PATCH /articles/:id`

**Authentication**: Required (Admin or Author)

**Request Body**: Same as Create Article (partial updates allowed for PATCH)

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "article": {
      "_id": "507f1f77bcf86cd799439030",
      "slug": "solar-panels-india-2025",
      "status": "pending_review",
      "updatedAt": "2025-01-13T11:00:00Z"
    }
  },
  "message": "Article updated successfully"
}
```

---

### 5. Delete Article

**Endpoint**: `DELETE /articles/:id`

**Authentication**: Required (Admin only)

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "message": "Article deleted successfully"
}
```

---

### 6. Submit Article for Review

**Endpoint**: `POST /articles/:id/submit-review`

**Authentication**: Required (Author)

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "article": {
      "_id": "507f1f77bcf86cd799439030",
      "status": "pending_review"
    }
  },
  "message": "Article submitted for review"
}
```

---

### 7. Publish Article

**Endpoint**: `POST /articles/:id/publish`

**Authentication**: Required (Admin only)

**Request Body**:
```javascript
{
  "publishedAt": "2025-01-15T10:00:00Z" // Optional: schedule for future
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "article": {
      "_id": "507f1f77bcf86cd799439030",
      "status": "published",
      "publishedAt": "2025-01-15T10:00:00Z"
    }
  },
  "message": "Article published successfully"
}
```

---

### 8. Archive Article

**Endpoint**: `POST /articles/:id/archive`

**Authentication**: Required (Admin only)

**Request Body**:
```javascript
{
  "archiveNote": "Policy repealed in 2025"
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "article": {
      "_id": "507f1f77bcf86cd799439030",
      "status": "archived",
      "archivedAt": "2025-01-13T12:00:00Z"
    }
  },
  "message": "Article archived successfully"
}
```

---

## Categories API

### 1. Get All Categories

**Endpoint**: `GET /categories`

**Query Parameters**:
```javascript
{
  language: String, // "en" (default), "hi", "zh", "ar"
  parentId: String, // Get subcategories of a parent (optional)
  includeInactive: Boolean // Default: false (Admin only)
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "slug": "plants",
        "name": { "en": "Plants", "hi": "पौधे" },
        "description": { "en": "Information about plants and trees" },
        "icon": "fa-seedling",
        "parentId": null,
        "subcategories": [
          {
            "_id": "507f1f77bcf86cd799439040",
            "slug": "fruit-trees",
            "name": { "en": "Fruit Trees" },
            "parentId": "507f1f77bcf86cd799439014"
          }
        ],
        "articleCount": 234,
        "displayOrder": 1
      }
    ]
  }
}
```

---

### 2. Create Category (Admin)

**Endpoint**: `POST /categories`

**Request Body**:
```javascript
{
  "slug": "air-pollution",
  "name": {
    "en": "Air Pollution",
    "hi": "वायु प्रदूषण",
    "zh": "空气污染",
    "ar": "تلوث الهواء"
  },
  "description": {
    "en": "Topics related to air quality and pollution"
  },
  "icon": "fa-wind",
  "parentId": "507f1f77bcf86cd799439014", // Optional
  "displayOrder": 5
}
```

**Response** (`201 Created`):
```javascript
{
  "success": true,
  "data": {
    "category": {
      "_id": "507f1f77bcf86cd799439050",
      "slug": "air-pollution",
      "name": { "en": "Air Pollution" }
    }
  },
  "message": "Category created successfully"
}
```

---

## Countries API

### 1. Get All Countries

**Endpoint**: `GET /countries`

**Query Parameters**:
```javascript
{
  language: String // "en" (default), "hi", "zh", "ar"
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "countries": [
      {
        "_id": "507f1f77bcf86cd799439060",
        "code": "IND",
        "name": "India",
        "nativeName": "भारत",
        "flagEmoji": "🇮🇳",
        "capital": "New Delhi",
        "languages": ["English", "Hindi"],
        "articleCount": 567
      }
    ]
  }
}
```

---

### 2. Get Country Details

**Endpoint**: `GET /countries/:code`

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "country": {
      "_id": "507f1f77bcf86cd799439060",
      "code": "IND",
      "name": "India",
      "nativeName": "भारत",
      "flagEmoji": "🇮🇳",
      "overview": "India is the world's largest democracy...",
      "capital": "New Delhi",
      "population": 1400000000,
      "areaKm2": 3287263,
      "languages": ["English", "Hindi"],

      // Related content counts
      "stats": {
        "totalArticles": 567,
        "plants": 123,
        "policies": 45,
        "topics": 234,
        "products": 165
      },

      // Recent articles
      "recentArticles": [
        {
          "_id": "...",
          "slug": "...",
          "title": { "en": "..." }
        }
      ]
    }
  }
}
```

---

## Tags API

### 1. Get All Tags

**Endpoint**: `GET /tags`

**Query Parameters**:
```javascript
{
  language: String, // "en" (default)
  popular: Boolean, // Get most used tags
  limit: Number // Default: 50
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "tags": [
      {
        "_id": "507f1f77bcf86cd799439070",
        "slug": "renewable-energy",
        "name": { "en": "Renewable Energy", "hi": "नवीकरणीय ऊर्जा" },
        "usageCount": 145
      }
    ]
  }
}
```

---

### 2. Create Tag (Auto-created or Admin)

**Endpoint**: `POST /tags`

**Request Body**:
```javascript
{
  "slug": "climate-change",
  "name": {
    "en": "Climate Change",
    "hi": "जलवायु परिवर्तन"
  }
}
```

**Response** (`201 Created`):
```javascript
{
  "success": true,
  "data": {
    "tag": {
      "_id": "507f1f77bcf86cd799439080",
      "slug": "climate-change",
      "name": { "en": "Climate Change" }
    }
  }
}
```

---

## Search API

### 1. Search Articles

**Endpoint**: `GET /search`

**Query Parameters**:
```javascript
{
  q: String, // Search query (required)
  language: String, // "en" (default)
  type: String, // "plant", "topic", "policy", "product"
  category: String, // Category slug
  country: String, // Country code
  tags: String, // Comma-separated tag slugs
  yearFrom: Number, // For policies
  yearTo: Number,
  page: Number,
  limit: Number
}
```

**Example Request**:
```bash
GET /search?q=solar+energy&type=product&country=IND&language=en
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "query": "solar energy",
    "results": [
      {
        "_id": "507f1f77bcf86cd799439090",
        "slug": "solar-panels-india-2025",
        "title": { "en": "Best Solar Panels in India 2025" },
        "excerpt": { "en": "..." },
        "type": "product",
        "highlight": "...Best <em>Solar</em> Panels...",
        "relevanceScore": 0.95
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalResults": 45
    },
    "facets": {
      "types": [
        { "type": "product", "count": 25 },
        { "type": "topic", "count": 15 },
        { "type": "policy", "count": 5 }
      ],
      "countries": [
        { "code": "IND", "name": "India", "count": 30 },
        { "code": "CHN", "name": "China", "count": 10 }
      ]
    }
  }
}
```

---

### 2. Autocomplete Suggestions

**Endpoint**: `GET /search/autocomplete`

**Query Parameters**:
```javascript
{
  q: String, // Partial query (min 2 chars)
  language: String,
  limit: Number // Default: 10
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "text": "solar panels",
        "type": "article",
        "count": 45
      },
      {
        "text": "solar energy policy",
        "type": "article",
        "count": 12
      }
    ]
  }
}
```

---

## Media API

### 1. Upload Media (Admin/Author)

**Endpoint**: `POST /media/upload`

**Authentication**: Required

**Request**: Multipart form-data

```javascript
{
  articleId: String,
  file: File,
  mediaType: String, // "image"
  title: Object, // {"en": "..."}
  caption: Object,
  altText: Object,
  credits: String,
  displayOrder: Number
}
```

**Response** (`201 Created`):
```javascript
{
  "success": true,
  "data": {
    "media": {
      "_id": "507f1f77bcf86cd799439100",
      "url": "https://cdn.greeneye.com/uploads/image123.jpg",
      "thumbnailUrl": "https://cdn.greeneye.com/uploads/image123-thumb.jpg",
      "mediaType": "image",
      "width": 1920,
      "height": 1080,
      "fileSizeKb": 450
    }
  }
}
```

---

### 2. Add Video Embed

**Endpoint**: `POST /media/embed`

**Request Body**:
```javascript
{
  "articleId": "507f1f77bcf86cd799439030",
  "mediaType": "youtube_video",
  "url": "https://www.youtube.com/watch?v=xyz123",
  "title": { "en": "How to Install Solar Panels" },
  "displayOrder": 1
}
```

**Response** (`201 Created`):
```javascript
{
  "success": true,
  "data": {
    "media": {
      "_id": "507f1f77bcf86cd799439110",
      "mediaType": "youtube_video",
      "url": "https://www.youtube.com/watch?v=xyz123",
      "embedCode": "<iframe width='560' height='315' src='https://www.youtube.com/embed/xyz123'></iframe>",
      "thumbnailUrl": "https://img.youtube.com/vi/xyz123/maxresdefault.jpg"
    }
  }
}
```

---

### 3. Delete Media

**Endpoint**: `DELETE /media/:id`

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "message": "Media deleted successfully"
}
```

---

## Social Posts API

### 1. Generate Social Posts (Auto)

**Endpoint**: `POST /articles/:id/social-posts/generate`

**Request Body**:
```javascript
{
  "platforms": ["twitter", "facebook", "instagram", "linkedin"],
  "language": "en"
}
```

**Response** (`201 Created`):
```javascript
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "507f1f77bcf86cd799439120",
        "platform": "twitter",
        "content": {
          "en": "🌱 Discover the complete guide to growing Mango Trees! From planting to harvesting, learn everything you need to know. #MangoTree #Gardening #SustainableLiving"
        },
        "hashtags": ["#MangoTree", "#Gardening", "#SustainableLiving"],
        "isAutoGenerated": true,
        "status": "draft",
        "characterCount": 178
      },
      {
        "_id": "507f1f77bcf86cd799439121",
        "platform": "facebook",
        "content": {
          "en": "🥭 Want to grow your own mango tree? Our comprehensive guide covers everything from choosing the right variety to caring for your tree throughout the seasons. Perfect for home gardeners and farming enthusiasts! Read more: [link]"
        },
        "isAutoGenerated": true,
        "status": "draft"
      }
    ]
  }
}
```

---

### 2. Update Social Post

**Endpoint**: `PUT /social-posts/:id`

**Request Body**:
```javascript
{
  "content": {
    "en": "Updated tweet text with custom message #Custom #Tags"
  },
  "hashtags": ["#Custom", "#Tags"],
  "status": "ready"
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "post": {
      "_id": "507f1f77bcf86cd799439120",
      "platform": "twitter",
      "content": { "en": "Updated tweet text..." },
      "isAutoGenerated": false,
      "status": "ready"
    }
  }
}
```

---

## Admin/Workflow API

### 1. Get Pending Reviews

**Endpoint**: `GET /admin/reviews/pending`

**Authentication**: Required (Admin)

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "articles": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "slug": "solar-panels-india-2025",
        "title": { "en": "Best Solar Panels in India 2025" },
        "author": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "submittedAt": "2025-01-13T10:00:00Z",
        "status": "pending_review"
      }
    ]
  }
}
```

---

### 2. Approve Article

**Endpoint**: `POST /admin/reviews/:articleId/approve`

**Request Body**:
```javascript
{
  "comments": "Looks good! Minor edits done."
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "review": {
      "_id": "507f1f77bcf86cd799439130",
      "articleId": "507f1f77bcf86cd799439030",
      "reviewerId": "507f1f77bcf86cd799439013",
      "status": "approved",
      "comments": "Looks good!",
      "reviewedAt": "2025-01-13T14:00:00Z"
    },
    "article": {
      "status": "published"
    }
  },
  "message": "Article approved and published"
}
```

---

### 3. Reject Article

**Endpoint**: `POST /admin/reviews/:articleId/reject`

**Request Body**:
```javascript
{
  "status": "rejected", // or "needs_changes"
  "comments": "Please add more references and improve the introduction section."
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "review": {
      "_id": "507f1f77bcf86cd799439131",
      "status": "rejected",
      "comments": "Please add more references..."
    },
    "article": {
      "status": "draft"
    }
  },
  "message": "Article rejected with feedback"
}
```

---

## Analytics API

### 1. Get Article Analytics

**Endpoint**: `GET /analytics/articles/:id`

**Authentication**: Required (Admin/Author)

**Query Parameters**:
```javascript
{
  dateFrom: String, // ISO date
  dateTo: String,
  groupBy: String // "day", "week", "month"
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "article": {
      "_id": "507f1f77bcf86cd799439030",
      "title": { "en": "Solar Panels India 2025" }
    },
    "analytics": {
      "totalViews": 15234,
      "totalShares": 456,
      "viewsByCountry": [
        { "code": "IND", "name": "India", "views": 12000 },
        { "code": "USA", "name": "United States", "views": 2000 }
      ],
      "viewsByLanguage": [
        { "language": "en", "views": 10000 },
        { "language": "hi", "views": 5234 }
      ],
      "viewsTimeline": [
        { "date": "2025-01-10", "views": 1200 },
        { "date": "2025-01-11", "views": 1500 }
      ],
      "topReferrers": [
        { "source": "google.com", "visits": 8000 },
        { "source": "facebook.com", "visits": 3000 }
      ]
    }
  }
}
```

---

### 2. Get Popular Searches

**Endpoint**: `GET /analytics/searches`

**Query Parameters**:
```javascript
{
  dateFrom: String,
  dateTo: String,
  country: String,
  language: String,
  limit: Number // Default: 50
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "data": {
    "searches": [
      {
        "query": "solar panels",
        "count": 1234,
        "avgResultsCount": 45,
        "clickThroughRate": 0.68
      },
      {
        "query": "mango tree care",
        "count": 890,
        "avgResultsCount": 23,
        "clickThroughRate": 0.75
      }
    ]
  }
}
```

---

### 3. Track Article View

**Endpoint**: `POST /analytics/track/view`

**Request Body**:
```javascript
{
  "articleId": "507f1f77bcf86cd799439030",
  "countryCode": "IND",
  "language": "en",
  "referer": "https://google.com"
}
```

**Response** (`200 OK`):
```javascript
{
  "success": true,
  "message": "View tracked"
}
```

---

## Error Codes

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Custom Error Codes

```javascript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [] // Optional: validation errors
  }
}
```

**Error Codes**:
- `VALIDATION_ERROR` - Request validation failed
- `ARTICLE_NOT_FOUND` - Article doesn't exist
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `RATE_LIMIT_EXCEEDED` - API rate limit reached
- `DUPLICATE_SLUG` - Slug already exists
- `INVALID_STATUS_TRANSITION` - Cannot change status (e.g., archived → published)
- `MEDIA_LIMIT_EXCEEDED` - More than 10 media items
- `INVALID_COUNTRY_CODE` - Country code doesn't exist
- `INVALID_LANGUAGE` - Unsupported language

---

## Rate Limiting

**Headers in Response**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1620000000
```

**Rate Limit Exceeded Response** (`429`):
```javascript
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit of 1000 requests per hour exceeded",
    "retryAfter": 3600
  }
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response includes**:
```javascript
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 45,
    "totalItems": 892,
    "itemsPerPage": 20,
    "hasMore": true,
    "nextPage": 2,
    "prevPage": null
  }
}
```

---

## Webhooks (Optional)

Configure webhooks to receive notifications:

**Events**:
- `article.published`
- `article.submitted_for_review`
- `article.approved`
- `article.rejected`

**Webhook Payload**:
```javascript
{
  "event": "article.published",
  "timestamp": "2025-01-13T10:00:00Z",
  "data": {
    "articleId": "507f1f77bcf86cd799439030",
    "slug": "solar-panels-india-2025",
    "title": { "en": "..." }
  }
}
```

---

## Notes for Frontend Integration

1. **Multi-language Support**: Always send `language` parameter based on user's selected language
2. **Country Detection**: Send user's `country` code for personalized content
3. **SEO**: Use `metaTitle`, `metaDescription`, and structured data from API responses
4. **Media**: Display images in order of `displayOrder`
5. **Social Sharing**: Use pre-generated social posts or excerpt for sharing
6. **Analytics**: Call track/view endpoint on article page load (client-side or server-side)
7. **Search**: Implement autocomplete with debouncing (300ms)
8. **Error Handling**: Always handle API errors gracefully and show user-friendly messages

---

**Last Updated**: January 13, 2025
**API Version**: v1
**Contact**: api@greeneye.com

// Encyclopedia API Client

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const API_KEY = process.env.NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY;

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api/encyclopedia${endpoint}`;

  const isFormData = options.body instanceof FormData;
  const config = {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      'x-api-key': API_KEY,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// ============================================
// ARTICLES API
// ============================================

export const articlesAPI = {
  // Get all articles with filters
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/articles?${query}`);
  },

  // Get single article by slug
  getBySlug: async (slug) => {
    return apiRequest(`/articles/${slug}`);
  },

  // Create new article
  create: async (articleData) => {
    return apiRequest('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  // Update article
  update: async (slug, articleData) => {
    return apiRequest(`/articles/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  // Delete article
  delete: async (slug) => {
    return apiRequest(`/articles/${slug}`, {
      method: 'DELETE',
    });
  },

  // Publish article
  publish: async (slug) => {
    return apiRequest(`/articles/${slug}/publish`, {
      method: 'POST',
    });
  },

  // Bulk operations
  bulkUpdate: async (action, articleIds) => {
    return apiRequest('/articles/bulk', {
      method: 'POST',
      body: JSON.stringify({ action, articleIds }),
    });
  },
};

// ============================================
// CATEGORIES API
// ============================================

export const categoriesAPI = {
  // Get all categories
  getAll: async (language = 'en') => {
    return apiRequest(`/categories?language=${language}`);
  },

  // Get single category
  getBySlug: async (slug, language = 'en') => {
    return apiRequest(`/categories/${slug}?language=${language}`);
  },

  // Create category
  create: async (categoryData) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category
  update: async (slug, categoryData) => {
    return apiRequest(`/categories/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category
  delete: async (slug) => {
    return apiRequest(`/categories/${slug}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// TAGS API
// ============================================

export const tagsAPI = {
  // Get all tags
  getAll: async (language = 'en') => {
    return apiRequest(`/tags?language=${language}`);
  },

  // Get single tag
  getBySlug: async (slug, language = 'en') => {
    return apiRequest(`/tags/${slug}?language=${language}`);
  },

  // Create tag
  create: async (tagData) => {
    return apiRequest('/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  },

  // Update tag
  update: async (slug, tagData) => {
    return apiRequest(`/tags/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(tagData),
    });
  },

  // Delete tag
  delete: async (slug) => {
    return apiRequest(`/tags/${slug}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// COUNTRIES API
// ============================================

export const countriesAPI = {
  // Get all countries
  getAll: async (language = 'en') => {
    return apiRequest(`/countries?language=${language}`);
  },

  // Get single country
  getByCode: async (code, language = 'en') => {
    return apiRequest(`/countries/${code}?language=${language}`);
  },

  // Create country
  create: async (countryData) => {
    return apiRequest('/countries', {
      method: 'POST',
      body: JSON.stringify(countryData),
    });
  },

  // Update country
  update: async (code, countryData) => {
    return apiRequest(`/countries/${code}`, {
      method: 'PUT',
      body: JSON.stringify(countryData),
    });
  },

  // Delete country
  delete: async (code) => {
    return apiRequest(`/countries/${code}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// SEARCH API
// ============================================

export const searchAPI = {
  // Search articles
  search: async (query, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params }).toString();
    return apiRequest(`/search?${searchParams}`);
  },

  // Autocomplete
  autocomplete: async (query, language = 'en') => {
    return apiRequest(`/search/autocomplete?q=${query}&language=${language}`);
  },

  // Get trending searches
  trending: async (language = 'en') => {
    return apiRequest(`/search/trending?language=${language}`);
  },
};

// ============================================
// MEDIA API
// ============================================

export const mediaAPI = {
  // Get all media
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/media?${query}`);
  },

  // Get article media
  getByArticle: async (articleSlug) => {
    return apiRequest(`/media/article/${articleSlug}`);
  },

  // Upload images
  uploadMedia: async (articleSlug, formData) => {
    return apiRequest(`/media/article/${articleSlug}`, {
      method: 'POST',
      body: formData, // Don't set Content-Type, let browser handle it
    });
  },

  // Add video/social media
  addMedia: async (articleSlug, mediaData) => {
    return apiRequest(`/media/article/${articleSlug}`, {
      method: 'POST',
      body: JSON.stringify(mediaData),
    });
  },

  // Update media
  updateMedia: async (mediaId, updates) => {
    return apiRequest(`/media/${mediaId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete media
  deleteMedia: async (mediaId) => {
    return apiRequest(`/media/${mediaId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsAPI = {
  // Get article analytics
  getArticleAnalytics: async (slug, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics/article/${slug}?${query}`);
  },

  // Get popular articles
  getPopular: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics/popular?${query}`);
  },

  // Get search analytics
  getSearchAnalytics: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics/search?${query}`);
  },

  // Get platform analytics
  getPlatformAnalytics: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics/platform?${query}`);
  },
};

// ============================================
// AUTHORS API (assuming it exists or will be created)
// ============================================

export const authorsAPI = {
  // Get all authors
  getAll: async () => {
    return apiRequest('/authors');
  },

  // Get single author
  getById: async (authorId) => {
    return apiRequest(`/authors/${authorId}`);
  },
};

// ============================================
// ARTICLE TYPES API
// ============================================

export const articleTypesAPI = {
  // Get all article types
  getAll: async (language = 'en') => {
    return apiRequest(`/article-types?language=${language}`);
  },

  // Get single article type
  getBySlug: async (slug, language = 'en') => {
    return apiRequest(`/article-types/${slug}?language=${language}`);
  },
};

// Export all APIs
export default {
  articles: articlesAPI,
  categories: categoriesAPI,
  tags: tagsAPI,
  countries: countriesAPI,
  search: searchAPI,
  media: mediaAPI,
  analytics: analyticsAPI,
  authors: authorsAPI,
  articleTypes: articleTypesAPI,
};

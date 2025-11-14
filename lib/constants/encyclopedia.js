// Encyclopedia Constants

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦'
  }
];

export const COUNTRIES = [
  {
    code: 'IND',
    name: 'India',
    nativeName: 'भारत',
    flagEmoji: '🇮🇳'
  },
  {
    code: 'CHN',
    name: 'China',
    nativeName: '中国',
    flagEmoji: '🇨🇳'
  },
  {
    code: 'ARE',
    name: 'United Arab Emirates',
    nativeName: 'الإمارات العربية المتحدة',
    flagEmoji: '🇦🇪'
  },
  {
    code: 'USA',
    name: 'United States',
    nativeName: 'United States',
    flagEmoji: '🇺🇸'
  },
  {
    code: 'BRA',
    name: 'Brazil',
    nativeName: 'Brasil',
    flagEmoji: '🇧🇷'
  }
];

export const ARTICLE_TYPES = {
  PLANT: 'plant',
  TOPIC: 'topic',
  POLICY: 'policy',
  PRODUCT: 'product'
};

export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const CARE_LEVELS = {
  EASY: 'easy',
  MODERATE: 'moderate',
  DIFFICULT: 'difficult'
};

export const WATER_REQUIREMENTS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high'
};

export const SUNLIGHT_REQUIREMENTS = {
  FULL_SUN: 'full_sun',
  PARTIAL_SHADE: 'partial_shade',
  FULL_SHADE: 'full_shade'
};

export const GROWTH_RATES = {
  SLOW: 'slow',
  MODERATE: 'moderate',
  FAST: 'fast'
};

export const CONSERVATION_STATUS = {
  LC: 'Least Concern',
  NT: 'Near Threatened',
  VU: 'Vulnerable',
  EN: 'Endangered',
  CR: 'Critically Endangered',
  EW: 'Extinct in the Wild',
  EX: 'Extinct'
};

export const POLICY_STATUS = {
  ACTIVE: 'active',
  REPEALED: 'repealed',
  UNDER_REVIEW: 'under_review',
  PROPOSED: 'proposed'
};

export const POLICY_TYPES = {
  LEGISLATION: 'legislation',
  REGULATION: 'regulation',
  TREATY: 'treaty',
  GUIDELINE: 'guideline',
  OTHER: 'other'
};

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const MEDIA_TYPES = {
  IMAGE: 'image',
  YOUTUBE_VIDEO: 'youtube_video',
  YOUTUBE_SHORT: 'youtube_short',
  INSTAGRAM_REEL: 'instagram_reel'
};

export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin'
};

// Character limits for social media
export const SOCIAL_LIMITS = {
  twitter: 280,
  facebook: 63206, // Very high, but best practice is around 400
  instagram: 2200,
  linkedin: 3000
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// Icons for categories
export const CATEGORY_ICONS = {
  plants: 'fa-seedling',
  topics: 'fa-globe',
  policies: 'fa-file-contract',
  products: 'fa-leaf',
  'climate-change': 'fa-temperature-high',
  'biodiversity': 'fa-paw',
  'pollution': 'fa-smog',
  'renewable-energy': 'fa-solar-panel',
  'conservation': 'fa-shield-alt'
};

// Color schemes for article types
export const TYPE_COLORS = {
  plant: {
    primary: '#2ecc71',
    light: '#a8e6cf',
    dark: '#27ae60'
  },
  topic: {
    primary: '#3498db',
    light: '#a8d8ff',
    dark: '#2980b9'
  },
  policy: {
    primary: '#e74c3c',
    light: '#ffb3b3',
    dark: '#c0392b'
  },
  product: {
    primary: '#f39c12',
    light: '#ffe4b3',
    dark: '#d68910'
  }
};

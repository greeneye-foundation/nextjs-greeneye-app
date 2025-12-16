// Encyclopedia Constants - Complete Version

// ============================================
// SUPPORTED LANGUAGES
// ============================================
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇦🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵' }
];

// ============================================
// COUNTRIES
// ============================================
export const COUNTRIES = [
  { code: 'IND', name: 'India', nativeName: 'भारत', flag: '🇮🇳', continent: 'Asia' },
  { code: 'CHN', name: 'China', nativeName: '中国', flag: '🇨🇳', continent: 'Asia' },
  { code: 'ARE', name: 'UAE', nativeName: 'الإمارات', flag: '🇦🇪', continent: 'Asia' },
  { code: 'USA', name: 'United States', nativeName: 'United States', flag: '🇺🇸', continent: 'North America' },
  { code: 'BRA', name: 'Brazil', nativeName: 'Brasil', flag: '🇧🇷', continent: 'South America' },
  { code: 'GBR', name: 'United Kingdom', nativeName: 'United Kingdom', flag: '🇬🇧', continent: 'Europe' },
  { code: 'FRA', name: 'France', nativeName: 'France', flag: '🇫🇷', continent: 'Europe' },
  { code: 'DEU', name: 'Germany', nativeName: 'Deutschland', flag: '🇩🇪', continent: 'Europe' },
  { code: 'JPN', name: 'Japan', nativeName: '日本', flag: '🇯🇵', continent: 'Asia' },
  { code: 'AUS', name: 'Australia', nativeName: 'Australia', flag: '🇦🇺', continent: 'Oceania' },
  { code: 'CAN', name: 'Canada', nativeName: 'Canada', flag: '🇨🇦', continent: 'North America' },
  { code: 'MEX', name: 'Mexico', nativeName: 'México', flag: '🇲🇽', continent: 'North America' },
  { code: 'RUS', name: 'Russia', nativeName: 'Россия', flag: '🇷🇺', continent: 'Europe/Asia' },
  { code: 'ZAF', name: 'South Africa', nativeName: 'South Africa', flag: '🇿🇦', continent: 'Africa' }
];

// ============================================
// ARTICLE TYPES
// ============================================
export const ARTICLE_TYPES = [
  {
    slug: 'plant',
    name: { en: 'Plant', hi: 'पौधा', zh: '植物', ar: 'نبات' },
    icon: 'fa-leaf',
    color: '#4CAF50',
    description: { en: 'Trees, shrubs, herbs, and other flora' }
  },
  {
    slug: 'topic',
    name: { en: 'Topic', hi: 'विषय', zh: '话题', ar: 'موضوع' },
    icon: 'fa-lightbulb',
    color: '#2196F3',
    description: { en: 'Environmental topics and concepts' }
  },
  {
    slug: 'policy',
    name: { en: 'Policy', hi: 'नीति', zh: '政策', ar: 'سياسة' },
    icon: 'fa-gavel',
    color: '#FF9800',
    description: { en: 'Environmental laws and regulations' }
  },
  {
    slug: 'product',
    name: { en: 'Product', hi: 'उत्पाद', zh: '产品', ar: 'منتج' },
    icon: 'fa-shopping-bag',
    color: '#9C27B0',
    description: { en: 'Eco-friendly products and solutions' }
  }
];

// ============================================
// ARTICLE STATUS
// ============================================
export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// ============================================
// TYPE COLORS
// ============================================
export const TYPE_COLORS = {
  plant: { primary: '#4CAF50', secondary: '#81C784', light: '#C8E6C9' },
  topic: { primary: '#2196F3', secondary: '#64B5F6', light: '#BBDEFB' },
  policy: { primary: '#FF9800', secondary: '#FFB74D', light: '#FFE0B2' },
  product: { primary: '#9C27B0', secondary: '#BA68C8', light: '#E1BEE7' }
};

// ============================================
// STATUS COLORS
// ============================================
export const STATUS_COLORS = {
  draft: { bg: '#FFF3CD', text: '#856404', icon: 'fa-file-alt' },
  pending_review: { bg: '#D1ECF1', text: '#0C5460', icon: 'fa-clock' },
  published: { bg: '#D4EDDA', text: '#155724', icon: 'fa-check-circle' },
  archived: { bg: '#F8D7DA', text: '#721C24', icon: 'fa-archive' }
};

// ============================================
// PLANT CARE LEVELS
// ============================================
export const CARE_LEVELS = [
  { value: 'easy', label: 'Easy', description: 'Low maintenance, beginner-friendly' },
  { value: 'moderate', label: 'Moderate', description: 'Some care required' },
  { value: 'difficult', label: 'Difficult', description: 'High maintenance, expert level' }
];

// ============================================
// WATER REQUIREMENTS
// ============================================
export const WATER_REQUIREMENTS = [
  { value: 'low', label: 'Low (Drought tolerant)' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High (Regular watering)' },
  { value: 'very_high', label: 'Very High (Aquatic/Wetland)' }
];

// ============================================
// SUNLIGHT REQUIREMENTS
// ============================================
export const SUNLIGHT_REQUIREMENTS = [
  { value: 'full_sun', label: 'Full Sun (6+ hours)' },
  { value: 'partial_sun', label: 'Partial Sun (4-6 hours)' },
  { value: 'partial_shade', label: 'Partial Shade (2-4 hours)' },
  { value: 'full_shade', label: 'Full Shade (<2 hours)' }
];

// ============================================
// CONSERVATION STATUS (IUCN Red List)
// ============================================
export const CONSERVATION_STATUS = [
  { code: 'EX', label: 'Extinct', color: '#000000' },
  { code: 'EW', label: 'Extinct in the Wild', color: '#3d1951' },
  { code: 'CR', label: 'Critically Endangered', color: '#d81e05' },
  { code: 'EN', label: 'Endangered', color: '#fc7f3f' },
  { code: 'VU', label: 'Vulnerable', color: '#f9e814' },
  { code: 'NT', label: 'Near Threatened', color: '#cce226' },
  { code: 'LC', label: 'Least Concern', color: '#60c659' },
  { code: 'DD', label: 'Data Deficient', color: '#d1d1c6' },
  { code: 'NE', label: 'Not Evaluated', color: '#919191' }
];

// ============================================
// UN SDG GOALS
// ============================================
export const SDG_GOALS = [
  { number: 1, name: 'No Poverty' },
  { number: 2, name: 'Zero Hunger' },
  { number: 3, name: 'Good Health and Well-being' },
  { number: 4, name: 'Quality Education' },
  { number: 5, name: 'Gender Equality' },
  { number: 6, name: 'Clean Water and Sanitation' },
  { number: 7, name: 'Affordable and Clean Energy' },
  { number: 8, name: 'Decent Work and Economic Growth' },
  { number: 9, name: 'Industry, Innovation and Infrastructure' },
  { number: 10, name: 'Reduced Inequalities' },
  { number: 11, name: 'Sustainable Cities and Communities' },
  { number: 12, name: 'Responsible Consumption and Production' },
  { number: 13, name: 'Climate Action' },
  { number: 14, name: 'Life Below Water' },
  { number: 15, name: 'Life on Land' },
  { number: 16, name: 'Peace, Justice and Strong Institutions' },
  { number: 17, name: 'Partnerships for the Goals' }
];

// ============================================
// POLICY TYPES
// ============================================
export const POLICY_TYPES = [
  { value: 'regulation', label: 'Regulation' },
  { value: 'law', label: 'Law' },
  { value: 'act', label: 'Act' },
  { value: 'guideline', label: 'Guideline' },
  { value: 'standard', label: 'Standard' },
  { value: 'treaty', label: 'International Treaty' },
  { value: 'directive', label: 'Directive' }
];

// ============================================
// POLICY SECTORS
// ============================================
export const POLICY_SECTORS = [
  { value: 'air_quality', label: 'Air Quality' },
  { value: 'water_quality', label: 'Water Quality' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'forest_conservation', label: 'Forest Conservation' },
  { value: 'wildlife_protection', label: 'Wildlife Protection' },
  { value: 'climate_change', label: 'Climate Change' },
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'pollution_control', label: 'Pollution Control' }
];

// ============================================
// PLANT CATEGORIES
// ============================================
export const PLANT_CATEGORIES = [
  { value: 'tree', label: 'Tree' },
  { value: 'shrub', label: 'Shrub' },
  { value: 'herb', label: 'Herb' },
  { value: 'climber', label: 'Climber' },
  { value: 'grass', label: 'Grass' },
  { value: 'succulent', label: 'Succulent' },
  { value: 'aquatic', label: 'Aquatic' },
  { value: 'medicinal', label: 'Medicinal' }
];

// ============================================
// CLIMATE ZONES
// ============================================
export const CLIMATE_ZONES = [
  { value: 'tropical', label: 'Tropical' },
  { value: 'subtropical', label: 'Subtropical' },
  { value: 'temperate', label: 'Temperate' },
  { value: 'continental', label: 'Continental' },
  { value: 'polar', label: 'Polar' },
  { value: 'arid', label: 'Arid/Desert' },
  { value: 'mediterranean', label: 'Mediterranean' }
];

// ============================================
// SOIL TYPES
// ============================================
export const SOIL_TYPES = [
  { value: 'clay', label: 'Clay' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'loamy', label: 'Loamy' },
  { value: 'silt', label: 'Silt' },
  { value: 'peaty', label: 'Peaty' },
  { value: 'chalky', label: 'Chalky' },
  { value: 'saline', label: 'Saline' }
];

// ============================================
// PRODUCT CATEGORIES
// ============================================
export const PRODUCT_CATEGORIES = [
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'sustainable_packaging', label: 'Sustainable Packaging' },
  { value: 'water_conservation', label: 'Water Conservation' },
  { value: 'waste_reduction', label: 'Waste Reduction' },
  { value: 'eco_friendly_materials', label: 'Eco-friendly Materials' },
  { value: 'organic_products', label: 'Organic Products' },
  { value: 'green_technology', label: 'Green Technology' }
];

// ============================================
// CERTIFICATION TYPES
// ============================================
export const CERTIFICATION_TYPES = [
  { value: 'organic', label: 'Organic Certified' },
  { value: 'fair_trade', label: 'Fair Trade' },
  { value: 'carbon_neutral', label: 'Carbon Neutral' },
  { value: 'energy_star', label: 'Energy Star' },
  { value: 'leed', label: 'LEED Certified' },
  { value: 'rainforest_alliance', label: 'Rainforest Alliance' },
  { value: 'cradle_to_cradle', label: 'Cradle to Cradle' }
];

// ============================================
// PAGINATION
// ============================================
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ============================================
// MEDIA TYPES
// ============================================
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio'
};

// ============================================
// ALLOWED FILE TYPES
// ============================================
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword'];

// ============================================
// MAX FILE SIZES (in bytes)
// ============================================
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// ============================================
// SEO LIMITS
// ============================================
export const SEO_LIMITS = {
  TITLE_MIN: 10,
  TITLE_MAX: 60,
  DESCRIPTION_MIN: 50,
  DESCRIPTION_MAX: 160,
  KEYWORDS_MAX: 10
};

// ============================================
// CONTENT LIMITS
// ============================================
export const CONTENT_LIMITS = {
  SLUG_MAX: 100,
  TITLE_MAX: 200,
  EXCERPT_MAX: 300,
  CONTENT_MIN: 100,
  CONTENT_MAX: 50000
};

// ============================================
// ANALYTICS TIMEFRAMES
// ============================================
export const ANALYTICS_TIMEFRAMES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
  { value: 'all', label: 'All Time' }
];

// Export all as default
export default {
  SUPPORTED_LANGUAGES,
  COUNTRIES,
  ARTICLE_TYPES,
  ARTICLE_STATUS,
  TYPE_COLORS,
  STATUS_COLORS,
  CARE_LEVELS,
  WATER_REQUIREMENTS,
  SUNLIGHT_REQUIREMENTS,
  CONSERVATION_STATUS,
  SDG_GOALS,
  POLICY_TYPES,
  POLICY_SECTORS,
  PLANT_CATEGORIES,
  CLIMATE_ZONES,
  SOIL_TYPES,
  PRODUCT_CATEGORIES,
  CERTIFICATION_TYPES,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  MEDIA_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_DOCUMENT_SIZE,
  SEO_LIMITS,
  CONTENT_LIMITS,
  ANALYTICS_TIMEFRAMES
};
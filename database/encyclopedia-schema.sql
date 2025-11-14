-- Environmental Encyclopedia Database Schema
-- Comprehensive schema for managing environmental content, plants, policies, and sustainable products

-- =============================================
-- CORE TABLES
-- =============================================

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL, -- ISO 3166-1 alpha-3 (e.g., IND, CHN, UAE, USA, BRA)
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    flag_emoji VARCHAR(10),
    overview TEXT,
    capital VARCHAR(100),
    population BIGINT,
    area_km2 DECIMAL(12, 2),
    languages JSON, -- ["English", "Hindi"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table (Main categories like Plants, Topics, Policies, Products)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name JSON NOT NULL, -- {"en": "Plants", "hi": "पौधे", "zh": "植物", "ar": "نباتات"}
    description JSON,
    icon VARCHAR(50), -- Font Awesome icon class
    parent_id INT NULL, -- For subcategories
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article Types Table (Plants, Environmental Topics, Policies, Sustainable Products)
CREATE TABLE IF NOT EXISTS article_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL, -- plant, topic, policy, product
    name JSON NOT NULL, -- {"en": "Plant", "hi": "पौधा"}
    template_name VARCHAR(100) NOT NULL, -- Template file to use
    schema_type VARCHAR(50), -- Schema.org type (Article, Product, etc.)
    custom_fields JSON, -- Dynamic fields specific to this type
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users/Authors Table
CREATE TABLE IF NOT EXISTS encyclopedia_authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Link to main users table if exists
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'content_creator', 'bot') DEFAULT 'content_creator',
    bio TEXT,
    avatar_url VARCHAR(500),
    expertise JSON, -- ["Botany", "Climate Policy"]
    country_code VARCHAR(3),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ARTICLES TABLE (Main content table)
-- =============================================

CREATE TABLE IF NOT EXISTS encyclopedia_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    article_type_id INT NOT NULL,

    -- Multi-language content
    title JSON NOT NULL, -- {"en": "Title", "hi": "शीर्षक"}
    excerpt JSON, -- Short description for listings and social media
    content JSON NOT NULL, -- Full article content in multiple languages

    -- Author and status
    author_id INT NOT NULL,
    status ENUM('draft', 'pending_review', 'published', 'archived') DEFAULT 'draft',

    -- Publishing settings
    is_global BOOLEAN DEFAULT TRUE, -- TRUE = visible globally
    published_countries JSON, -- ["IND", "CHN"] - specific countries if not global

    -- SEO
    meta_title JSON,
    meta_description JSON,
    keywords JSON, -- ["sustainability", "renewable energy"]

    -- Dates
    published_at TIMESTAMP NULL,
    archived_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Analytics
    view_count INT DEFAULT 0,
    share_count INT DEFAULT 0,

    FOREIGN KEY (article_type_id) REFERENCES article_types(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES encyclopedia_authors(id) ON DELETE RESTRICT,

    INDEX idx_slug (slug),
    INDEX idx_type (article_type_id),
    INDEX idx_status (status),
    INDEX idx_published (published_at),
    INDEX idx_global (is_global),
    FULLTEXT idx_search (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TYPE-SPECIFIC DATA TABLES
-- =============================================

-- Plant-specific data
CREATE TABLE IF NOT EXISTS article_plants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNIQUE NOT NULL,
    scientific_name VARCHAR(255),
    common_names JSON, -- {"en": ["Oak Tree", "Common Oak"], "hi": ["बलूत का पेड़"]}
    family VARCHAR(100),
    genus VARCHAR(100),
    native_regions JSON, -- ["India", "Southeast Asia"]
    climate_zones JSON, -- ["Tropical", "Subtropical"]
    care_level ENUM('easy', 'moderate', 'difficult'),
    water_requirements ENUM('low', 'moderate', 'high'),
    sunlight_requirements ENUM('full_sun', 'partial_shade', 'full_shade'),
    soil_type VARCHAR(100),
    growth_rate ENUM('slow', 'moderate', 'fast'),
    mature_height_cm INT,
    mature_width_cm INT,
    flowering_season VARCHAR(100),
    environmental_benefits JSON, -- ["Air purification", "Soil erosion control"]
    medicinal_uses TEXT,
    toxicity_info TEXT,
    conservation_status ENUM('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'), -- IUCN Red List
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    INDEX idx_scientific (scientific_name),
    INDEX idx_family (family)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Policy-specific data
CREATE TABLE IF NOT EXISTS article_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNIQUE NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    policy_title VARCHAR(500) NOT NULL,
    policy_number VARCHAR(100),
    year_enacted YEAR,
    year_amended YEAR,
    status ENUM('active', 'repealed', 'under_review', 'proposed') DEFAULT 'active',
    policy_type ENUM('legislation', 'regulation', 'treaty', 'guideline', 'other'),
    summary TEXT,
    key_points JSON, -- ["Point 1", "Point 2"]
    full_text_url VARCHAR(500),
    responsible_ministry VARCHAR(255),
    impact_assessment TEXT,
    related_sdgs JSON, -- UN Sustainable Development Goals: [7, 13, 15]
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE,
    INDEX idx_country (country_code),
    INDEX idx_year (year_enacted),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sustainable Product-specific data
CREATE TABLE IF NOT EXISTS article_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    category VARCHAR(100), -- "Solar Panel", "Eco-friendly Packaging"
    available_countries JSON, -- ["IND", "CHN", "UAE"]
    certifications JSON, -- ["Fair Trade", "Organic", "Carbon Neutral"]
    price_range_min DECIMAL(10, 2),
    price_range_max DECIMAL(10, 2),
    currency VARCHAR(3), -- USD, INR, CNY
    eco_rating DECIMAL(3, 2), -- 0.00 to 5.00
    carbon_footprint_kg DECIMAL(10, 2),
    recyclable BOOLEAN,
    biodegradable BOOLEAN,
    website_url VARCHAR(500),
    purchase_links JSON, -- {"amazon": "url", "official": "url"}
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_manufacturer (manufacturer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Environmental Topic-specific data (Climate, Biodiversity, etc.)
CREATE TABLE IF NOT EXISTS article_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNIQUE NOT NULL,
    topic_type VARCHAR(100), -- "Climate Change", "Biodiversity", "Pollution"
    urgency_level ENUM('low', 'medium', 'high', 'critical'),
    global_impact BOOLEAN DEFAULT TRUE,
    affected_regions JSON, -- ["Asia", "Africa"]
    timeline VARCHAR(100), -- "2020-2050"
    key_statistics JSON, -- [{"label": "CO2 reduction", "value": "30%"}]
    solutions JSON, -- ["Solution 1", "Solution 2"]
    challenges JSON,
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    INDEX idx_type (topic_type),
    INDEX idx_urgency (urgency_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- RELATIONSHIPS & TAXONOMIES
-- =============================================

-- Article-Category relationships (many-to-many)
CREATE TABLE IF NOT EXISTS article_categories (
    article_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name JSON NOT NULL, -- {"en": "Renewable Energy", "hi": "नवीकरणीय ऊर्जा"}
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article-Tag relationships (many-to-many)
CREATE TABLE IF NOT EXISTS article_tags (
    article_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article-Country relationships (many-to-many for cross-references)
CREATE TABLE IF NOT EXISTS article_countries (
    article_id INT NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    relevance ENUM('primary', 'secondary', 'mentioned') DEFAULT 'mentioned',
    PRIMARY KEY (article_id, country_code),
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_country (country_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- MEDIA TABLES
-- =============================================

-- Media/Photos Table
CREATE TABLE IF NOT EXISTS article_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    media_type ENUM('image', 'youtube_video', 'youtube_short', 'instagram_reel') NOT NULL,
    url VARCHAR(1000) NOT NULL,
    embed_code TEXT, -- For videos
    thumbnail_url VARCHAR(1000),
    title JSON, -- Multi-language titles
    caption JSON, -- Multi-language captions
    alt_text JSON, -- For accessibility
    credits VARCHAR(255), -- Photo credit/copyright
    display_order INT DEFAULT 0,
    width INT,
    height INT,
    file_size_kb INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_type (media_type),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SOCIAL MEDIA & SHARING
-- =============================================

-- Social Media Posts (auto-generated + manual editable)
CREATE TABLE IF NOT EXISTS article_social_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    platform ENUM('twitter', 'facebook', 'instagram', 'linkedin') NOT NULL,
    content JSON NOT NULL, -- {"en": "Post text", "hi": "पोस्ट"}
    hashtags JSON, -- ["#Sustainability", "#GreenEnergy"]
    is_auto_generated BOOLEAN DEFAULT TRUE,
    status ENUM('draft', 'ready', 'posted') DEFAULT 'draft',
    posted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_platform (platform),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- WORKFLOW & APPROVALS
-- =============================================

-- Article Review/Approval Workflow
CREATE TABLE IF NOT EXISTS article_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    status ENUM('approved', 'rejected', 'needs_changes') NOT NULL,
    comments TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES encyclopedia_authors(id) ON DELETE RESTRICT,
    INDEX idx_article (article_id),
    INDEX idx_reviewer (reviewer_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SEARCH & ANALYTICS
-- =============================================

-- Search Queries Log (for autocomplete and analytics)
CREATE TABLE IF NOT EXISTS search_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query VARCHAR(255) NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    country_code VARCHAR(3),
    results_count INT,
    clicked_article_id INT,
    user_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clicked_article_id) REFERENCES encyclopedia_articles(id) ON DELETE SET NULL,
    INDEX idx_query (query),
    INDEX idx_language (language),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article View Analytics
CREATE TABLE IF NOT EXISTS article_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    country_code VARCHAR(3),
    language VARCHAR(5),
    user_ip VARCHAR(45),
    user_agent VARCHAR(500),
    referer VARCHAR(1000),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_country (country_code),
    INDEX idx_date (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- API ACCESS & RATE LIMITING
-- =============================================

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash of API key
    name VARCHAR(100) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    type ENUM('public', 'internal', 'bot') DEFAULT 'public',
    rate_limit_per_hour INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    allowed_ips JSON, -- ["192.168.1.1"] or null for any
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    last_used_at TIMESTAMP NULL,
    INDEX idx_key (key_hash),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API Rate Limiting Log
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_key_id INT NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    request_count INT DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
    INDEX idx_key_window (api_key_id, window_start),
    INDEX idx_endpoint (endpoint)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- RELATED CONTENT
-- =============================================

-- Manual Related Articles (auto-suggestions can be generated via queries)
CREATE TABLE IF NOT EXISTS related_articles (
    article_id INT NOT NULL,
    related_article_id INT NOT NULL,
    relevance_score DECIMAL(3, 2) DEFAULT 1.00, -- 0.00 to 1.00
    relationship_type VARCHAR(50), -- "similar", "referenced", "prerequisite"
    PRIMARY KEY (article_id, related_article_id),
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (related_article_id) REFERENCES encyclopedia_articles(id) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_related (related_article_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INITIAL DATA INSERTS
-- =============================================

-- Insert initial countries
INSERT INTO countries (code, name, native_name, flag_emoji, capital) VALUES
('IND', 'India', 'भारत', '🇮🇳', 'New Delhi'),
('CHN', 'China', '中国', '🇨🇳', 'Beijing'),
('ARE', 'United Arab Emirates', 'الإمارات العربية المتحدة', '🇦🇪', 'Abu Dhabi'),
('USA', 'United States', 'United States', '🇺🇸', 'Washington, D.C.'),
('BRA', 'Brazil', 'Brasil', '🇧🇷', 'Brasília')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert main categories
INSERT INTO categories (slug, name, description, icon, parent_id, display_order) VALUES
('plants', '{"en":"Plants","hi":"पौधे","zh":"植物","ar":"نباتات"}', '{"en":"Information about plants and trees","hi":"पौधों और पेड़ों के बारे में जानकारी"}', 'fa-seedling', NULL, 1),
('topics', '{"en":"Environmental Topics","hi":"पर्यावरण विषय","zh":"环境主题","ar":"المواضيع البيئية"}', '{"en":"Topics related to environment and sustainability","hi":"पर्यावरण और स्थिरता से संबंधित विषय"}', 'fa-globe', NULL, 2),
('policies', '{"en":"Policies","hi":"नीतियां","zh":"政策","ar":"سياسات"}', '{"en":"Environmental policies and regulations","hi":"पर्यावरण नीतियां और विनियम"}', 'fa-file-contract', NULL, 3),
('products', '{"en":"Sustainable Products","hi":"सतत उत्पाद","zh":"可持续产品","ar":"منتجات مستدامة"}', '{"en":"Eco-friendly and sustainable products","hi":"पर्यावरण के अनुकूल और सतत उत्पाद"}', 'fa-leaf', NULL, 4)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert article types
INSERT INTO article_types (slug, name, template_name, schema_type, custom_fields) VALUES
('plant', '{"en":"Plant","hi":"पौधा","zh":"植物","ar":"نبات"}', 'PlantArticle', 'Article', '{}'),
('topic', '{"en":"Environmental Topic","hi":"पर्यावरण विषय","zh":"环境主题","ar":"موضوع بيئي"}', 'TopicArticle', 'Article', '{}'),
('policy', '{"en":"Policy","hi":"नीति","zh":"政策","ar":"سياسة"}', 'PolicyArticle', 'Article', '{}'),
('product', '{"en":"Sustainable Product","hi":"सतत उत्पाद","zh":"可持续产品","ar":"منتج مستدام"}', 'ProductArticle', 'Product', '{}')
ON DUPLICATE KEY UPDATE name=VALUES(name);

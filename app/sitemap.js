// Dynamic sitemap generation for Google Search Console

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://greeneye.org';
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const API_KEY = process.env.NEXT_PUBLIC_ENCYCLOPEDIA_API_KEY;

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/encyclopedia`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Fetch encyclopedia articles
  let encyclopediaPages = [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/encyclopedia/articles?status=published&limit=1000`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
        // Disable caching for sitemap generation
        cache: 'no-store',
      }
    );

    if (response.ok) {
      const data = await response.json();
      const articles = data.data || [];

      encyclopediaPages = articles.map((article) => ({
        url: `${baseUrl}/encyclopedia/${article.slug}`,
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    // Continue with static pages even if API fails
  }

  // Fetch encyclopedia categories
  let categoryPages = [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/encyclopedia/categories?limit=100`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
        cache: 'no-store',
      }
    );

    if (response.ok) {
      const data = await response.json();
      const categories = data.data || [];

      categoryPages = categories.map((category) => ({
        url: `${baseUrl}/encyclopedia/category/${category.slug}`,
        lastModified: new Date(category.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  // Fetch encyclopedia tags
  let tagPages = [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/encyclopedia/tags?limit=100`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
        cache: 'no-store',
      }
    );

    if (response.ok) {
      const data = await response.json();
      const tags = data.data || [];

      tagPages = tags.map((tag) => ({
        url: `${baseUrl}/encyclopedia/tag/${tag.slug}`,
        lastModified: new Date(tag.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.5,
      }));
    }
  } catch (error) {
    console.error('Error fetching tags for sitemap:', error);
  }

  // Combine all pages
  return [
    ...staticPages,
    ...encyclopediaPages,
    ...categoryPages,
    ...tagPages,
  ];
}

// robots.txt generation for search engines

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://greeneye.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

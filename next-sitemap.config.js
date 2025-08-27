module.exports = {
  siteUrl: 'https://greeneye.foundation',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'],
  changefreq: 'weekly',
  priority: 0.7,
  generateIndexSitemap: true,

  additionalPaths: async (config) => {
    return [
      await config.transform(config, '/blog'),
      await config.transform(config, '/about'),
      await config.transform(config, '/volunteer'),
      // await config.transform(config, '/products'),
    ];
  },
};
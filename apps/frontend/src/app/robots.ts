import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/health/'],
    },
    sitemap: 'https://oddins-odds.com/sitemap.xml',
  };
}

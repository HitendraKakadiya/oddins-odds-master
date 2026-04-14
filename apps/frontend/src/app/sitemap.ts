import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://oddins-odds.com';

  const staticPages = [
    '',
    '/betting-sites',
    '/predictions',
    '/statistics',
    '/leagues',
    '/academy/strategies',
    '/contact',
    '/privacy',
    '/cookies',
    '/terms',
  ];

  return staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}

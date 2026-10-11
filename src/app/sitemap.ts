import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { CITIES_DATA } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://piyetokihfilm.com';
  const now = new Date();

  // Static core routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bogo`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 17 City Roadshow routes
  CITIES_DATA.forEach(city => {
    routes.push({
      url: `${baseUrl}/city/${city.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // Dynamic articles from database
  try {
    const db = getDb();
    const articles = (db.articles || []).filter(a => a.isPublished);

    articles.forEach(article => {
      routes.push({
        url: `${baseUrl}/artikel/${article.slug}`,
        lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (e) {
    console.error('Error generating sitemap articles:', e);
  }

  return routes;
}

import type { MetadataRoute } from 'next';
import { SEO_PAGES } from '../lib/seo-pages';
import { ARTICLES } from '../lib/articles';
import { SITE_URL } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...SEO_PAGES.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/huong-dan-nghien-cuu-tu-khoa`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/kien-thuc`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...ARTICLES.map((a) => ({
      url: `${SITE_URL}/kien-thuc/${a.slug}`,
      lastModified: new Date(a.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}

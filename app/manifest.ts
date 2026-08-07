import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – Công cụ nghiên cứu từ khóa`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f3ea',
    theme_color: '#0f7a52',
    lang: 'vi',
    categories: ['productivity', 'business', 'utilities'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}

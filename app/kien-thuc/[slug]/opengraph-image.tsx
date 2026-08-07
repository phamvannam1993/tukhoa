import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '../../../lib/og';
import { getArticle } from '../../../lib/articles';

export const alt = 'TừKhóa.vn – Kiến thức SEO';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  return renderOgImage({
    eyebrow: 'KIẾN THỨC SEO',
    title: article?.heading ?? 'Kiến thức SEO',
    tagline: 'Bài viết kiến thức SEO & nghiên cứu từ khóa dễ hiểu cho người mới',
  });
}

import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '../../lib/og';
import { getSeoPage } from '../../lib/seo-pages';

export const alt = 'TừKhóa.vn';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === 'huong-dan-nghien-cuu-tu-khoa') {
    return renderOgImage({ eyebrow: 'HƯỚNG DẪN SEO', title: 'Cách nghiên cứu từ khóa từ đầu' });
  }

  const page = getSeoPage(slug);
  return renderOgImage({
    eyebrow: page?.eyebrow ?? 'CÔNG CỤ SEO MIỄN PHÍ',
    title: page?.heading ?? 'Nghiên cứu từ khóa tiếng Việt',
  });
}

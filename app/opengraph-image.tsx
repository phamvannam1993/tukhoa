import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '../lib/og';

export const alt = 'TừKhóa.vn – Công cụ nghiên cứu từ khóa tiếng Việt miễn phí';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({ eyebrow: 'CÔNG CỤ SEO MIỄN PHÍ', title: 'Nghiên cứu từ khóa tiếng Việt' });
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { INDUSTRY_LIST, ALL_SEEDS } from '../../lib/keyword-seed';
import { SITE_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Từ khóa theo ngành – thư viện từ khóa tiếng Việt theo lĩnh vực',
  description:
    'Thư viện từ khóa tiếng Việt sắp xếp theo ngành: giáo dục, du lịch, bất động sản, tài chính, sức khỏe, công nghệ… Mỗi từ khóa có gợi ý liên quan, long-tail và câu hỏi.',
  alternates: { canonical: '/tu-khoa-nganh' },
  openGraph: {
    title: 'Từ khóa theo ngành – thư viện từ khóa tiếng Việt',
    description: 'Khám phá từ khóa trụ cột theo từng ngành, kèm gợi ý liên quan, long-tail và câu hỏi người dùng.',
    url: `${SITE_URL}/tu-khoa-nganh`,
    type: 'website',
  },
};

export default function IndustryHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Từ khóa theo ngành', item: `${SITE_URL}/tu-khoa-nganh` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Danh sách ngành',
        numberOfItems: INDUSTRY_LIST.length,
        itemListElement: INDUSTRY_LIST.map((ind, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: ind.name,
          url: `${SITE_URL}/tu-khoa-nganh/${ind.slug}`,
        })),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <span className="current">Từ khóa theo ngành</span>
      </nav>

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">THƯ VIỆN TỪ KHÓA</p>
          <h1>Từ khóa theo ngành</h1>
          <p className="heroText">
            {ALL_SEEDS.length} từ khóa trụ cột trên {INDUSTRY_LIST.length} ngành. Mỗi từ khóa đi kèm bộ
            gợi ý liên quan, biến thể long-tail và câu hỏi người dùng — chọn ngành của bạn để bắt đầu.
          </p>
        </div>
      </section>

      <section className="container industryGrid">
        {INDUSTRY_LIST.map((ind) => (
          <article className="industryCard" key={ind.slug}>
            <div className="industryCardHead">
              <h2><Link href={`/tu-khoa-nganh/${ind.slug}`}>{ind.name}</Link></h2>
              <span className="industryCount">{ind.seeds.length} từ khóa</span>
            </div>
            <ul className="industryKw">
              {ind.seeds.slice(0, 6).map((s) => (
                <li key={s.slug}><Link href={`/keyword/${s.slug}`}>{s.keyword}</Link></li>
              ))}
            </ul>
            <Link className="seeAllLink" href={`/tu-khoa-nganh/${ind.slug}`}>
              Xem tất cả từ khóa ngành {ind.name} →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '../../lib/articles';
import { SITE_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Kiến thức SEO & nghiên cứu từ khóa – Blog TừKhóa.vn',
  description:
    'Bài viết kiến thức SEO dễ hiểu: search intent, long-tail keyword, topic cluster, keyword cannibalization và cách nghiên cứu từ khóa hiệu quả cho người mới.',
  keywords: ['kiến thức seo', 'blog seo', 'nghiên cứu từ khóa', 'search intent', 'topic cluster'],
  alternates: { canonical: '/kien-thuc' },
  openGraph: {
    title: 'Kiến thức SEO & nghiên cứu từ khóa – TừKhóa.vn',
    description: 'Bài viết kiến thức SEO dễ hiểu về nghiên cứu và tối ưu từ khóa.',
    url: `${SITE_URL}/kien-thuc`,
    type: 'website',
  },
};

export default function KnowledgeHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kiến thức SEO & nghiên cứu từ khóa',
    url: `${SITE_URL}/kien-thuc`,
    inLanguage: 'vi-VN',
    hasPart: ARTICLES.map((a) => ({ '@type': 'Article', headline: a.heading, url: `${SITE_URL}/kien-thuc/${a.slug}` })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Kiến thức', item: `${SITE_URL}/kien-thuc` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <span className="current">Kiến thức</span>
      </nav>

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">KIẾN THỨC SEO</p>
          <h1>Học nghiên cứu từ khóa & SEO</h1>
          <p className="heroText">
            Những bài viết ngắn, dễ hiểu về nghiên cứu từ khóa và SEO — giải thích các khái niệm cốt lõi và cách áp dụng ngay bằng công cụ miễn phí.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="pageGrid">
          {ARTICLES.map((a) => (
            <article className="pageCard" key={a.slug}>
              <div className="pageCardIcon">📄</div>
              <p className="pcEyebrow">{a.eyebrow} · {a.readMinutes} phút đọc</p>
              <h3>{a.heading}</h3>
              <p className="pcDesc">{a.intro}</p>
              <Link className="pcLink" href={`/kien-thuc/${a.slug}`}>
                Đọc bài →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="ctaBand">
          <h2>Sẵn sàng áp dụng?</h2>
          <p>Mở công cụ nghiên cứu từ khóa để biến kiến thức thành danh sách từ khóa và dàn ý nội dung.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/cong-cu-nghien-cuu-tu-khoa">Mở công cụ →</Link>
            <Link className="ctaGhost" href="/huong-dan-nghien-cuu-tu-khoa">Xem hướng dẫn</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

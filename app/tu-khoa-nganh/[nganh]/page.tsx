import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INDUSTRY_LIST, getIndustry } from '../../../lib/keyword-seed';
import { SITE_URL } from '../../../lib/site';

interface PageProps {
  params: Promise<{ nganh: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRY_LIST.map((ind) => ({ nganh: ind.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nganh } = await params;
  const ind = getIndustry(nganh);
  if (!ind) return {};
  return {
    title: ind.title,
    description: ind.description,
    alternates: { canonical: `/tu-khoa-nganh/${ind.slug}` },
    openGraph: { title: ind.title, description: ind.description, url: `${SITE_URL}/tu-khoa-nganh/${ind.slug}`, type: 'website' },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { nganh } = await params;
  const ind = getIndustry(nganh);
  if (!ind) notFound();

  const others = INDUSTRY_LIST.filter((i) => i.slug !== ind.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Từ khóa theo ngành', item: `${SITE_URL}/tu-khoa-nganh` },
          { '@type': 'ListItem', position: 3, name: ind.name, item: `${SITE_URL}/tu-khoa-nganh/${ind.slug}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Từ khóa ngành ${ind.name}`,
        numberOfItems: ind.seeds.length,
        itemListElement: ind.seeds.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.keyword,
          url: `${SITE_URL}/keyword/${s.slug}`,
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
        <Link href="/tu-khoa-nganh">Từ khóa theo ngành</Link>
        <span className="sep">/</span>
        <span className="current">{ind.name}</span>
      </nav>

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">NGÀNH {ind.name.toUpperCase()}</p>
          <h1>Từ khóa ngành {ind.name}</h1>
          <p className="heroText">{ind.intro}</p>
        </div>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">{ind.seeds.length} TỪ KHÓA TRỤ CỘT</p>
          <h2>Chọn một từ khóa để xem chi tiết</h2>
          <p className="sectionSub">Mỗi từ khóa có trang tổng quan, long-tail và câu hỏi riêng.</p>
        </div>
        <div>
          <div className="seedGrid">
            {ind.seeds.map((s) => (
              <div className="seedCard" key={s.slug}>
                <Link className="seedMain" href={`/keyword/${s.slug}`}>{s.keyword}</Link>
                <div className="seedSub">
                  <Link href={`/long-tail/${s.slug}`}>Long-tail</Link>
                  <span>·</span>
                  <Link href={`/cau-hoi/${s.slug}`}>Câu hỏi</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container relatedSection">
        <h2>Các ngành khác</h2>
        <div className="relatedGrid">
          {others.map((i) => (
            <Link className="relatedCard" href={`/tu-khoa-nganh/${i.slug}`} key={i.slug}>
              <span>{i.seeds.length} từ khóa</span>
              <strong>{i.name} <span className="rArrow">→</span></strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="ctaBand">
          <h2>Nghiên cứu từ khóa ngành {ind.name} theo cách của bạn</h2>
          <p>Nhập bất kỳ từ khóa nào để mở rộng bằng Google &amp; YouTube Autocomplete, phân loại intent và gom cụm.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/cong-cu-nghien-cuu-tu-khoa">Mở công cụ nghiên cứu từ khóa →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

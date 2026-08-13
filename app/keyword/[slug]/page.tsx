import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_SEEDS, getSeed, getIndustry, siblingSeeds } from '../../../lib/keyword-seed';
import { expandKeyword, answerFor } from '../../../lib/keyword-expand';
import { SITE_NAME, SITE_URL } from '../../../lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_SEEDS.map((s) => ({ slug: s.slug }));
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const seed = getSeed(slug);
  if (!seed) return {};
  const title = `Từ khóa "${seed.keyword}" – gợi ý liên quan, long-tail, câu hỏi & intent`;
  const description = `Nghiên cứu từ khóa "${seed.keyword}": danh sách từ khóa liên quan, long-tail, câu hỏi người dùng, search intent và gợi ý tiêu đề. Miễn phí, không cần đăng nhập.`;
  return {
    title,
    description,
    keywords: [seed.keyword, `${seed.keyword} là gì`, `từ khóa ${seed.keyword}`, `${seed.keyword} liên quan`],
    alternates: { canonical: `/keyword/${seed.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/keyword/${seed.slug}`, type: 'article' },
  };
}

export default async function KeywordPage({ params }: PageProps) {
  const { slug } = await params;
  const seed = getSeed(slug);
  if (!seed) notFound();

  const data = expandKeyword(seed);
  const industry = getIndustry(seed.industry);
  const siblings = siblingSeeds(seed, 8);
  const faqItems = data.questions.slice(0, 6).map((q) => ({ q, a: answerFor(q, seed) }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Từ khóa theo ngành', item: `${SITE_URL}/tu-khoa-nganh` },
          { '@type': 'ListItem', position: 3, name: seed.industryName, item: `${SITE_URL}/tu-khoa-nganh/${seed.industry}` },
          { '@type': 'ListItem', position: 4, name: seed.keyword, item: `${SITE_URL}/keyword/${seed.slug}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Từ khóa liên quan tới ${seed.keyword}`,
        itemListElement: data.related.map((kw, i) => ({ '@type': 'ListItem', position: i + 1, name: kw })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
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
        <Link href={`/tu-khoa-nganh/${seed.industry}`}>{seed.industryName}</Link>
        <span className="sep">/</span>
        <span className="current">{seed.keyword}</span>
      </nav>

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">TỪ KHÓA · {seed.industryName.toUpperCase()}</p>
          <h1>{cap(seed.keyword)}</h1>
          <p className="heroText">
            Toàn cảnh từ khóa <strong>“{seed.keyword}”</strong>: các truy vấn liên quan, biến thể
            long-tail, câu hỏi người dùng thật và ý định tìm kiếm — nguyên liệu sẵn sàng để lên dàn ý
            và xây nội dung.
          </p>
          <div className="kwMetaRow">
            <span className={`intentBadge intent-${data.intent}`}>Search intent: {data.intentLabel}</span>
            <span className="kwCount">{data.related.length + data.longTail.length + data.questions.length}+ ý tưởng từ khóa</span>
          </div>
        </div>
      </section>

      {/* Điều hướng chéo giữa 3 nhóm nội dung của cùng từ khóa */}
      <section className="container kwFamily">
        <Link className="kwFamCard active" href={`/keyword/${seed.slug}`}>
          <span>Tổng quan</span>
          <strong>Từ khóa liên quan</strong>
        </Link>
        <Link className="kwFamCard" href={`/long-tail/${seed.slug}`}>
          <span>{data.longTail.length} biến thể</span>
          <strong>Long-tail keyword →</strong>
        </Link>
        <Link className="kwFamCard" href={`/cau-hoi/${seed.slug}`}>
          <span>{data.questions.length} câu hỏi</span>
          <strong>Câu hỏi người dùng →</strong>
        </Link>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">TỪ KHÓA LIÊN QUAN</p>
          <h2>Các truy vấn xoay quanh “{seed.keyword}”</h2>
          <p className="sectionSub">
            Nhóm biến thể tầm trung — nền tảng để chọn từ khóa chính và từ khóa phụ cho mỗi trang.
          </p>
        </div>
        <div>
          <ul className="chipList">
            {data.related.map((kw) => (
              <li className="kwChip" key={kw}>{kw}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">LONG-TAIL</p>
          <h2>Từ khóa dài, dễ lên top</h2>
          <p className="sectionSub">Truy vấn cụ thể, ít cạnh tranh — lý tưởng cho website mới.</p>
        </div>
        <div>
          <ul className="kwLongList">
            {data.longTail.slice(0, 8).map((kw) => (
              <li key={kw}>{kw}</li>
            ))}
          </ul>
          <Link className="seeAllLink" href={`/long-tail/${seed.slug}`}>
            Xem đầy đủ {data.longTail.length} từ khóa long-tail của “{seed.keyword}” →
          </Link>
        </div>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">CÂU HỎI NGƯỜI DÙNG</p>
          <h2>Người dùng thường hỏi gì?</h2>
          <p className="sectionSub">Dùng làm tiêu đề phụ (H2/H3) hoặc mục FAQ có schema.</p>
        </div>
        <div>
          <ul className="kwQaList">
            {data.questions.slice(0, 6).map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <Link className="seeAllLink" href={`/cau-hoi/${seed.slug}`}>
            Xem tất cả câu hỏi về “{seed.keyword}” →
          </Link>
        </div>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">GỢI Ý TIÊU ĐỀ</p>
          <h2>Tiêu đề bài viết đề xuất</h2>
          <p className="sectionSub">Bám đúng ý định tìm kiếm — chỉnh lại theo giọng thương hiệu của bạn.</p>
        </div>
        <div>
          <ul className="titleList">
            {data.titles.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="container relatedSection">
          <h2>Từ khóa khác trong ngành {seed.industryName}</h2>
          <div className="relatedGrid">
            {siblings.map((s) => (
              <Link className="relatedCard" href={`/keyword/${s.slug}`} key={s.slug}>
                <span>Từ khóa</span>
                <strong>{s.keyword} <span className="rArrow">→</span></strong>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 18 }}>
            <Link className="seeAllLink" href={`/tu-khoa-nganh/${seed.industry}`}>
              Xem toàn bộ từ khóa ngành {seed.industryName} →
            </Link>
          </p>
        </section>
      )}

      <section className="container">
        <div className="ctaBand">
          <h2>Mở rộng “{seed.keyword}” bằng dữ liệu trực tiếp</h2>
          <p>Dùng công cụ nghiên cứu từ khóa để lấy gợi ý Google &amp; YouTube Autocomplete theo thời gian thực, phân loại intent và gom cụm.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/cong-cu-nghien-cuu-tu-khoa">Mở công cụ nghiên cứu từ khóa →</Link>
          </div>
        </div>
      </section>

      {industry && (
        <p className="container backLine">
          <Link href="/tu-khoa-nganh">← Tất cả các ngành</Link>
        </p>
      )}
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_SEEDS, getSeed, siblingSeeds } from '../../../lib/keyword-seed';
import { expandKeyword, answerFor } from '../../../lib/keyword-expand';
import { SITE_URL } from '../../../lib/site';

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
  const title = `Câu hỏi thường gặp về "${seed.keyword}" – ý tưởng FAQ & H2/H3`;
  const description = `Tổng hợp câu hỏi người dùng thường tìm quanh "${seed.keyword}": là gì, giá bao nhiêu, có nên, ở đâu... Dùng làm mục FAQ có schema và tiêu đề phụ cho bài viết.`;
  return {
    title,
    description,
    keywords: [`câu hỏi ${seed.keyword}`, `${seed.keyword} là gì`, `faq ${seed.keyword}`, `${seed.keyword} có tốt không`],
    alternates: { canonical: `/cau-hoi/${seed.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/cau-hoi/${seed.slug}`, type: 'article' },
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const seed = getSeed(slug);
  if (!seed) notFound();

  const data = expandKeyword(seed);
  const siblings = siblingSeeds(seed, 6);
  const faqItems = data.questions.map((q) => ({ q, a: answerFor(q, seed) }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Từ khóa theo ngành', item: `${SITE_URL}/tu-khoa-nganh` },
          { '@type': 'ListItem', position: 3, name: seed.keyword, item: `${SITE_URL}/keyword/${seed.slug}` },
          { '@type': 'ListItem', position: 4, name: 'Câu hỏi', item: `${SITE_URL}/cau-hoi/${seed.slug}` },
        ],
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
        <Link href={`/keyword/${seed.slug}`}>{seed.keyword}</Link>
        <span className="sep">/</span>
        <span className="current">Câu hỏi</span>
      </nav>

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">CÂU HỎI NGƯỜI DÙNG</p>
          <h1>Câu hỏi thường gặp về “{seed.keyword}”</h1>
          <p className="heroText">
            {data.questions.length} câu hỏi người dùng thường tìm quanh “{seed.keyword}”. Đây là nguyên liệu
            sẵn sàng cho mục FAQ có schema và các tiêu đề phụ (H2/H3) — nhóm truy vấn dễ giành đoạn trích
            nổi bật nhất.
          </p>
          <div className="kwMetaRow">
            <span className={`intentBadge intent-${data.intent}`}>Search intent: {data.intentLabel}</span>
          </div>
        </div>
      </section>

      <section className="container kwFamily">
        <Link className="kwFamCard" href={`/keyword/${seed.slug}`}>
          <span>Tổng quan</span>
          <strong>← Từ khóa liên quan</strong>
        </Link>
        <Link className="kwFamCard" href={`/long-tail/${seed.slug}`}>
          <span>{data.longTail.length} biến thể</span>
          <strong>Long-tail keyword →</strong>
        </Link>
        <Link className="kwFamCard active" href={`/cau-hoi/${seed.slug}`}>
          <span>{data.questions.length} câu hỏi</span>
          <strong>Câu hỏi người dùng</strong>
        </Link>
      </section>

      <section className="container faqSection">
        <div className="sectionHeading">
          <p className="eyebrow">HỎI &amp; ĐÁP</p>
          <h2>{data.questions.length} câu hỏi quanh “{seed.keyword}”</h2>
        </div>
        <div className="faqGrid">
          {faqItems.map((item) => (
            <article key={item.q}>
              <h3>{cap(item.q)}?</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">GHI CHÚ</p>
          <h2>Cách dùng bộ câu hỏi này</h2>
        </div>
        <div className="prose">
          <p>
            Các câu trả lời ở trên là gợi ý hướng nội dung, không phải câu trả lời cuối cùng — bạn nên bổ
            sung dữ liệu, ví dụ và trải nghiệm thực tế để bài viết có giá trị riêng, thứ Google đánh giá cao.
          </p>
          <p>
            Gom các câu hỏi cùng ý định vào một bài đủ sâu và khai báo FAQPage schema để tăng cơ hội hiển
            thị đoạn trích nổi bật. Tránh tạo mỗi câu hỏi một trang mỏng.
          </p>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="container relatedSection">
          <h2>Câu hỏi cho từ khóa khác cùng ngành</h2>
          <div className="relatedGrid">
            {siblings.map((s) => (
              <Link className="relatedCard" href={`/cau-hoi/${s.slug}`} key={s.slug}>
                <span>Câu hỏi</span>
                <strong>{s.keyword} <span className="rArrow">→</span></strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container">
        <div className="ctaBand">
          <h2>Tìm thêm câu hỏi thật từ Google</h2>
          <p>Công cụ tìm câu hỏi lấy trực tiếp từ Google Autocomplete với nhiều tiền tố/hậu tố nghi vấn tiếng Việt.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/cau-hoi-tu-khoa">Mở công cụ tìm câu hỏi →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_SEEDS, getSeed, siblingSeeds } from '../../../lib/keyword-seed';
import { expandKeyword } from '../../../lib/keyword-expand';
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
  const title = `Long-tail keyword cho "${seed.keyword}" – từ khóa dài dễ lên top`;
  const description = `Danh sách từ khóa dài (long-tail) cho "${seed.keyword}": truy vấn cụ thể, ít cạnh tranh, phù hợp website mới. Kèm search intent và gợi ý cách dùng.`;
  return {
    title,
    description,
    keywords: [`long tail ${seed.keyword}`, `từ khóa dài ${seed.keyword}`, `${seed.keyword} long tail`, `từ khóa ${seed.keyword}`],
    alternates: { canonical: `/long-tail/${seed.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/long-tail/${seed.slug}`, type: 'article' },
  };
}

export default async function LongTailPage({ params }: PageProps) {
  const { slug } = await params;
  const seed = getSeed(slug);
  if (!seed) notFound();

  const data = expandKeyword(seed);
  const siblings = siblingSeeds(seed, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Từ khóa theo ngành', item: `${SITE_URL}/tu-khoa-nganh` },
          { '@type': 'ListItem', position: 3, name: seed.keyword, item: `${SITE_URL}/keyword/${seed.slug}` },
          { '@type': 'ListItem', position: 4, name: 'Long-tail', item: `${SITE_URL}/long-tail/${seed.slug}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Long-tail keyword cho ${seed.keyword}`,
        numberOfItems: data.longTail.length,
        itemListElement: data.longTail.map((kw, i) => ({ '@type': 'ListItem', position: i + 1, name: kw })),
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
        <span className="current">Long-tail</span>
      </nav>

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">LONG-TAIL KEYWORD</p>
          <h1>Từ khóa dài cho “{seed.keyword}”</h1>
          <p className="heroText">
            {data.longTail.length} biến thể <strong>long-tail</strong> của “{seed.keyword}” — truy vấn dài,
            cụ thể và thường ít đối thủ tối ưu nghiêm túc. Đây là nhóm từ khóa dễ lên top nhất cho website
            mới hoặc nội dung đang cần chiều sâu.
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
        <Link className="kwFamCard active" href={`/long-tail/${seed.slug}`}>
          <span>{data.longTail.length} biến thể</span>
          <strong>Long-tail keyword</strong>
        </Link>
        <Link className="kwFamCard" href={`/cau-hoi/${seed.slug}`}>
          <span>{data.questions.length} câu hỏi</span>
          <strong>Câu hỏi người dùng →</strong>
        </Link>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">DANH SÁCH</p>
          <h2>{data.longTail.length} từ khóa long-tail</h2>
          <p className="sectionSub">Mỗi dòng là một ý tưởng cho tiêu đề phụ hoặc một bài viết riêng nếu nhu cầu đủ lớn.</p>
        </div>
        <div>
          <ol className="kwLongList numbered">
            {data.longTail.map((kw) => (
              <li key={kw}>{cap(kw)}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">CÁCH DÙNG</p>
          <h2>Vì sao nên bắt đầu từ long-tail?</h2>
        </div>
        <div className="prose">
          <p>
            Từ khóa dài phản ánh nhu cầu rất cụ thể, nên tỉ lệ chuyển đổi thường cao hơn và độ cạnh tranh
            thấp hơn từ khóa ngắn. Với một website mới, phủ tốt nhóm long-tail là cách nhanh nhất để có
            những thứ hạng đầu tiên và tín hiệu về chủ đề.
          </p>
          <p>
            Đừng tạo mỗi long-tail một trang mỏng. Hãy gom các truy vấn cùng ý định vào một bài đủ sâu,
            dùng chúng làm tiêu đề phụ; chỉ tách trang riêng khi một long-tail có nhu cầu đủ lớn và nội
            dung thực sự khác biệt.
          </p>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="container relatedSection">
          <h2>Long-tail cho từ khóa khác cùng ngành</h2>
          <div className="relatedGrid">
            {siblings.map((s) => (
              <Link className="relatedCard" href={`/long-tail/${s.slug}`} key={s.slug}>
                <span>Long-tail</span>
                <strong>{s.keyword} <span className="rArrow">→</span></strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container">
        <div className="ctaBand">
          <h2>Tìm thêm long-tail bằng dữ liệu trực tiếp</h2>
          <p>Google Autocomplete cập nhật liên tục — dùng công cụ để lấy thêm biến thể dài theo thời gian thực.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/goi-y-tu-khoa-google">Mở công cụ gợi ý long-tail →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KeywordTool } from '../../components/KeywordTool';
import { getSeoPage, SEO_PAGES } from '../../lib/seo-pages';
import { SITE_NAME, SITE_URL } from '../../lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const GUIDE_SLUG = 'huong-dan-nghien-cuu-tu-khoa';
const GUIDE_META = {
  title: 'Hướng dẫn nghiên cứu từ khóa từ A–Z cho người mới (2026)',
  description:
    'Quy trình 6 bước nghiên cứu từ khóa: từ ý tưởng gốc, thu thập biến thể, phân loại search intent đến gom cụm chủ đề và kiểm tra SERP. Hướng dẫn SEO chi tiết, miễn phí.',
  eyebrow: 'HƯỚNG DẪN SEO',
  heading: 'Cách nghiên cứu từ khóa từ đầu',
};

export function generateStaticParams() {
  return [...SEO_PAGES.map((page) => ({ slug: page.slug })), { slug: GUIDE_SLUG }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === GUIDE_SLUG) {
    return {
      title: GUIDE_META.title,
      description: GUIDE_META.description,
      keywords: ['hướng dẫn nghiên cứu từ khóa', 'cách nghiên cứu từ khóa', 'keyword research', 'seo cho người mới'],
      alternates: { canonical: `/${GUIDE_SLUG}` },
      openGraph: {
        title: GUIDE_META.title,
        description: GUIDE_META.description,
        url: `${SITE_URL}/${GUIDE_SLUG}`,
        type: 'article',
      },
    };
  }

  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${SITE_URL}/${page.slug}`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
  };
}

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav className="breadcrumb container" aria-label="Breadcrumb">
      <Link href="/">Trang chủ</Link>
      <span className="sep">/</span>
      <span className="current">{name}</span>
    </nav>
  );
}

export default async function SeoToolPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === GUIDE_SLUG) {
    return <GuidePage />;
  }

  const page = getSeoPage(slug);
  if (!page) notFound();

  const related = page.related
    .map((s) => getSeoPage(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: page.heading, item: `${SITE_URL}/${page.slug}` },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: page.heading,
        url: `${SITE_URL}/${page.slug}`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'vi-VN',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
      },
      {
        '@type': 'HowTo',
        name: `Cách dùng ${page.heading}`,
        step: page.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.title,
          text: s.detail,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumb name={page.heading} />

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.heading}</h1>
          <p className="heroText">{page.intro}</p>
        </div>
      </section>

      <KeywordTool defaultSources={page.defaultSources} />

      <section className="container contentSection">
        <div>
          <p className="eyebrow">TÍNH NĂNG</p>
          <h2>Công cụ này giúp gì?</h2>
        </div>
        <div>
          <ul className="bulletList">
            {page.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container stepsSection">
        <div className="sectionHeading">
          <p className="eyebrow">CÁCH DÙNG</p>
          <h2>4 bước để có danh sách từ khóa</h2>
        </div>
        <div className="stepsGrid">
          {page.steps.map((s, i) => (
            <article className="stepCard" key={s.title}>
              <div className="stepNum">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container contentSection">
        <div>
          <p className="eyebrow">GIỚI THIỆU</p>
          <h2>Về công cụ này</h2>
        </div>
        <div>
          <div className="prose">
            {page.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <ul className="useCaseList" style={{ marginTop: 22 }}>
            {page.useCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container faqSection">
        <div className="sectionHeading">
          <p className="eyebrow">CÂU HỎI THƯỜNG GẶP</p>
          <h2>Giải đáp nhanh</h2>
        </div>
        <div className="faqGrid">
          {page.faq.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container relatedSection">
          <h2>Công cụ liên quan</h2>
          <div className="relatedGrid">
            {related.map((r) => (
              <Link className="relatedCard" href={`/${r.slug}`} key={r.slug}>
                <span>{r.eyebrow}</span>
                <strong>{r.heading} <span className="rArrow">→</span></strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function GuidePage() {
  const steps = [
    { h: '1. Bắt đầu từ vấn đề thật', p: 'Chọn một sản phẩm, kỹ năng hoặc câu hỏi mà người dùng đang cần giải quyết. Từ khóa gốc nên đủ cụ thể để kết quả không bị quá rộng, nhưng đủ phổ biến để có nhu cầu thực.' },
    { h: '2. Thu thập biến thể', p: 'Dùng Google và YouTube để tìm câu hỏi, cách làm, đánh giá và biến thể dài. Với TikTok hoặc Shopee, xem các gợi ý như nguồn ý tưởng chứ không phải số liệu volume. Hãy mở rộng theo cả tiền tố (cách, giá, mua) và hậu tố (2026, ở đâu, cho người mới).' },
    { h: '3. Chia theo search intent', p: 'Không gộp truy vấn tìm hiểu và truy vấn mua hàng vào cùng một trang. Mỗi trang cần giải quyết đúng mục tiêu chính của người tìm kiếm — thông tin, thương mại hay giao dịch.' },
    { h: '4. Gom thành cụm chủ đề', p: 'Các từ khóa gần nghĩa và cùng intent thường có thể đặt trong một trang. Các chủ đề khác biệt rõ nên tách thành bài hoặc landing page riêng để tránh cạnh tranh nội bộ (keyword cannibalization).' },
    { h: '5. Kiểm tra kết quả tìm kiếm', p: 'Trước khi viết, hãy xem loại trang nào đang xếp hạng: bài hướng dẫn, danh mục, trang sản phẩm hay video. Đây là bước xác nhận intent thực tế và ước lượng độ khó cạnh tranh.' },
    { h: '6. Không tạo trang mỏng hàng loạt', p: 'Mỗi URL index cần có giá trị riêng: dữ liệu, ví dụ, phân tích, công cụ hoặc hướng dẫn khác biệt. Thay một cụm từ trong mẫu không đủ tạo giá trị SEO và có thể khiến Google đánh giá thấp toàn site.' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Hướng dẫn nghiên cứu từ khóa', item: `${SITE_URL}/${GUIDE_SLUG}` },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'Cách nghiên cứu từ khóa từ đầu',
        description: GUIDE_META.description,
        inLanguage: 'vi-VN',
        step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.h, text: s.p })),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumb name="Hướng dẫn nghiên cứu từ khóa" />

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">{GUIDE_META.eyebrow}</p>
          <h1>{GUIDE_META.heading}</h1>
          <p className="heroText">Quy trình 6 bước để biến một chủ đề thành cấu trúc nội dung có thể triển khai — dễ áp dụng cho cả người mới.</p>
        </div>
      </section>

      <article className="container article narrow">
        {steps.map((s) => (
          <div key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </div>
        ))}
      </article>

      <section className="container">
        <div className="ctaBand">
          <h2>Áp dụng ngay với công cụ miễn phí</h2>
          <p>Nhập một chủ đề để tự động mở rộng, phân loại ý định và gom cụm — không cần đăng nhập.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/cong-cu-nghien-cuu-tu-khoa">Mở công cụ nghiên cứu từ khóa →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

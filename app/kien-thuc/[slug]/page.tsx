import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle } from '../../../lib/articles';
import { getSeoPage } from '../../../lib/seo-pages';
import { SITE_NAME, SITE_URL } from '../../../lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/kien-thuc/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/kien-thuc/${article.slug}`,
      type: 'article',
      publishedTime: `${article.updated}T00:00:00+07:00`,
      modifiedTime: `${article.updated}T00:00:00+07:00`,
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.description },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const relatedTools = article.relatedTools.map((s) => getSeoPage(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const relatedArticles = article.relatedArticles.map((s) => getArticle(s)).filter((a): a is NonNullable<typeof a> => Boolean(a));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Kiến thức', item: `${SITE_URL}/kien-thuc` },
          { '@type': 'ListItem', position: 3, name: article.heading, item: `${SITE_URL}/kien-thuc/${article.slug}` },
        ],
      },
      {
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: `${SITE_URL}/kien-thuc/${article.slug}/opengraph-image`,
        inLanguage: 'vi-VN',
        datePublished: `${article.updated}T00:00:00+07:00`,
        dateModified: `${article.updated}T00:00:00+07:00`,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/kien-thuc/${article.slug}` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item) => ({
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

      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <Link href="/kien-thuc">Kiến thức</Link>
        <span className="sep">/</span>
        <span className="current">{article.heading}</span>
      </nav>

      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">{article.eyebrow} · {article.readMinutes} phút đọc</p>
          <h1>{article.heading}</h1>
          <p className="heroText">{article.intro}</p>
        </div>
      </section>

      <article className="container article narrow">
        {article.sections.map((sec) => (
          <div key={sec.h2}>
            <h2>{sec.h2}</h2>
            {sec.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ))}

        <h2>Câu hỏi thường gặp</h2>
        <div className="faqGrid" style={{ marginTop: 8 }}>
          {article.faq.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </article>

      {(relatedTools.length > 0 || relatedArticles.length > 0) && (
        <section className="container relatedSection">
          <h2>Đọc tiếp & công cụ liên quan</h2>
          <div className="relatedGrid">
            {relatedTools.map((t) => (
              <Link className="relatedCard" href={`/${t.slug}`} key={t.slug}>
                <span>CÔNG CỤ · {t.eyebrow}</span>
                <strong>{t.heading} <span className="rArrow">→</span></strong>
              </Link>
            ))}
            {relatedArticles.map((a) => (
              <Link className="relatedCard" href={`/kien-thuc/${a.slug}`} key={a.slug}>
                <span>BÀI VIẾT</span>
                <strong>{a.heading} <span className="rArrow">→</span></strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container">
        <div className="ctaBand">
          <h2>Áp dụng ngay với công cụ miễn phí</h2>
          <p>Nhập một chủ đề để mở rộng từ khóa, phân loại ý định và gom cụm chủ đề — không cần đăng nhập.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/cong-cu-nghien-cuu-tu-khoa">Mở công cụ nghiên cứu từ khóa →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site';
import { SEO_PAGES } from '../lib/seo-pages';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Công cụ nghiên cứu từ khóa tiếng Việt miễn phí`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'nghiên cứu từ khóa',
    'công cụ từ khóa',
    'gợi ý từ khóa google',
    'gợi ý từ khóa youtube',
    'search intent',
    'nhóm từ khóa',
    'keyword research tiếng việt',
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Công cụ nghiên cứu từ khóa tiếng Việt miễn phí`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'vi-VN',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/cong-cu-nghien-cuu-tu-khoa?seed={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const year = new Date().getFullYear();
  const platformTools = SEO_PAGES.filter((p) => p.slug.startsWith('goi-y-'));
  const workflowTools = SEO_PAGES.filter((p) => !p.slug.startsWith('goi-y-'));

  return (
    <html lang="vi" className={beVietnam.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <header className="siteHeader">
          <div className="container headerInner">
            <Link className="brand" href="/">
              <span className="brandMark">T</span>
              <span>TừKhóa.vn</span>
            </Link>
            <nav className="mainNav" aria-label="Điều hướng chính">
              <Link className="navHideSm" href="/goi-y-tu-khoa-google">Google</Link>
              <Link className="navHideSm" href="/goi-y-tu-khoa-youtube">YouTube</Link>
              <Link className="navHideSm" href="/phan-loai-search-intent">Search intent</Link>
              <Link href="/kien-thuc">Kiến thức</Link>
              <Link className="navHideSm" href="/huong-dan-nghien-cuu-tu-khoa">Hướng dẫn</Link>
              <Link className="navCta" href="/cong-cu-nghien-cuu-tu-khoa">Mở công cụ</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container">
            <div className="footerGrid">
              <div className="footerBrand">
                <Link className="brand" href="/">
                  <span className="brandMark">T</span>
                  <span>TừKhóa.vn</span>
                </Link>
                <p>Công cụ nghiên cứu, phân loại và gom nhóm từ khóa tiếng Việt miễn phí. Không cần tài khoản, không lưu dữ liệu máy chủ.</p>
              </div>
              <div className="footerCol">
                <h4>Gợi ý từ khóa</h4>
                {platformTools.map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`}>{p.heading}</Link>
                ))}
              </div>
              <div className="footerCol">
                <h4>Phân tích</h4>
                {workflowTools.map((p) => (
                  <Link key={p.slug} href={`/${p.slug}`}>{p.heading}</Link>
                ))}
              </div>
              <div className="footerCol">
                <h4>Tài nguyên</h4>
                <Link href="/kien-thuc">Kiến thức SEO</Link>
                <Link href="/kien-thuc/search-intent-la-gi">Search intent là gì?</Link>
                <Link href="/kien-thuc/topic-cluster-la-gi">Topic cluster là gì?</Link>
                <Link href="/huong-dan-nghien-cuu-tu-khoa">Hướng dẫn nghiên cứu từ khóa</Link>
              </div>
            </div>
            <div className="footerBottom">
              <span>© {year} TừKhóa.vn</span>
              <span>Không yêu cầu tài khoản · Không lưu dữ liệu máy chủ</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { SEO_PAGES } from '../lib/seo-pages';

export default function NotFound() {
  return (
    <main>
      <section className="subHero">
        <div className="container narrow">
          <p className="eyebrow">LỖI 404</p>
          <h1>Không tìm thấy trang</h1>
          <p className="heroText">
            Trang bạn tìm không tồn tại hoặc đã được chuyển. Thử một trong các công cụ phổ biến bên dưới, hoặc quay về trang chủ.
          </p>
          <div className="ctaBtns" style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="primaryBtn" href="/" style={{ display: 'inline-flex', alignItems: 'center', padding: '0 22px' }}>
              Về trang chủ
            </Link>
            <Link className="secondaryButton" href="/cong-cu-nghien-cuu-tu-khoa" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Mở công cụ chính
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="sectionHeading">
          <p className="eyebrow">CÔNG CỤ</p>
          <h2>Có thể bạn đang tìm</h2>
        </div>
        <div className="pageGrid">
          {SEO_PAGES.slice(0, 6).map((page) => (
            <article className="pageCard" key={page.slug}>
              <p className="pcEyebrow">{page.eyebrow}</p>
              <h3>{page.heading}</h3>
              <p className="pcDesc">{page.intro}</p>
              <Link className="pcLink" href={`/${page.slug}`}>
                Mở công cụ →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

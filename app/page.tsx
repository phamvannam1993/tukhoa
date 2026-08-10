import Link from 'next/link';
import { KeywordTool } from '../components/KeywordTool';
import { SEO_PAGES } from '../lib/seo-pages';
import { SITE_NAME, SITE_URL } from '../lib/site';

const PAGE_ICONS: Record<string, string> = {
  'cong-cu-nghien-cuu-tu-khoa': '🔍',
  'goi-y-tu-khoa-google': '🟢',
  'goi-y-tu-khoa-youtube': '▶️',
  'goi-y-tu-khoa-tiktok': '🎵',
  'goi-y-tu-khoa-shopee': '🛍️',
  'phan-loai-search-intent': '🎯',
  'nhom-tu-khoa': '🧩',
  'gom-nhom-tu-khoa-hang-loat': '🗂️',
  'ban-do-tu-khoa': '🌳',
  'ke-hoach-noi-dung': '🗺️',
  'cau-hoi-tu-khoa': '❓',
  'so-sanh-tu-khoa-doi-thu': '⚔️',
};

const HOME_STEPS = [
  { title: 'Nhập ý tưởng gốc', detail: 'Bắt đầu từ một chủ đề, sản phẩm hoặc câu hỏi cụ thể mà người dùng đang quan tâm.' },
  { title: 'Mở rộng đa nguồn', detail: 'Lấy gợi ý Google, YouTube và bộ mẫu TikTok, Shopee để phủ nhiều góc nhu cầu.' },
  { title: 'Phân loại & gom cụm', detail: 'Xác định ý định tìm kiếm và gom truy vấn gần nghĩa thành cụm chủ đề rõ ràng.' },
  { title: 'Xuất & triển khai', detail: 'Tải CSV, biến mỗi cụm thành một trang và các câu hỏi dài thành tiêu đề phụ.' },
];

const HOME_FEATURES = [
  { icon: '⚡', title: 'Gợi ý thật, cập nhật', text: 'Google và YouTube Autocomplete trực tiếp — phản ánh những gì người dùng đang gõ, không phải danh sách tĩnh.' },
  { icon: '🎯', title: 'Hiểu đúng ý định', text: 'Tự động gán ý định (thông tin, thương mại, giao dịch…) theo bộ quy tắc tiếng Việt để bạn chọn đúng loại trang.' },
  { icon: '🧩', title: 'Sẵn sàng lên dàn ý', text: 'Gom cụm chủ đề và xuất CSV giúp bạn dựng cấu trúc nội dung, tránh trùng lặp và tối ưu topic cluster.' },
];

const HOME_FAQ = [
  { question: 'TừKhóa.vn có miễn phí không?', answer: 'Có. Toàn bộ công cụ miễn phí, không giới hạn số lần tra cứu và không yêu cầu tài khoản.' },
  { question: 'Công cụ có hiển thị volume tìm kiếm không?', answer: 'Không. Chúng tôi tập trung vào gợi ý và cấu trúc từ khóa. “Điểm cơ hội” là chỉ số tương đối để ưu tiên, không phải volume tuyệt đối.' },
  { question: 'Dữ liệu của tôi có bị lưu lại không?', answer: 'Không lưu phía máy chủ. Vài truy vấn gần nhất chỉ được lưu tạm trên chính trình duyệt của bạn (localStorage).' },
  { question: 'Có phù hợp cho người mới làm SEO không?', answer: 'Rất phù hợp. Công cụ dẫn bạn qua các bước: mở rộng ý tưởng, phân loại ý định và gom cụm — kèm hướng dẫn chi tiết.' },
];

export default function HomePage() {
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'vi-VN',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
    description: 'Công cụ nghiên cứu, phân loại và gom nhóm từ khóa tiếng Việt miễn phí.',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="hero">
        <div className="container heroInner">
          <span className="heroBadge"><span className="dot" /> Công cụ SEO miễn phí cho người Việt</span>
          <h1>
            Biến một ý tưởng thành <span className="heroTitleAccent">hàng trăm từ khóa.</span>
          </h1>
          <p className="heroText">
            Gợi ý Google, YouTube, TikTok và Shopee; phân loại ý định tìm kiếm, gom cụm chủ đề và xuất CSV — tất cả trong một công cụ, không cần đăng nhập.
          </p>
          <div className="heroTrust">
            <span>Miễn phí toàn bộ</span>
            <span>Không cần tài khoản</span>
            <span>Không lưu dữ liệu máy chủ</span>
            <span>Gợi ý cập nhật liên tục</span>
          </div>
        </div>
      </section>

      <KeywordTool defaultSources={['google', 'youtube']} />

      <section className="container section">
        <div className="sectionHeading">
          <p className="eyebrow">VÌ SAO CHỌN TỪKHÓA.VN</p>
          <h2>Đủ nhanh để dùng hằng ngày, đủ sâu để lên kế hoạch</h2>
        </div>
        <div className="featureGrid">
          {HOME_FEATURES.map((f) => (
            <article className="featureCard" key={f.title}>
              <div className="fIcon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="sectionHeading">
          <p className="eyebrow">BỘ CÔNG CỤ</p>
          <h2>Mỗi nhu cầu có một trang riêng</h2>
          <p className="sectionSub">Chọn đúng công cụ cho nền tảng và mục tiêu của bạn — mỗi trang tối ưu cho một loại truy vấn.</p>
        </div>
        <div className="pageGrid">
          {SEO_PAGES.map((page) => (
            <article className="pageCard" key={page.slug}>
              <div className="pageCardIcon">{PAGE_ICONS[page.slug] ?? '🔧'}</div>
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

      <section className="container stepsSection">
        <div className="sectionHeading">
          <p className="eyebrow">QUY TRÌNH 4 BƯỚC</p>
          <h2>Từ ý tưởng đến dàn ý nội dung</h2>
        </div>
        <div className="stepsGrid">
          {HOME_STEPS.map((s, i) => (
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
          <p className="eyebrow">KIẾN THỨC</p>
          <h2>Nghiên cứu từ khóa là gì?</h2>
        </div>
        <div className="prose">
          <p>
            Nghiên cứu từ khóa là quá trình tìm và sắp xếp những cụm từ mà người dùng thực sự gõ vào công cụ tìm kiếm, từ đó quyết định nên tạo nội dung gì và cho ai. Đây là nền móng của SEO: chọn đúng từ khóa giúp bạn tiếp cận đúng người, đúng thời điểm.
          </p>
          <p>
            Một quy trình tốt không dừng ở việc liệt kê từ khóa. Bạn cần <strong>phân loại theo ý định tìm kiếm</strong> để chọn đúng loại trang, rồi <strong>gom cụm chủ đề</strong> để tránh nhiều bài cùng tranh một truy vấn. TừKhóa.vn giúp bạn làm cả ba việc — mở rộng, phân loại và gom cụm — trong vài giây.
          </p>
          <p>
            Chúng tôi cố ý không chạy theo “volume trả phí” hay tự sinh hàng nghìn trang mỏng. Google xếp hạng những trang hữu ích, khớp ý định và có cấu trúc rõ ràng — đó chính là thứ bộ công cụ này được thiết kế để hỗ trợ.
          </p>
        </div>
      </section>

      <section className="container faqSection">
        <div className="sectionHeading">
          <p className="eyebrow">CÂU HỎI THƯỜNG GẶP</p>
          <h2>Giải đáp nhanh</h2>
        </div>
        <div className="faqGrid">
          {HOME_FAQ.map((f) => (
            <article key={f.question}>
              <h3>{f.question}</h3>
              <p>{f.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="ctaBand">
          <h2>Bắt đầu nghiên cứu từ khóa ngay</h2>
          <p>Nhập một chủ đề và nhận danh sách từ khóa đã phân loại trong vài giây. Không đăng ký, không giới hạn.</p>
          <div className="ctaBtns">
            <Link className="ctaWhite" href="/cong-cu-nghien-cuu-tu-khoa">Mở công cụ chính →</Link>
            <Link className="ctaGhost" href="/huong-dan-nghien-cuu-tu-khoa">Xem hướng dẫn</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

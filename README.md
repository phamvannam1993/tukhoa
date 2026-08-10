# TừKhóa.vn – bản lấy traffic, không database

Bản này chỉ dùng Next.js, không có MySQL, Prisma, đăng nhập hay lưu lịch sử phía máy chủ.

## Mục tiêu

- Công cụ miễn phí để thu hút backlink và người dùng quay lại.
- Landing page tĩnh cho từng nhóm từ khóa công cụ.
- Google và YouTube Autocomplete chạy qua API route của Next.js.
- TikTok và Shopee dùng bộ mẫu mở rộng, không giả mạo volume.
- Kết quả chỉ lưu tạm trên trình duyệt bằng `localStorage`.
- Có sitemap, robots, metadata và JSON-LD.

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`.

## Build production

```bash
npm run build
npm run start
```

## Deploy

Có thể deploy thẳng lên Vercel hoặc VPS Node.js. Vì có API route nên không dùng `output: export`.

## Các URL SEO có sẵn

- `/`
- `/cong-cu-nghien-cuu-tu-khoa`
- `/goi-y-tu-khoa-google`
- `/goi-y-tu-khoa-youtube`
- `/goi-y-tu-khoa-tiktok`
- `/goi-y-tu-khoa-shopee`
- `/phan-loai-search-intent`
- `/nhom-tu-khoa`
- `/gom-nhom-tu-khoa-hang-loat` – gom cụm hàng loạt (tối đa 10.000 từ khóa)
- `/ban-do-tu-khoa` – Keyword Universe dạng cây chủ đề
- `/ke-hoach-noi-dung` – kế hoạch pillar/cluster + content brief (.md)
- `/cau-hoi-tu-khoa` – Question Generator
- `/huong-dan-nghien-cuu-tu-khoa`

## Bộ công cụ SEO (giai đoạn 1–2 & một phần giai đoạn 4)

- **Gom cụm hàng loạt** – dán tới 10.000 từ khóa, gom cụm bằng Jaccard có trọng số IDF,
  chạy hoàn toàn trong trình duyệt. Có tùy chọn độ chặt của cụm.
- **Cây chủ đề (Keyword Universe)** – nhóm từ khóa theo modifier phổ biến, 2 tầng.
- **Kế hoạch nội dung** – sinh sơ đồ pillar/cluster, mỗi cụm một trang.
- **Content brief** – title, meta, H1, dàn ý H2/H3, từ khóa phụ, câu hỏi, entity,
  internal link; tải về dạng Markdown.
- **Question Generator** – `/api/keywords/expand` mở rộng từ khóa bằng tiền tố/hậu tố
  nghi vấn tiếng Việt qua Google Autocomplete, có bộ mẫu dự phòng.

Chưa làm (cần nguồn dữ liệu ngoài): Keyword Difficulty, SERP Analyzer, Keyword Gap,
Google Search Console, Rank Tracking. Xem phần “Lưu ý dữ liệu”.

## Lưu ý dữ liệu

- Google và YouTube: autocomplete trực tiếp, có cache theo URL.
- TikTok và Shopee: gợi ý theo mẫu ngôn ngữ, không phải dữ liệu tìm kiếm trực tiếp.
- Điểm cơ hội là điểm tương đối, tuyệt đối không gọi là volume.
- Không tự sinh hàng nghìn trang từ khóa mỏng. Muốn làm programmatic SEO cần thêm dữ liệu và nội dung khác biệt thật.

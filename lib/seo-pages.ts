export interface SeoStep {
  title: string;
  detail: string;
}

export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  /** Nhãn nền tảng hiển thị cạnh tiêu đề (Google, YouTube…) */
  platform?: 'google' | 'youtube' | 'tiktok' | 'shopee' | 'all';
  keywords: string[];
  bullets: string[];
  /** Trường hợp nên dùng công cụ này */
  useCases: string[];
  /** Quy trình dùng — đổ vào HowTo schema */
  steps: SeoStep[];
  /** Đoạn nội dung dài, tăng chiều sâu SEO (mỗi phần tử là 1 đoạn) */
  body: string[];
  /** Slug các công cụ liên quan để internal-link */
  related: string[];
  faq: Array<{ question: string; answer: string }>;
  defaultSources: Array<'google' | 'youtube' | 'tiktok' | 'shopee'>;
  /**
   * Công cụ hiển thị trên trang. Mặc định `keyword` là bộ mở rộng từ khóa cũ;
   * `cluster` / `universe` / `plan` dùng chung workbench nhưng mở sẵn tab tương ứng.
   */
  tool?: 'keyword' | 'cluster' | 'universe' | 'plan' | 'questions' | 'gap' | 'links';
}

export const SEO_PAGES: SeoPage[] = [
  {
    slug: 'cong-cu-nghien-cuu-tu-khoa',
    title: 'Công cụ nghiên cứu từ khóa miễn phí 2026 – Không cần đăng nhập',
    description:
      'Công cụ nghiên cứu từ khóa tiếng Việt miễn phí: mở rộng ý tưởng, gợi ý Google & YouTube, phân loại search intent, gom cụm chủ đề và xuất CSV. Không cần tài khoản.',
    eyebrow: 'CÔNG CỤ SEO MIỄN PHÍ',
    heading: 'Công cụ nghiên cứu từ khóa tiếng Việt',
    intro:
      'Nhập một chủ đề để tìm thêm hàng chục truy vấn liên quan, tự động phân nhóm theo ý định tìm kiếm và chuẩn bị kế hoạch nội dung — hoàn toàn miễn phí, không cần đăng nhập.',
    platform: 'all',
    keywords: [
      'công cụ nghiên cứu từ khóa',
      'nghiên cứu từ khóa miễn phí',
      'keyword research tool tiếng việt',
      'tìm từ khóa seo',
      'công cụ từ khóa google',
    ],
    bullets: [
      'Lấy gợi ý trực tiếp từ Google và YouTube Autocomplete.',
      'Tự động nhận diện ý định tìm kiếm bằng bộ quy tắc tiếng Việt.',
      'Gom từ khóa thành cụm chủ đề và xuất file CSV chỉ một cú nhấp.',
      'Không thu thập dữ liệu — mọi thứ xử lý ngay trong trình duyệt của bạn.',
    ],
    useCases: [
      'Lên kế hoạch nội dung blog, website theo cụm chủ đề (topic cluster).',
      'Tìm long-tail keyword ít cạnh tranh cho dự án mới.',
      'Kiểm tra nhanh ý định tìm kiếm trước khi viết bài.',
    ],
    steps: [
      { title: 'Nhập từ khóa gốc', detail: 'Gõ một chủ đề cụ thể, ví dụ “máy lọc không khí” hoặc “học tiếng Anh cho bé”.' },
      { title: 'Chọn nguồn gợi ý', detail: 'Bật Google và/hoặc YouTube. TikTok và Shopee dùng bộ mẫu mở rộng để lấy ý tưởng.' },
      { title: 'Lọc và phân nhóm', detail: 'Dùng bộ lọc theo ý định và cụm chủ đề để khoanh vùng nhóm từ khóa cần làm trước.' },
      { title: 'Xuất CSV & lên dàn ý', detail: 'Tải danh sách về, mỗi cụm là một trang, các câu hỏi dài thành tiêu đề phụ.' },
    ],
    body: [
      'Nghiên cứu từ khóa là bước đầu tiên và quan trọng nhất của mọi chiến dịch SEO. Thay vì đoán người dùng gõ gì, bạn xuất phát từ dữ liệu gợi ý thực tế mà công cụ tìm kiếm trả về, rồi sắp xếp chúng theo nhu cầu.',
      'TừKhóa.vn tập trung vào phần “ý tưởng và cấu trúc”: mở rộng một hạt giống thành nhiều biến thể, phân loại theo ý định (thông tin, thương mại, giao dịch…) và gom các truy vấn gần nghĩa vào cùng một cụm. Đây chính là bộ khung để bạn quyết định mỗi trang nên nhắm vào nhóm từ khóa nào.',
      'Công cụ không hiển thị volume trả phí và không tự sinh hàng nghìn trang mỏng. Mục tiêu là giúp bạn ra quyết định nội dung nhanh, đúng ý định — thứ Google thực sự đánh giá cao khi xếp hạng.',
    ],
    related: ['goi-y-tu-khoa-google', 'phan-loai-search-intent', 'nhom-tu-khoa'],
    faq: [
      {
        question: 'Công cụ có hiển thị volume (lượng tìm kiếm) thật không?',
        answer:
          'Không. Phiên bản miễn phí tập trung vào gợi ý và cấu trúc từ khóa. Điểm cơ hội chỉ là chỉ số tương đối để bạn ưu tiên, không phải volume tuyệt đối.',
      },
      {
        question: 'Có cần đăng ký tài khoản không?',
        answer: 'Không. Bạn dùng trực tiếp mà không cần đăng nhập; kết quả chỉ lưu tạm trên trình duyệt của bạn.',
      },
      {
        question: 'Dữ liệu gợi ý lấy từ đâu?',
        answer:
          'Google và YouTube lấy trực tiếp từ Autocomplete. TikTok và Shopee dùng bộ mẫu mở rộng ngôn ngữ để gợi ý ý tưởng, không phải dữ liệu tìm kiếm trực tiếp.',
      },
      {
        question: 'Tôi có thể dùng cho tiếng Anh không?',
        answer:
          'Được, nhưng công cụ tối ưu cho tiếng Việt (bộ quy tắc intent và gom cụm theo tiếng Việt). Với tiếng Anh, kết quả vẫn dùng tốt để lấy ý tưởng.',
      },
    ],
    defaultSources: ['google', 'youtube'],
  },
  {
    slug: 'goi-y-tu-khoa-google',
    title: 'Gợi ý từ khóa Google miễn phí – Google Autocomplete tiếng Việt',
    description:
      'Lấy danh sách gợi ý Google Autocomplete tiếng Việt, mở rộng theo tiền tố – hậu tố, tìm long-tail keyword và câu hỏi người dùng thật. Miễn phí, không đăng nhập.',
    eyebrow: 'GOOGLE AUTOCOMPLETE',
    heading: 'Gợi ý từ khóa Google',
    intro:
      'Thu thập những cụm từ Google thường gợi ý quanh một chủ đề để phát hiện câu hỏi, nhu cầu và các truy vấn dài (long-tail) mà người dùng thực sự gõ.',
    platform: 'google',
    keywords: [
      'gợi ý từ khóa google',
      'google autocomplete tiếng việt',
      'từ khóa google gợi ý',
      'tìm long tail keyword',
      'công cụ gợi ý google',
    ],
    bullets: [
      'Mở rộng theo tiền tố (cách, giá, mua…) và hậu tố (2026, ở đâu, review…).',
      'Phù hợp tìm long-tail keyword ít cạnh tranh.',
      'Có lọc theo từ, phân loại ý định và xuất CSV.',
    ],
    useCases: [
      'Tìm câu hỏi để làm tiêu đề phụ (H2/H3) cho bài viết.',
      'Phát hiện nhu cầu “mua/giá/ở đâu” để tách trang giao dịch.',
      'Khám phá biến thể theo địa phương, thương hiệu, năm.',
    ],
    steps: [
      { title: 'Nhập chủ đề', detail: 'Gõ từ khóa gốc, ví dụ “máy lọc không khí” hoặc “vé máy bay đà nẵng”.' },
      { title: 'Chọn nguồn Google', detail: 'Giữ Google được bật để lấy Autocomplete trực tiếp.' },
      { title: 'Lọc long-tail', detail: 'Dùng ô lọc để lọc các cụm dài, dạng câu hỏi hoặc chứa từ mua/giá.' },
      { title: 'Nhóm theo intent', detail: 'Tách truy vấn thông tin và truy vấn mua hàng thành trang khác nhau.' },
    ],
    body: [
      'Google Autocomplete phản ánh những gì nhiều người đang gõ quanh một chủ đề. Vì gợi ý được cập nhật liên tục, đây là nguồn ý tưởng long-tail rất tốt và hoàn toàn miễn phí.',
      'Bí quyết là mở rộng hạt giống theo nhiều hướng: thêm tiền tố (cách, giá, mua, review), thêm hậu tố (ở đâu, 2026, cho người mới) và ghép với địa phương hoặc thương hiệu. TừKhóa.vn tự động làm phần mở rộng đó rồi phân loại giúp bạn.',
      'Lưu ý: Autocomplete cho biết truy vấn phổ biến, không cho biết chính xác lượng tìm kiếm. Hãy dùng nó để tìm ý tưởng và ý định, sau đó xác nhận bằng cách xem kết quả tìm kiếm thực tế.',
    ],
    related: ['goi-y-tu-khoa-youtube', 'phan-loai-search-intent', 'cong-cu-nghien-cuu-tu-khoa'],
    faq: [
      {
        question: 'Gợi ý Google có phải volume không?',
        answer:
          'Không. Autocomplete phản ánh gợi ý truy vấn, không cung cấp lượng tìm kiếm chính xác. Hãy dùng để tìm ý tưởng và ý định.',
      },
      {
        question: 'Có thể dùng để lên dàn ý bài viết không?',
        answer:
          'Có. Hãy nhóm các từ khóa cùng ý định vào một bài và dùng các câu hỏi dài làm tiêu đề phụ.',
      },
      {
        question: 'Vì sao mỗi lần chạy kết quả có thể khác nhau?',
        answer:
          'Autocomplete thay đổi theo thời gian và ngữ cảnh, nên danh sách gợi ý có thể cập nhật giữa các lần tra cứu.',
      },
    ],
    defaultSources: ['google'],
  },
  {
    slug: 'goi-y-tu-khoa-youtube',
    title: 'Gợi ý từ khóa YouTube miễn phí – Ý tưởng video & Shorts',
    description:
      'Tìm ý tưởng video bằng YouTube Autocomplete tiếng Việt: chủ đề hướng dẫn, review, Shorts. Phân nhóm theo nhu cầu và xuất CSV để lên lịch nội dung. Miễn phí.',
    eyebrow: 'YOUTUBE AUTOCOMPLETE',
    heading: 'Gợi ý từ khóa YouTube',
    intro:
      'Tìm chủ đề video, cách làm, review và câu hỏi mà người dùng có thể nhập trên YouTube — nguồn ý tưởng dồi dào cho cả video dài và Shorts.',
    platform: 'youtube',
    keywords: [
      'gợi ý từ khóa youtube',
      'youtube autocomplete',
      'từ khóa video youtube',
      'ý tưởng video youtube',
      'nghiên cứu từ khóa youtube',
    ],
    bullets: [
      'Phát hiện chủ đề cho video dài và video ngắn (Shorts).',
      'Nhóm theo nhu cầu: hướng dẫn, review hay giải trí.',
      'Xuất CSV để lên lịch sản xuất nội dung.',
    ],
    useCases: [
      'Tìm tiêu đề video bám đúng truy vấn người xem gõ.',
      'Lên chuỗi Shorts từ các câu hỏi ngắn, dễ trả lời.',
      'Phân biệt chủ đề “cách làm” và chủ đề “review/so sánh”.',
    ],
    steps: [
      { title: 'Nhập chủ đề video', detail: 'Ví dụ “dựng video bằng capcut” hay “tập gym cho người mới”.' },
      { title: 'Bật nguồn YouTube', detail: 'Lấy Autocomplete từ chính thanh tìm kiếm YouTube.' },
      { title: 'Lọc theo dạng nội dung', detail: 'Tách nhóm hướng dẫn, review và giải trí để chọn định dạng phù hợp.' },
      { title: 'Lên lịch & sản xuất', detail: 'Xuất CSV, mỗi cụm là một series hoặc một video trụ cột.' },
    ],
    body: [
      'Khác với Google, người dùng YouTube thường tìm nội dung “xem được”: cách làm, hướng dẫn từng bước, review, phản ứng. Vì thế gợi ý YouTube giúp bạn chọn đúng định dạng video, không chỉ đúng chủ đề.',
      'Với video ngắn (Shorts), hãy ưu tiên các truy vấn ngắn, nêu rõ vấn đề và có thể giải quyết gọn trong dưới một phút. Với video dài, chọn các cụm chủ đề rộng hơn để làm nội dung trụ cột và dẫn link sang các video con.',
    ],
    related: ['goi-y-tu-khoa-google', 'goi-y-tu-khoa-tiktok', 'nhom-tu-khoa'],
    faq: [
      {
        question: 'Có dùng cho YouTube Shorts được không?',
        answer:
          'Có. Nên ưu tiên các truy vấn ngắn, rõ vấn đề và có thể trả lời trọn vẹn trong một video ngắn.',
      },
      {
        question: 'Có dữ liệu lượt tìm kiếm YouTube không?',
        answer:
          'Không. Công cụ hiện dùng autocomplete, không gọi dữ liệu volume trả phí.',
      },
      {
        question: 'Nên đặt từ khóa ở đâu trong video?',
        answer:
          'Đặt từ khóa chính trong tiêu đề, vài câu đầu mô tả và trong lời thoại mở đầu; tránh nhồi nhét gượng ép.',
      },
    ],
    defaultSources: ['youtube'],
  },
  {
    slug: 'goi-y-tu-khoa-tiktok',
    title: 'Gợi ý từ khóa TikTok – Ý tưởng nội dung & xu hướng',
    description:
      'Mở rộng ý tưởng nội dung TikTok từ một từ khóa gốc: hướng dẫn, xu hướng, review, video cho người mới. Kèm phân loại intent và cụm chủ đề. Miễn phí.',
    eyebrow: 'Ý TƯỞNG TIKTOK',
    heading: 'Gợi ý từ khóa TikTok',
    intro:
      'Tạo nhanh các biến thể nội dung TikTok như hướng dẫn, xu hướng, review và nội dung cho người mới — dùng làm nguồn brainstorm cho kịch bản video ngắn.',
    platform: 'tiktok',
    keywords: [
      'gợi ý từ khóa tiktok',
      'ý tưởng nội dung tiktok',
      'từ khóa tiktok',
      'trend tiktok 2026',
      'hashtag tiktok',
    ],
    bullets: [
      'Không cần đăng nhập, tạo ý tưởng nhanh.',
      'Phù hợp brainstorming nội dung ngắn theo chủ đề.',
      'Không giả mạo lượt tìm kiếm hay volume TikTok.',
    ],
    useCases: [
      'Lên loạt kịch bản video ngắn quanh một chủ đề.',
      'Tìm góc nội dung “mẹo/xu hướng/trước-sau” dễ viral.',
      'Chuẩn bị caption và hashtag ý tưởng.',
    ],
    steps: [
      { title: 'Nhập chủ đề', detail: 'Ví dụ “trang điểm dự tiệc” hay “món ăn healthy”.' },
      { title: 'Bật nguồn TikTok', detail: 'Dùng bộ mẫu mở rộng để tạo biến thể ý tưởng nội dung.' },
      { title: 'Chọn góc nội dung', detail: 'Ưu tiên các ý tưởng có vấn đề cụ thể, dễ minh họa bằng hình ảnh.' },
      { title: 'Viết kịch bản', detail: 'Mỗi ý tưởng thành một video; câu hỏi thành hook mở đầu.' },
    ],
    body: [
      'TikTok là nền tảng theo xu hướng và cảm xúc, nên nội dung thắng thường xoay quanh một vấn đề cụ thể, một mẹo bất ngờ hoặc một khoảnh khắc “trước – sau”. Danh sách gợi ý ở đây giúp bạn có nhiều góc tiếp cận cho cùng một chủ đề.',
      'Lưu ý minh bạch: các gợi ý TikTok được tạo từ bộ mẫu mở rộng ngôn ngữ, không phải dữ liệu tìm kiếm trực tiếp của TikTok. Hãy dùng chúng như nguồn ý tưởng, rồi kiểm tra xu hướng thật trên chính ứng dụng.',
    ],
    related: ['goi-y-tu-khoa-youtube', 'goi-y-tu-khoa-shopee', 'phan-loai-search-intent'],
    faq: [
      {
        question: 'Đây có phải dữ liệu trực tiếp từ TikTok không?',
        answer:
          'Không. Phiên bản này dùng mẫu mở rộng ngôn ngữ để gợi ý ý tưởng, không tuyên bố là dữ liệu tìm kiếm trực tiếp.',
      },
      {
        question: 'Nên chọn ý tưởng nào để làm video?',
        answer:
          'Ưu tiên truy vấn có vấn đề cụ thể, dễ minh họa và trả lời trọn vẹn trong một video ngắn.',
      },
    ],
    defaultSources: ['tiktok'],
  },
  {
    slug: 'goi-y-tu-khoa-shopee',
    title: 'Gợi ý từ khóa Shopee – Tối ưu tên & mô tả sản phẩm',
    description:
      'Mở rộng từ khóa sản phẩm Shopee theo nhu cầu mua, giá, chính hãng, review, khuyến mãi. Tạo bộ biến thể cho tên và mô tả sản phẩm để SEO sàn TMĐT. Miễn phí.',
    eyebrow: 'TỪ KHÓA SẢN PHẨM',
    heading: 'Gợi ý từ khóa Shopee',
    intro:
      'Tạo bộ biến thể cho tên sản phẩm, nội dung mô tả, bài review và landing page thương mại điện tử — bám đúng cách người mua tìm sản phẩm.',
    platform: 'shopee',
    keywords: [
      'gợi ý từ khóa shopee',
      'từ khóa sản phẩm shopee',
      'seo shopee',
      'tối ưu tên sản phẩm shopee',
      'từ khóa bán hàng',
    ],
    bullets: [
      'Mở rộng theo nhu cầu mua hàng (giá, chính hãng, freeship…).',
      'Nhận diện truy vấn giao dịch và thương mại.',
      'Xuất CSV để biên tập tên và mô tả sản phẩm hàng loạt.',
    ],
    useCases: [
      'Đặt tên sản phẩm chứa từ khóa người mua thật sự gõ.',
      'Viết mô tả có các biến thể “giá rẻ / chính hãng / review”.',
      'Lên nội dung landing thương mại điện tử.',
    ],
    steps: [
      { title: 'Nhập tên sản phẩm', detail: 'Ví dụ “tai nghe bluetooth” hay “nồi chiên không dầu”.' },
      { title: 'Bật nguồn Shopee', detail: 'Dùng bộ mẫu mở rộng theo nhu cầu mua để lấy biến thể.' },
      { title: 'Lọc truy vấn giao dịch', detail: 'Ưu tiên nhóm “mua/giá/chính hãng” cho tên và mô tả.' },
      { title: 'Biên tập tên & mô tả', detail: 'Chọn 3–5 đặc điểm người mua quan tâm nhất, viết tự nhiên.' },
    ],
    body: [
      'Trên sàn thương mại điện tử, người mua tìm theo nhu cầu rất rõ: giá rẻ, chính hãng, freeship, bán chạy, loại nào tốt. Bám đúng những cụm này trong tên và mô tả giúp sản phẩm dễ hiển thị và tăng tỉ lệ nhấp.',
      'Tuy nhiên, đừng nhồi mọi từ khóa vào tên sản phẩm. Hãy chọn 3–5 đặc điểm quan trọng nhất, viết rõ ràng, tự nhiên; phần biến thể còn lại đưa vào mô tả và thẻ nội dung.',
    ],
    related: ['goi-y-tu-khoa-google', 'phan-loai-search-intent', 'cong-cu-nghien-cuu-tu-khoa'],
    faq: [
      {
        question: 'Có lấy dữ liệu trực tiếp từ Shopee không?',
        answer:
          'Không. Đây là bộ mở rộng theo mẫu, phù hợp lên ý tưởng chứ không phải volume Shopee.',
      },
      {
        question: 'Có nên nhồi mọi từ khóa vào tên sản phẩm?',
        answer:
          'Không. Tên sản phẩm cần rõ, tự nhiên và ưu tiên các đặc điểm người mua thực sự quan tâm.',
      },
    ],
    defaultSources: ['shopee'],
  },
  {
    slug: 'phan-loai-search-intent',
    title: 'Phân loại Search Intent tiếng Việt – Xác định ý định tìm kiếm',
    description:
      'Phân loại từ khóa thành thông tin, thương mại, giao dịch, điều hướng và địa phương. Chọn đúng loại trang cho từng ý định để SEO hiệu quả. Công cụ miễn phí.',
    eyebrow: 'SEARCH INTENT',
    heading: 'Phân loại ý định tìm kiếm',
    intro:
      'Nhận diện mục tiêu phía sau mỗi truy vấn để chọn đúng loại trang: bài hướng dẫn, trang so sánh, danh mục hay trang sản phẩm.',
    platform: 'all',
    keywords: [
      'search intent',
      'ý định tìm kiếm',
      'phân loại search intent',
      'intent từ khóa',
      'informational transactional',
    ],
    bullets: [
      'Thông tin: cách làm, là gì, hướng dẫn.',
      'Thương mại: review, so sánh, tốt nhất.',
      'Giao dịch: mua, giá, đăng ký, tải.',
      'Điều hướng & địa phương: theo thương hiệu, gần đây.',
    ],
    useCases: [
      'Quyết định định dạng trang trước khi viết.',
      'Tránh gộp truy vấn tìm hiểu và mua hàng vào một trang.',
      'Sắp xếp phễu nội dung theo hành trình người dùng.',
    ],
    steps: [
      { title: 'Nhập cụm từ khóa', detail: 'Nhập chủ đề để công cụ mở rộng và gán ý định cho từng truy vấn.' },
      { title: 'Đọc nhãn intent', detail: 'Mỗi từ khóa được gán một trong 5 ý định nổi bật theo quy tắc tiếng Việt.' },
      { title: 'Lọc theo intent', detail: 'Xem riêng nhóm thông tin, thương mại hoặc giao dịch.' },
      { title: 'Chọn loại trang', detail: 'Thông tin → bài hướng dẫn; thương mại → so sánh; giao dịch → trang sản phẩm.' },
    ],
    body: [
      'Search intent (ý định tìm kiếm) là lý do thực sự phía sau một truy vấn. Google ưu tiên xếp hạng trang khớp ý định, nên chọn sai loại trang khiến bạn khó lên top dù nội dung dài hay tối ưu kỹ thuật tốt.',
      'Có năm nhóm ý định phổ biến: thông tin (muốn hiểu/biết cách), thương mại (đang cân nhắc, so sánh), giao dịch (sẵn sàng mua/đăng ký/tải), điều hướng (tìm một thương hiệu/trang cụ thể) và địa phương (tìm dịch vụ gần vị trí). Công cụ gán nhãn ý định nổi bật nhất, nhưng bạn vẫn nên kiểm chứng bằng kết quả tìm kiếm thực tế.',
    ],
    related: ['nhom-tu-khoa', 'goi-y-tu-khoa-google', 'huong-dan-nghien-cuu-tu-khoa'],
    faq: [
      {
        question: 'Một từ khóa có thể có nhiều intent không?',
        answer:
          'Có. Công cụ chọn intent nổi bật nhất theo quy tắc; bạn vẫn nên kiểm tra kết quả tìm kiếm thực tế.',
      },
      {
        question: 'Intent ảnh hưởng SEO thế nào?',
        answer:
          'Trang không khớp intent thường khó cạnh tranh dù nội dung dài hoặc tối ưu kỹ thuật tốt.',
      },
      {
        question: 'Làm sao xác nhận intent chính xác?',
        answer:
          'Gõ thử từ khóa trên Google và xem loại trang đang xếp hạng: hướng dẫn, danh mục, sản phẩm hay video.',
      },
    ],
    defaultSources: ['google'],
  },
  {
    slug: 'nhom-tu-khoa',
    title: 'Công cụ nhóm từ khóa (Keyword Clustering) miễn phí tiếng Việt',
    description:
      'Gom từ khóa tiếng Việt thành các cụm chủ đề để tránh trùng lặp nội dung, xác định trang trụ cột và tiêu đề phụ. Xuất CSV. Công cụ clustering miễn phí.',
    eyebrow: 'KEYWORD CLUSTERING',
    heading: 'Nhóm từ khóa thành cụm chủ đề',
    intro:
      'Gộp các truy vấn gần nhau để xác định một trang chính, các tiêu đề phụ và những nội dung hỗ trợ cần xây dựng — nền tảng của mô hình topic cluster.',
    platform: 'all',
    keywords: [
      'nhóm từ khóa',
      'keyword clustering',
      'gom cụm từ khóa',
      'topic cluster',
      'cụm chủ đề seo',
    ],
    bullets: [
      'Nhóm dựa trên mức độ giống nhau của từ.',
      'Giảm nguy cơ nhiều bài cùng tranh một truy vấn (keyword cannibalization).',
      'Xuất CSV để chỉnh sửa và lên cấu trúc site.',
    ],
    useCases: [
      'Xây mô hình topic cluster (trang trụ cột + bài con).',
      'Gộp các bài trùng ý định để tránh cạnh tranh nội bộ.',
      'Lập bản đồ nội dung (content map) cho cả website.',
    ],
    steps: [
      { title: 'Nhập chủ đề rộng', detail: 'Ví dụ “seo”, “chạy bộ” hay “đầu tư chứng khoán”.' },
      { title: 'Chạy mở rộng', detail: 'Công cụ lấy gợi ý và gom các truy vấn gần nghĩa vào cùng cụm.' },
      { title: 'Xem cụm chủ đề', detail: 'Mỗi cụm gợi ý một trang; đọc tên cụm để đặt trang trụ cột.' },
      { title: 'Lên cấu trúc site', detail: 'Trang trụ cột liên kết tới các bài con cùng cụm, tránh trùng lặp.' },
    ],
    body: [
      'Keyword clustering (gom cụm từ khóa) giúp bạn trả lời câu hỏi cốt lõi: “nên gộp hay tách thành nhiều trang?”. Các truy vấn cùng ý định và cùng loại kết quả mong muốn thường nên nằm chung một trang; ngược lại, chủ đề khác biệt rõ nên tách riêng.',
      'Gom cụm tốt giúp tránh keyword cannibalization — tình trạng nhiều trang của cùng một site tranh nhau một truy vấn, làm loãng tín hiệu và khó lên top. Đây cũng là bước dựng khung cho mô hình topic cluster với trang trụ cột và các bài con liên kết chặt.',
      'Lưu ý: bản miễn phí gom cụm theo mức tương đồng ngôn ngữ. Với dự án quan trọng, hãy đối chiếu thêm kết quả SERP để xác nhận các truy vấn có thật sự chia sẻ cùng loại trang hay không.',
    ],
    related: ['phan-loai-search-intent', 'cong-cu-nghien-cuu-tu-khoa', 'huong-dan-nghien-cuu-tu-khoa'],
    faq: [
      {
        question: 'Nhóm từ khóa có thay thế phân tích SERP không?',
        answer:
          'Không. Đây là nhóm ngôn ngữ cơ bản; các dự án quan trọng vẫn cần so sánh kết quả tìm kiếm thực tế.',
      },
      {
        question: 'Mỗi cluster nên là một bài viết?',
        answer:
          'Thường là một trang, nhưng chỉ khi các truy vấn có cùng intent và cùng loại kết quả mong muốn.',
      },
      {
        question: 'Keyword cannibalization là gì?',
        answer:
          'Là khi nhiều trang cùng site nhắm cùng một truy vấn, khiến chúng cạnh tranh lẫn nhau và đều khó lên hạng. Gom cụm giúp phòng tránh điều này.',
      },
    ],
    defaultSources: ['google', 'youtube'],
  },
  {
    slug: 'gom-nhom-tu-khoa-hang-loat',
    title: 'Gom nhóm từ khóa hàng loạt (Keyword Clustering) – dán 10.000 từ khóa',
    description:
      'Dán tới 10.000 từ khóa, công cụ tự gom thành cụm chủ đề, gán search intent và gợi ý loại trang nên tạo. Miễn phí, xử lý ngay trong trình duyệt, xuất CSV.',
    eyebrow: 'CLUSTERING HÀNG LOẠT',
    heading: 'Gom nhóm từ khóa hàng loạt',
    intro:
      'Dán danh sách từ khóa xuất từ Search Console, Ahrefs hay Keyword Planner. Công cụ gom thành cụm chủ đề, gán ý định tìm kiếm và cho biết mỗi cụm nên là bài viết, danh mục hay trang sản phẩm.',
    platform: 'all',
    keywords: [
      'gom nhóm từ khóa',
      'keyword clustering tiếng việt',
      'công cụ gom cụm từ khóa miễn phí',
      'phân nhóm từ khóa hàng loạt',
      'keyword grouping tool',
    ],
    bullets: [
      'Xử lý tới 10.000 từ khóa ngay trong trình duyệt, không gửi dữ liệu lên máy chủ.',
      'Gom cụm theo trọng số IDF nên head term luôn là tên cụm.',
      'Mỗi cụm có sẵn search intent và loại trang nên tạo.',
      'Xuất CSV và chuyển thẳng sang content brief.',
    ],
    useCases: [
      'Dọn danh sách vài nghìn từ khóa thành bản đồ trang rõ ràng.',
      'Phát hiện các nhóm từ khóa đang bị nhiều bài viết tranh nhau.',
      'Chuẩn bị cấu trúc site trước khi viết nội dung.',
    ],
    steps: [
      { title: 'Dán danh sách', detail: 'Mỗi dòng một từ khóa, hoặc bấm “Lấy tự động” từ một từ khóa gốc.' },
      { title: 'Bấm phân tích', detail: 'Công cụ loại trùng, gom cụm và gán ý định trong vài giây.' },
      { title: 'Rà lại từng cụm', detail: 'Gộp hoặc tách cụm theo hiểu biết thực tế về ngành của bạn.' },
      { title: 'Xuất CSV / tạo brief', detail: 'Mỗi cụm là một trang; bấm “Tạo content brief” để có dàn ý.' },
    ],
    body: [
      'Khi danh sách từ khóa vượt vài trăm dòng, việc gom nhóm thủ công trở nên bất khả thi. Công cụ này so sánh từ khóa theo token có trọng số IDF: các từ hiếm (tên thương hiệu, địa danh, model) có sức nặng lớn hơn những từ xuất hiện ở mọi truy vấn, nhờ vậy “máy lọc nước karofi” và “máy lọc nước kangaroo” không bị gộp làm một.',
      'Mỗi cụm được đặt tên bằng từ khóa ngắn nhất trong cụm — thường chính là head term bạn muốn nhắm. Ý định tìm kiếm của cụm lấy theo đa số các từ khóa thành viên, từ đó suy ra loại trang phù hợp: bài viết, bài so sánh, danh mục hay trang sản phẩm.',
      'Toàn bộ tính toán chạy trong trình duyệt. Danh sách từ khóa của bạn — thứ thường là tài sản của dự án — không rời khỏi máy.',
    ],
    related: ['ban-do-tu-khoa', 'ke-hoach-noi-dung', 'phan-loai-search-intent'],
    faq: [
      {
        question: 'Tối đa bao nhiêu từ khóa?',
        answer: '10.000 từ khóa mỗi lần. Từ khóa trùng sẽ tự động bị loại và được báo lại số lượng.',
      },
      {
        question: 'Dữ liệu có được gửi lên máy chủ không?',
        answer:
          'Không. Việc gom cụm chạy hoàn toàn trong trình duyệt. Chỉ khi bạn bấm “Lấy tự động” thì từ khóa gốc mới được gửi tới API gợi ý.',
      },
      {
        question: 'Vì sao một cụm bị tách/gộp chưa đúng ý?',
        answer:
          'Thuật toán dựa trên độ tương đồng ngôn ngữ, không đọc SERP. Với chủ đề quan trọng, hãy kiểm tra kết quả tìm kiếm thực tế rồi gộp/tách lại thủ công.',
      },
    ],
    defaultSources: ['google', 'youtube'],
    tool: 'cluster',
  },
  {
    slug: 'ban-do-tu-khoa',
    title: 'Keyword Universe – bản đồ cây chủ đề từ khóa tiếng Việt',
    description:
      'Biến danh sách từ khóa thành cây chủ đề nhiều tầng để thấy ngay website cần viết những nhóm nội dung nào. Miễn phí, không cần đăng nhập.',
    eyebrow: 'KEYWORD UNIVERSE',
    heading: 'Bản đồ cây chủ đề từ khóa',
    intro:
      'Nhập một chủ đề rộng, công cụ dựng cây phân nhánh theo các từ bổ nghĩa phổ biến nhất — bạn nhìn một lần là biết website cần bao phủ những nhánh nội dung nào.',
    platform: 'all',
    keywords: [
      'keyword universe',
      'bản đồ từ khóa',
      'cây chủ đề seo',
      'content map từ khóa',
      'sơ đồ từ khóa tiếng việt',
    ],
    bullets: [
      'Cây chủ đề 2 tầng dựng tự động từ danh sách từ khóa.',
      'Tự loại phần lõi lặp lại để chỉ còn các nhánh khác biệt.',
      'Đếm số từ khóa mỗi nhánh để biết nhánh nào đáng đầu tư trước.',
    ],
    useCases: [
      'Lập content map cho website mới.',
      'Tìm nhánh chủ đề còn thiếu so với đối thủ.',
      'Trình bày kế hoạch nội dung cho khách hàng, cấp trên.',
    ],
    steps: [
      { title: 'Nhập chủ đề gốc', detail: 'Ví dụ “du lịch”, “máy lọc nước”, “học tiếng Anh”.' },
      { title: 'Lấy hoặc dán từ khóa', detail: 'Bấm “Lấy tự động” hoặc dán danh sách có sẵn.' },
      { title: 'Mở tab Cây chủ đề', detail: 'Bung từng nhánh để xem nhóm con và các từ khóa thuộc nhánh.' },
      { title: 'Chốt nhánh ưu tiên', detail: 'Nhánh nhiều từ khóa và intent thương mại nên làm trước.' },
    ],
    body: [
      'Danh sách phẳng hàng nghìn dòng rất khó ra quyết định. Cây chủ đề trả lời trực tiếp câu hỏi “website của tôi cần viết những chủ đề nào?” bằng cách nhóm từ khóa theo các từ bổ nghĩa xuất hiện nhiều nhất, sau khi đã loại bỏ phần lõi mà gần như từ khóa nào cũng chứa.',
      'Ví dụ với chủ đề “du lịch”, phần lõi “du lịch” bị loại, còn lại các nhánh như “đà nẵng”, “nha trang”, “kinh nghiệm”, “chi phí” — mỗi nhánh là một cụm nội dung có thể phát triển thành nhiều bài.',
      'Số đếm cạnh mỗi nhánh cho biết độ dày nhu cầu. Nhánh dày mà site bạn chưa có bài nào chính là khoảng trống nội dung đáng lấp trước.',
    ],
    related: ['gom-nhom-tu-khoa-hang-loat', 'ke-hoach-noi-dung', 'cong-cu-nghien-cuu-tu-khoa'],
    faq: [
      {
        question: 'Cây chủ đề khác gì gom cụm?',
        answer:
          'Gom cụm cho biết từ khóa nào nên nằm chung một trang. Cây chủ đề cho biết toàn bộ chủ đề chia thành những nhánh lớn nào — dùng để dựng cấu trúc site.',
      },
      {
        question: 'Cây có bao nhiêu tầng?',
        answer: 'Hai tầng nhánh dưới gốc. Đủ để dựng cấu trúc chuyên mục mà không rối mắt.',
      },
    ],
    defaultSources: ['google', 'youtube'],
    tool: 'universe',
  },
  {
    slug: 'ke-hoach-noi-dung',
    title: 'Lập kế hoạch nội dung SEO từ từ khóa – Pillar & Cluster tự động',
    description:
      'Từ một từ khóa gốc, tạo ngay kế hoạch nội dung theo mô hình pillar – cluster: tiêu đề đề xuất, loại trang, search intent và content brief chi tiết cho từng bài.',
    eyebrow: 'CONTENT PLAN',
    heading: 'Kế hoạch nội dung & content brief',
    intro:
      'Biến danh sách từ khóa thành kế hoạch triển khai: một trang trụ cột, các bài cluster xoay quanh, kèm tiêu đề, loại trang và dàn ý H2/H3 tải về dạng Markdown.',
    platform: 'all',
    keywords: [
      'kế hoạch nội dung seo',
      'content plan từ khóa',
      'pillar cluster',
      'content brief tiếng việt',
      'lập dàn ý bài seo',
    ],
    bullets: [
      'Sinh sơ đồ pillar – cluster từ danh sách từ khóa.',
      'Mỗi bài có tiêu đề, meta description, H1 và dàn ý H2/H3 gợi ý.',
      'Có sẵn từ khóa phụ, câu hỏi FAQ, entity và internal link nên đặt.',
      'Tải content brief dạng Markdown để đưa thẳng cho người viết.',
    ],
    useCases: [
      'Giao brief cho cộng tác viên viết bài mà không phải soạn tay.',
      'Lập lịch nội dung 3–6 tháng cho một chủ đề lớn.',
      'Chuẩn hóa cấu trúc bài viết trong cả team.',
    ],
    steps: [
      { title: 'Nhập từ khóa gốc', detail: 'Từ khóa này sẽ trở thành trang trụ cột (pillar).' },
      { title: 'Lấy / dán từ khóa', detail: 'Công cụ gom cụm rồi dựng kế hoạch từ các cụm đó.' },
      { title: 'Xem tab Kế hoạch', detail: 'Mỗi dòng là một trang cần tạo, kèm loại trang và intent.' },
      { title: 'Tải content brief', detail: 'Chọn cụm, xem dàn ý và tải file .md giao cho người viết.' },
    ],
    body: [
      'Mô hình pillar – cluster là cách tổ chức nội dung được dùng phổ biến nhất hiện nay: một trang trụ cột bao quát chủ đề lớn, liên kết tới các bài con đi sâu từng khía cạnh, và các bài con trỏ ngược về trang trụ cột. Cấu trúc này giúp công cụ tìm kiếm hiểu website của bạn có chiều sâu về một chủ đề.',
      'Công cụ tự chọn trang trụ cột theo từ khóa gốc bạn nhập, rồi biến mỗi cụm từ khóa thành một trang con với tiêu đề và loại trang phù hợp với ý định tìm kiếm của cụm đó.',
      'Content brief được sinh theo quy tắc, không phải nội dung viết sẵn: nó cho bạn khung tiêu đề, câu hỏi cần trả lời, từ khóa phụ và entity nên nhắc tới. Phần viết vẫn cần con người — đó cũng là thứ Google đánh giá cao.',
    ],
    related: ['gom-nhom-tu-khoa-hang-loat', 'ban-do-tu-khoa', 'cau-hoi-tu-khoa'],
    faq: [
      {
        question: 'Công cụ có viết bài hộ không?',
        answer:
          'Không. Công cụ tạo khung: tiêu đề, dàn ý, từ khóa phụ và câu hỏi cần trả lời. Nội dung vẫn do bạn viết để đảm bảo chất lượng và tính khác biệt.',
      },
      {
        question: 'Độ dài bài đề xuất tính thế nào?',
        answer:
          'Dựa trên loại trang và số từ khóa trong cụm. Đây là khoảng tham khảo, không phải mục tiêu bắt buộc — nội dung đủ ý luôn quan trọng hơn số từ.',
      },
      {
        question: 'Brief có xuất được file không?',
        answer: 'Có. Bạn tải về dạng Markdown (.md) để dán vào Google Docs, Notion hoặc CMS.',
      },
    ],
    defaultSources: ['google', 'youtube'],
    tool: 'plan',
  },
  {
    slug: 'cau-hoi-tu-khoa',
    title: 'Công cụ tìm câu hỏi theo từ khóa (Question Generator) tiếng Việt',
    description:
      'Tìm các câu hỏi người dùng thật sự tìm kiếm: là gì, có nên, tại sao, bao nhiêu, ở đâu, khi nào… Dùng làm H2/H3 và mục FAQ có schema. Miễn phí.',
    eyebrow: 'QUESTION GENERATOR',
    heading: 'Tìm câu hỏi quanh một từ khóa',
    intro:
      'Nhập một chủ đề, công cụ trả về các câu hỏi thường gặp nhóm theo dạng: định nghĩa, cách làm, lựa chọn, chi phí, thời điểm — nguyên liệu sẵn sàng cho phần FAQ và tiêu đề phụ.',
    platform: 'google',
    keywords: [
      'tìm câu hỏi từ khóa',
      'question keyword tool',
      'câu hỏi thường gặp seo',
      'answer the public tiếng việt',
      'faq schema từ khóa',
    ],
    bullets: [
      'Lấy câu hỏi thật từ Google Autocomplete với nhiều tiền tố và hậu tố tiếng Việt.',
      'Nhóm sẵn theo dạng câu hỏi để dựng dàn ý nhanh.',
      'Chép nhanh hoặc tải .txt để đưa vào brief.',
    ],
    useCases: [
      'Viết phần FAQ có schema để tăng cơ hội hiển thị nổi bật.',
      'Bổ sung H2/H3 cho bài viết đang thiếu chiều sâu.',
      'Tìm ý tưởng landing page dạng câu hỏi long-tail.',
    ],
    steps: [
      { title: 'Nhập chủ đề', detail: 'Ví dụ “trồng cây”, “máy lọc nước”, “vay tín chấp”.' },
      { title: 'Xem theo nhóm', detail: 'Câu hỏi được chia theo dạng: là gì, cách làm, có nên, bao nhiêu, ở đâu.' },
      { title: 'Chọn câu hỏi phù hợp', detail: 'Ưu tiên câu hỏi đúng ý định của trang bạn đang viết.' },
      { title: 'Đưa vào bài', detail: 'Dùng làm H2/H3 hoặc mục FAQ kèm FAQPage schema.' },
    ],
    body: [
      'Câu hỏi là dạng truy vấn dễ cạnh tranh nhất với website mới: chúng dài, cụ thể và thường ít đối thủ tối ưu nghiêm túc. Một bài viết trả lời trọn vẹn nhóm câu hỏi quanh chủ đề của bạn cũng có cơ hội cao xuất hiện ở đoạn trích nổi bật.',
      'Công cụ mở rộng từ khóa gốc bằng các tiền tố và hậu tố nghi vấn tiếng Việt rồi truy vấn Google Autocomplete, nên kết quả phản ánh những gì người dùng đang thực sự gõ chứ không phải danh sách tĩnh.',
      'Khi Autocomplete không phản hồi, công cụ vẫn trả về bộ câu hỏi mẫu để bạn không bị gián đoạn công việc — bộ mẫu được ghi rõ trong phần ghi chú kết quả.',
    ],
    related: ['ke-hoach-noi-dung', 'cong-cu-nghien-cuu-tu-khoa', 'phan-loai-search-intent'],
    faq: [
      {
        question: 'Câu hỏi lấy từ đâu?',
        answer:
          'Từ Google Autocomplete với nhiều biến thể tiền tố/hậu tố nghi vấn tiếng Việt, bổ sung thêm bộ mẫu khi Autocomplete không trả kết quả.',
      },
      {
        question: 'Có nên tạo một trang riêng cho mỗi câu hỏi?',
        answer:
          'Không nên tạo hàng loạt trang mỏng. Hãy gom các câu hỏi cùng ý định vào một bài đủ sâu, chỉ tách trang riêng khi câu hỏi đó có nhu cầu đủ lớn và nội dung thực sự khác biệt.',
      },
    ],
    defaultSources: ['google'],
    tool: 'questions',
  },
  {
    slug: 'so-sanh-tu-khoa-doi-thu',
    title: 'Keyword Gap – so sánh từ khóa với đối thủ, tìm từ khóa còn thiếu',
    description:
      'Dán danh sách từ khóa của bạn và của đối thủ để tìm ngay những từ khóa đối thủ đang có mà bạn chưa có, kèm search intent và loại trang nên tạo. Miễn phí.',
    eyebrow: 'KEYWORD GAP',
    heading: 'So sánh từ khóa với đối thủ',
    intro:
      'Đối thủ đang phủ những truy vấn nào mà website bạn còn bỏ trống? Dán hai danh sách, công cụ chỉ ra khoảng trống và sắp xếp theo mức độ đáng làm trước.',
    platform: 'all',
    keywords: [
      'keyword gap',
      'so sánh từ khóa đối thủ',
      'phân tích đối thủ seo',
      'tìm từ khóa còn thiếu',
      'content gap analysis',
    ],
    bullets: [
      'So sánh với tối đa 2 đối thủ cùng lúc.',
      'Ưu tiên từ khóa có ý định thương mại và giao dịch.',
      'Mỗi từ khóa thiếu đều kèm gợi ý loại trang nên tạo.',
      'Xuất CSV để đưa vào kế hoạch nội dung.',
    ],
    useCases: [
      'Agency rà soát khoảng trống nội dung cho khách hàng.',
      'Lập danh sách bài cần viết dựa trên đối thủ trực tiếp.',
      'Kiểm tra xem đối thủ có đang phủ nhóm truy vấn mua hàng nào bạn bỏ lỡ.',
    ],
    steps: [
      { title: 'Lấy từ khóa của bạn', detail: 'Export từ Google Search Console (Truy vấn) hoặc công cụ bạn đang dùng.' },
      { title: 'Lấy từ khóa đối thủ', detail: 'Export từ công cụ phân tích đối thủ, hoặc tự liệt kê từ các trang họ đang xếp hạng.' },
      { title: 'Dán và so sánh', detail: 'Công cụ tính phần giao và phần thiếu, gán ý định cho từng từ khóa.' },
      { title: 'Lọc theo ý định', detail: 'Bắt đầu từ nhóm thương mại + giao dịch — đây là nhóm ra tiền nhanh nhất.' },
    ],
    body: [
      'Keyword gap trả lời một câu hỏi rất cụ thể: đối thủ đang kiếm traffic từ những truy vấn nào mà bạn chưa hề có nội dung? Đây thường là cách nhanh nhất để tìm việc cần làm, vì nhu cầu đã được chứng minh bởi chính thị trường.',
      'Công cụ này so sánh trên đúng dữ liệu bạn cung cấp. Nó không crawl SERP và không có volume hay thứ hạng — nghĩa là chất lượng kết quả phụ thuộc vào chất lượng hai danh sách bạn dán vào. Nguồn tốt nhất là export Search Console của bạn và dữ liệu đối thủ từ công cụ trả phí bạn đang có.',
      'Bù lại, toàn bộ so sánh chạy trong trình duyệt: danh sách từ khóa của khách hàng bạn không được gửi lên bất kỳ máy chủ nào.',
    ],
    related: ['gom-nhom-tu-khoa-hang-loat', 'ke-hoach-noi-dung', 'phan-loai-search-intent'],
    faq: [
      {
        question: 'Công cụ có tự lấy từ khóa của đối thủ không?',
        answer:
          'Không. Việc đó cần dữ liệu thứ hạng trả phí. Bạn cần tự cung cấp danh sách từ khóa của đối thủ; công cụ lo phần so sánh, phân loại ý định và sắp xếp ưu tiên.',
      },
      {
        question: 'Vì sao không hiển thị volume?',
        answer:
          'Vì chúng tôi không có nguồn volume đáng tin và không muốn đưa ra con số tự chế. Thay vào đó, ưu tiên được xếp theo số đối thủ cùng có từ khóa và theo ý định tìm kiếm.',
      },
      {
        question: 'So sánh được bao nhiêu đối thủ?',
        answer:
          'Tối đa 2 đối thủ mỗi lần. Từ khóa xuất hiện ở cả hai đối thủ sẽ được xếp lên đầu vì mức độ chắc chắn cao hơn.',
      },
    ],
    defaultSources: ['google'],
    tool: 'gap',
  },
];

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGES.find((page) => page.slug === slug);
}

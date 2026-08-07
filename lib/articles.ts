export interface ArticleSection {
  h2: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  readMinutes: number;
  updated: string; // YYYY-MM-DD
  keywords: string[];
  sections: ArticleSection[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: string[]; // seo-page slugs
  relatedArticles: string[]; // article slugs
}

export const ARTICLES: Article[] = [
  {
    slug: 'search-intent-la-gi',
    title: 'Search intent là gì? 5 loại ý định tìm kiếm & cách xác định',
    description:
      'Search intent (ý định tìm kiếm) là gì, 5 loại phổ biến (thông tin, thương mại, giao dịch, điều hướng, địa phương) và cách xác định để chọn đúng loại nội dung.',
    eyebrow: 'KIẾN THỨC SEO',
    heading: 'Search intent là gì?',
    intro:
      'Search intent — hay ý định tìm kiếm — là lý do thực sự phía sau mỗi truy vấn. Hiểu đúng ý định là chìa khóa để chọn đúng loại nội dung và lên top bền vững.',
    readMinutes: 5,
    updated: '2026-08-06',
    keywords: ['search intent là gì', 'ý định tìm kiếm', 'user intent', 'các loại search intent'],
    sections: [
      {
        h2: 'Search intent là gì?',
        paragraphs: [
          'Search intent (ý định tìm kiếm) là mục tiêu mà người dùng muốn đạt được khi gõ một truy vấn vào công cụ tìm kiếm. Cùng một chủ đề, người này muốn “hiểu”, người kia muốn “mua”, người khác lại muốn “tìm một trang cụ thể”.',
          'Google ngày càng giỏi trong việc đoán ý định và ưu tiên xếp hạng những trang khớp ý định đó. Vì vậy, dù bài viết dài hay tối ưu kỹ thuật tốt đến đâu, nếu sai ý định thì vẫn rất khó lên top.',
        ],
      },
      {
        h2: '5 loại search intent phổ biến',
        paragraphs: [
          'Thông tin (informational): người dùng muốn hiểu hoặc học điều gì đó — “cách làm…”, “… là gì”, “hướng dẫn…”. Loại trang phù hợp: bài viết hướng dẫn, giải thích.',
          'Thương mại (commercial): đang cân nhắc, so sánh trước khi quyết định — “… tốt nhất”, “review…”, “so sánh A và B”. Loại trang phù hợp: bài đánh giá, so sánh, top list.',
          'Giao dịch (transactional): sẵn sàng hành động — “mua…”, “giá…”, “đăng ký…”, “tải…”. Loại trang phù hợp: trang sản phẩm, trang đăng ký.',
          'Điều hướng (navigational): tìm một thương hiệu hoặc trang cụ thể — “facebook đăng nhập”, “shopee”. Loại trang phù hợp: trang chủ, trang thương hiệu.',
          'Địa phương (local): tìm dịch vụ gần vị trí — “quán cà phê gần đây”, “sửa xe quận 1”. Loại trang phù hợp: trang địa điểm, Google Business Profile.',
        ],
      },
      {
        h2: 'Cách xác định search intent của một từ khóa',
        paragraphs: [
          'Cách nhanh nhất là gõ thử từ khóa lên Google và quan sát loại trang đang xếp hạng top: nếu toàn bài hướng dẫn thì đó là ý định thông tin; nếu toàn trang sản phẩm thì đó là ý định giao dịch.',
          'Bạn cũng có thể dựa vào các từ tín hiệu trong truy vấn (là gì, cách, mua, giá, review…). Công cụ phân loại search intent của TừKhóa.vn tự động gán nhãn ý định nổi bật theo bộ quy tắc tiếng Việt để bạn khoanh vùng nhanh, sau đó xác nhận lại bằng SERP thực tế.',
        ],
      },
      {
        h2: 'Vì sao khớp intent giúp lên top?',
        paragraphs: [
          'Khi nội dung khớp đúng ý định, người dùng ở lại lâu hơn, ít quay lại trang kết quả (pogo-sticking) — những tín hiệu hành vi tích cực. Ngược lại, một trang bán hàng chen vào truy vấn “… là gì” sẽ bị người dùng rời đi nhanh, và thứ hạng khó giữ.',
          'Nguyên tắc thực hành: mỗi trang chỉ nên phục vụ một ý định chính. Đừng gộp truy vấn tìm hiểu và truy vấn mua hàng vào cùng một trang.',
        ],
      },
    ],
    faq: [
      { question: 'Một từ khóa có thể có nhiều intent không?', answer: 'Có. Một số truy vấn mơ hồ mang nhiều ý định; hãy chọn ý định nổi bật nhất theo SERP và phục vụ nó trước.' },
      { question: 'Làm sao biết mình chọn sai intent?', answer: 'Dấu hiệu thường thấy: trang có thứ hạng thấp dù nội dung tốt, tỉ lệ thoát cao, thời gian trên trang ngắn. Hãy đối chiếu lại với loại trang đang top.' },
    ],
    relatedTools: ['phan-loai-search-intent', 'cong-cu-nghien-cuu-tu-khoa'],
    relatedArticles: ['long-tail-keyword-la-gi', 'topic-cluster-la-gi'],
  },
  {
    slug: 'long-tail-keyword-la-gi',
    title: 'Long-tail keyword là gì? Cách tìm từ khóa dài ít cạnh tranh',
    description:
      'Long-tail keyword (từ khóa dài) là gì, vì sao dễ lên top hơn và cách tìm chúng bằng Google Autocomplete. Ví dụ cụ thể và mẹo áp dụng cho người mới.',
    eyebrow: 'KIẾN THỨC SEO',
    heading: 'Long-tail keyword là gì?',
    intro:
      'Long-tail keyword là những truy vấn dài, cụ thể, lượng tìm kiếm mỗi từ không lớn nhưng cộng lại rất nhiều — và thường dễ lên top hơn nhiều so với từ khóa ngắn.',
    readMinutes: 4,
    updated: '2026-08-06',
    keywords: ['long tail keyword là gì', 'từ khóa dài', 'từ khóa đuôi dài', 'cách tìm long tail keyword'],
    sections: [
      {
        h2: 'Long-tail keyword là gì?',
        paragraphs: [
          'Long-tail keyword (từ khóa đuôi dài) là các cụm từ khóa dài và cụ thể, thường gồm 3 từ trở lên, phản ánh một nhu cầu rõ ràng. Ví dụ: thay vì “máy lọc không khí” (từ khóa ngắn, cạnh tranh cao), long-tail sẽ là “máy lọc không khí cho phòng ngủ 20m2 giá rẻ”.',
          'Tên gọi “đuôi dài” đến từ biểu đồ nhu cầu tìm kiếm: một số ít từ khóa ngắn có volume rất lớn, còn hàng nghìn từ khóa dài mỗi cái volume nhỏ nhưng tổng lại chiếm phần lớn lưu lượng tìm kiếm.',
        ],
      },
      {
        h2: 'Vì sao nên nhắm long-tail keyword?',
        paragraphs: [
          'Ít cạnh tranh hơn: vì cụ thể nên ít trang tối ưu cho chúng, website mới dễ lên top hơn.',
          'Ý định rõ ràng hơn: người gõ truy vấn dài thường biết rõ họ muốn gì, nên tỉ lệ chuyển đổi cao hơn.',
          'Dễ tạo nội dung khớp: mỗi long-tail thường tương ứng một câu hỏi cụ thể, rất hợp làm tiêu đề phụ (H2/H3) trong bài.',
        ],
      },
      {
        h2: 'Cách tìm long-tail keyword miễn phí',
        paragraphs: [
          'Google Autocomplete là nguồn long-tail dồi dào và miễn phí: gõ từ khóa gốc rồi thêm tiền tố (cách, giá, mua) và hậu tố (2026, ở đâu, cho người mới) để thu về hàng loạt biến thể.',
          'Công cụ gợi ý từ khóa Google của TừKhóa.vn tự động mở rộng theo nhiều hướng, phân loại ý định và gom cụm giúp bạn — chỉ cần nhập một hạt giống là có ngay danh sách long-tail để lên dàn ý.',
        ],
      },
    ],
    faq: [
      { question: 'Long-tail keyword có ít người tìm không?', answer: 'Mỗi từ ít, nhưng số lượng từ rất nhiều nên tổng lưu lượng lớn. Chúng cũng thường chuyển đổi tốt hơn nhờ ý định rõ.' },
      { question: 'Nên viết một bài cho mỗi long-tail?', answer: 'Không nhất thiết. Nhiều long-tail cùng ý định có thể gộp vào một bài, mỗi cái là một tiêu đề phụ.' },
    ],
    relatedTools: ['goi-y-tu-khoa-google', 'goi-y-tu-khoa-youtube'],
    relatedArticles: ['search-intent-la-gi', 'topic-cluster-la-gi'],
  },
  {
    slug: 'topic-cluster-la-gi',
    title: 'Topic cluster là gì? Mô hình cụm chủ đề giúp lên top bền vững',
    description:
      'Topic cluster (cụm chủ đề) là gì, cấu trúc trang trụ cột – bài con, và cách xây dựng để tăng độ uy tín chủ đề (topical authority) và thứ hạng SEO.',
    eyebrow: 'KIẾN THỨC SEO',
    heading: 'Topic cluster là gì?',
    intro:
      'Topic cluster là mô hình tổ chức nội dung theo cụm chủ đề, với một trang trụ cột và nhiều bài con liên kết chặt chẽ — cách hiệu quả để xây dựng uy tín chủ đề và lên top bền vững.',
    readMinutes: 5,
    updated: '2026-08-06',
    keywords: ['topic cluster là gì', 'cụm chủ đề', 'pillar page', 'topical authority'],
    sections: [
      {
        h2: 'Topic cluster (cụm chủ đề) là gì?',
        paragraphs: [
          'Topic cluster là một nhóm nội dung xoay quanh cùng một chủ đề lớn, gồm: một trang trụ cột (pillar page) bao quát chủ đề rộng, và nhiều bài con (cluster content) đi sâu vào từng khía cạnh. Tất cả liên kết nội bộ với nhau.',
          'Mô hình này giúp Google hiểu website của bạn là nguồn uy tín (topical authority) về chủ đề đó, thay vì chỉ có vài bài rời rạc.',
        ],
      },
      {
        h2: 'Cấu trúc trang trụ cột và bài con',
        paragraphs: [
          'Trang trụ cột nhắm từ khóa rộng, giới thiệu tổng quan chủ đề và liên kết tới tất cả bài con. Ví dụ chủ đề “nghiên cứu từ khóa” là trang trụ cột.',
          'Bài con nhắm các từ khóa cụ thể hơn (thường là long-tail) và liên kết ngược về trang trụ cột. Ví dụ: “search intent là gì”, “long-tail keyword là gì” là các bài con.',
          'Mạng liên kết nội bộ hai chiều này giúp phân bổ sức mạnh liên kết và giữ người đọc ở lại lâu hơn trong cùng một chủ đề.',
        ],
      },
      {
        h2: 'Cách xây topic cluster bằng keyword clustering',
        paragraphs: [
          'Bước đầu tiên là gom cụm từ khóa: nhóm các truy vấn gần nghĩa, cùng ý định vào một cụm — mỗi cụm gợi ý một trang. Đây chính là việc mà công cụ nhóm từ khóa của TừKhóa.vn hỗ trợ.',
          'Sau khi có các cụm, hãy chọn cụm rộng nhất làm trang trụ cột, các cụm nhỏ làm bài con, rồi thiết lập liên kết nội bộ chặt chẽ. Nhớ tránh việc hai bài cùng nhắm một truy vấn (keyword cannibalization).',
        ],
      },
    ],
    faq: [
      { question: 'Topic cluster khác gì với việc viết nhiều bài?', answer: 'Điểm khác là cấu trúc và liên kết: cụm chủ đề có trang trụ cột điều phối và mạng liên kết nội bộ rõ ràng, thay vì các bài rời rạc.' },
      { question: 'Cần bao nhiêu bài con cho một cluster?', answer: 'Không có con số cố định. Đủ để bao phủ các khía cạnh và câu hỏi quan trọng của chủ đề là được; chất lượng quan trọng hơn số lượng.' },
    ],
    relatedTools: ['nhom-tu-khoa', 'phan-loai-search-intent'],
    relatedArticles: ['keyword-cannibalization-la-gi', 'search-intent-la-gi'],
  },
  {
    slug: 'keyword-cannibalization-la-gi',
    title: 'Keyword cannibalization là gì? Cách phát hiện & khắc phục',
    description:
      'Keyword cannibalization (ăn thịt từ khóa) là gì, vì sao khiến thứ hạng giảm, cách phát hiện và các phương án khắc phục: gộp, chuyển hướng hoặc phân biệt intent.',
    eyebrow: 'KIẾN THỨC SEO',
    heading: 'Keyword cannibalization là gì?',
    intro:
      'Keyword cannibalization xảy ra khi nhiều trang trên cùng một website tranh nhau một truy vấn, khiến chúng làm loãng tín hiệu của nhau và đều khó lên top.',
    readMinutes: 4,
    updated: '2026-08-06',
    keywords: ['keyword cannibalization là gì', 'ăn thịt từ khóa', 'trùng lặp từ khóa', 'cannibalization seo'],
    sections: [
      {
        h2: 'Keyword cannibalization là gì?',
        paragraphs: [
          'Keyword cannibalization (tạm dịch “ăn thịt từ khóa”) là tình trạng hai hoặc nhiều trang của cùng một website cùng nhắm và cạnh tranh cho một truy vấn. Thay vì bổ trợ nhau, chúng chia nhỏ tín hiệu (liên kết, độ liên quan) và khiến Google bối rối không biết nên xếp hạng trang nào.',
          'Kết quả là cả hai trang đều xếp hạng thấp hơn so với khi chỉ có một trang mạnh duy nhất phục vụ truy vấn đó.',
        ],
      },
      {
        h2: 'Cách phát hiện',
        paragraphs: [
          'Dùng thao tác tìm kiếm site:tenmien.com "từ khóa" trên Google để xem có bao nhiêu trang của bạn đang nhắm cùng truy vấn.',
          'Trong Google Search Console, nếu một truy vấn liên tục đổi qua lại giữa nhiều URL, hoặc nhiều URL cùng có hiển thị cho một truy vấn, đó là dấu hiệu cannibalization.',
        ],
      },
      {
        h2: 'Cách khắc phục',
        paragraphs: [
          'Gộp nội dung: hợp nhất các trang trùng ý định thành một trang mạnh, rồi 301 redirect các URL cũ về trang giữ lại.',
          'Phân biệt ý định: nếu các trang thực sự phục vụ ý định khác nhau, hãy chỉnh tiêu đề và nội dung để mỗi trang nhắm một ý định riêng.',
          'Phòng ngừa từ đầu bằng keyword clustering: gom cụm từ khóa trước khi viết giúp bạn quyết định gộp hay tách hợp lý, tránh tạo ra các trang tranh nhau.',
        ],
      },
    ],
    faq: [
      { question: 'Cannibalization có luôn xấu không?', answer: 'Thường là xấu khi các trang cùng ý định. Nếu các trang phục vụ ý định khác nhau rõ ràng thì không phải vấn đề.' },
      { question: 'Gộp trang có mất thứ hạng không?', answer: 'Nếu 301 redirect đúng cách và giữ nội dung tốt nhất, thứ hạng thường được củng cố về một URL mạnh hơn.' },
    ],
    relatedTools: ['nhom-tu-khoa', 'cong-cu-nghien-cuu-tu-khoa'],
    relatedArticles: ['topic-cluster-la-gi', 'search-intent-la-gi'],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

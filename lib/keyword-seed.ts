// Bộ hạt giống từ khóa được tuyển chọn thủ công — đây chính là "bộ lọc chất lượng".
// Chỉ những từ khóa/ngành trong file này mới sinh ra landing page được index,
// tránh việc tạo hàng triệu URL mỏng. Mỗi seed sinh 3 trang: /keyword, /long-tail, /cau-hoi.

export type SeedKind = 'product' | 'service' | 'topic' | 'place';

export interface KeywordSeed {
  /** Từ khóa gốc, viết thường có dấu. */
  keyword: string;
  /** Slug không dấu để làm URL. */
  slug: string;
  /** Loại nội dung — quyết định bộ mẫu mở rộng. */
  kind: SeedKind;
  /** Slug ngành. */
  industry: string;
  /** Tên ngành hiển thị. */
  industryName: string;
}

export interface Industry {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  /** [từ khóa, loại] */
  entries: Array<[string, SeedKind]>;
}

/** Chuyển tiếng Việt có dấu thành slug không dấu. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const INDUSTRIES: Industry[] = [
  {
    slug: 'giao-duc',
    name: 'Giáo dục',
    title: 'Từ khóa ngành Giáo dục – học tập, luyện thi, khóa học',
    description:
      'Bộ từ khóa ngành giáo dục: học tiếng Anh, luyện thi, gia sư, khóa học online, kỹ năng. Mỗi từ khóa có gợi ý liên quan, long-tail và câu hỏi người dùng.',
    intro:
      'Ngành giáo dục có nhu cầu tìm kiếm cực lớn quanh việc học ngoại ngữ, luyện thi, chọn trường và kỹ năng. Đây là các cụm từ khóa trụ cột để xây nội dung.',
    entries: [
      ['học tiếng anh', 'topic'],
      ['học tiếng anh giao tiếp', 'topic'],
      ['luyện thi ielts', 'service'],
      ['luyện thi đại học', 'service'],
      ['gia sư toán', 'service'],
      ['khóa học online', 'product'],
      ['học lập trình', 'topic'],
      ['học kế toán', 'topic'],
      ['tiếng anh cho bé', 'topic'],
      ['luyện thi toeic', 'service'],
      ['học tiếng trung', 'topic'],
      ['kỹ năng giao tiếp', 'topic'],
      ['học vẽ', 'topic'],
      ['trung tâm tiếng anh', 'service'],
    ],
  },
  {
    slug: 'du-lich',
    name: 'Du lịch',
    title: 'Từ khóa ngành Du lịch – địa điểm, tour, khách sạn',
    description:
      'Bộ từ khóa ngành du lịch: điểm đến, tour, khách sạn, kinh nghiệm. Gợi ý long-tail theo địa phương và câu hỏi du khách thường tìm.',
    intro:
      'Du lịch là ngành có lượng tìm kiếm theo mùa và theo địa phương rất mạnh. Các cụm từ khóa dưới đây là điểm khởi đầu cho nội dung cẩm nang, review và đặt dịch vụ.',
    entries: [
      ['du lịch đà nẵng', 'place'],
      ['du lịch đà lạt', 'place'],
      ['du lịch phú quốc', 'place'],
      ['du lịch nha trang', 'place'],
      ['du lịch sapa', 'place'],
      ['du lịch hà giang', 'place'],
      ['khách sạn đà lạt', 'product'],
      ['tour miền tây', 'product'],
      ['vé máy bay giá rẻ', 'product'],
      ['kinh nghiệm du lịch', 'topic'],
      ['homestay đà lạt', 'product'],
      ['du lịch nước ngoài', 'topic'],
      ['cẩm nang du lịch', 'topic'],
    ],
  },
  {
    slug: 'bat-dong-san',
    name: 'Bất động sản',
    title: 'Từ khóa ngành Bất động sản – mua bán, cho thuê, dự án',
    description:
      'Bộ từ khóa ngành bất động sản: mua bán nhà đất, căn hộ, cho thuê, phong thủy nhà ở. Gợi ý long-tail theo khu vực và câu hỏi thường gặp.',
    intro:
      'Bất động sản có giá trị chuyển đổi cao và nhu cầu tìm kiếm theo khu vực, loại hình rất rõ. Đây là các từ khóa trụ cột cho website môi giới, dự án.',
    entries: [
      ['mua bán nhà đất', 'topic'],
      ['căn hộ chung cư', 'product'],
      ['nhà đất giá rẻ', 'product'],
      ['cho thuê căn hộ', 'service'],
      ['đất nền dự án', 'product'],
      ['phong thủy nhà ở', 'topic'],
      ['mua nhà trả góp', 'service'],
      ['thiết kế nhà đẹp', 'service'],
      ['nhà phố', 'product'],
      ['biệt thự', 'product'],
      ['cho thuê văn phòng', 'service'],
      ['sổ hồng sổ đỏ', 'topic'],
    ],
  },
  {
    slug: 'tai-chinh',
    name: 'Tài chính – Ngân hàng',
    title: 'Từ khóa ngành Tài chính – vay vốn, thẻ, bảo hiểm, đầu tư',
    description:
      'Bộ từ khóa ngành tài chính – ngân hàng: vay tín chấp, thẻ tín dụng, bảo hiểm, đầu tư, tiết kiệm. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Tài chính là ngành có từ khóa giao dịch giá trị cao. Người dùng tìm kiếm rất cụ thể quanh lãi suất, điều kiện và so sánh sản phẩm.',
    entries: [
      ['vay tín chấp', 'service'],
      ['thẻ tín dụng', 'product'],
      ['bảo hiểm nhân thọ', 'product'],
      ['bảo hiểm ô tô', 'product'],
      ['vay thế chấp', 'service'],
      ['đầu tư chứng khoán', 'topic'],
      ['gửi tiết kiệm', 'service'],
      ['vay mua nhà', 'service'],
      ['lãi suất ngân hàng', 'topic'],
      ['đầu tư vàng', 'topic'],
      ['mở tài khoản ngân hàng', 'service'],
      ['quỹ đầu tư', 'product'],
    ],
  },
  {
    slug: 'suc-khoe',
    name: 'Sức khỏe',
    title: 'Từ khóa ngành Sức khỏe – bệnh, thực phẩm chức năng, khám chữa',
    description:
      'Bộ từ khóa ngành sức khỏe: triệu chứng bệnh, thực phẩm chức năng, phòng khám, dinh dưỡng. Gợi ý long-tail và câu hỏi thường gặp.',
    intro:
      'Sức khỏe (YMYL) đòi hỏi nội dung chính xác, nhưng nhu cầu tìm kiếm quanh triệu chứng, cách chữa và sản phẩm rất lớn.',
    entries: [
      ['thực phẩm chức năng', 'product'],
      ['giảm cân', 'topic'],
      ['tăng chiều cao', 'topic'],
      ['đau dạ dày', 'topic'],
      ['mất ngủ', 'topic'],
      ['vitamin tổng hợp', 'product'],
      ['collagen', 'product'],
      ['phòng khám đa khoa', 'service'],
      ['thực đơn giảm cân', 'topic'],
      ['sữa cho người già', 'product'],
      ['men vi sinh', 'product'],
      ['khám sức khỏe tổng quát', 'service'],
    ],
  },
  {
    slug: 'lam-dep',
    name: 'Làm đẹp – Mỹ phẩm',
    title: 'Từ khóa ngành Làm đẹp – skincare, mỹ phẩm, spa',
    description:
      'Bộ từ khóa ngành làm đẹp: skincare, kem chống nắng, serum, spa, trị mụn. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Làm đẹp có nhu cầu review và so sánh sản phẩm rất mạnh, đặc biệt ở nhóm nữ 18–35. Đây là các từ khóa trụ cột cho blog và bán hàng.',
    entries: [
      ['sữa rửa mặt', 'product'],
      ['kem chống nắng', 'product'],
      ['serum vitamin c', 'product'],
      ['trị mụn', 'topic'],
      ['kem dưỡng ẩm', 'product'],
      ['son môi', 'product'],
      ['chăm sóc da mặt', 'topic'],
      ['tẩy trang', 'product'],
      ['spa gần đây', 'service'],
      ['trị nám', 'service'],
      ['mặt nạ dưỡng da', 'product'],
      ['nước hoa nữ', 'product'],
    ],
  },
  {
    slug: 'cong-nghe',
    name: 'Công nghệ',
    title: 'Từ khóa ngành Công nghệ – điện thoại, laptop, phần mềm',
    description:
      'Bộ từ khóa ngành công nghệ: điện thoại, laptop, tai nghe, phần mềm, thủ thuật. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Công nghệ có lượng tìm kiếm khổng lồ quanh review sản phẩm, so sánh cấu hình và thủ thuật. Đây là các cụm trụ cột dễ kéo traffic.',
    entries: [
      ['điện thoại giá rẻ', 'product'],
      ['laptop cho sinh viên', 'product'],
      ['tai nghe bluetooth', 'product'],
      ['iphone', 'product'],
      ['đồng hồ thông minh', 'product'],
      ['phần mềm diệt virus', 'product'],
      ['camera an ninh', 'product'],
      ['máy tính bảng', 'product'],
      ['bàn phím cơ', 'product'],
      ['sạc dự phòng', 'product'],
      ['thủ thuật máy tính', 'topic'],
      ['loa bluetooth', 'product'],
    ],
  },
  {
    slug: 'am-thuc',
    name: 'Ẩm thực',
    title: 'Từ khóa ngành Ẩm thực – công thức nấu ăn, quán ngon',
    description:
      'Bộ từ khóa ngành ẩm thực: công thức nấu ăn, món ngon, quán ăn, đồ uống. Gợi ý long-tail và câu hỏi thường gặp.',
    intro:
      'Ẩm thực là ngành nội dung bền vững, tìm kiếm quanh công thức, cách làm và địa điểm ăn uống rất đều đặn quanh năm.',
    entries: [
      ['món ăn healthy', 'topic'],
      ['cách nấu phở', 'topic'],
      ['công thức làm bánh', 'topic'],
      ['món ăn vặt', 'topic'],
      ['quán ăn ngon', 'place'],
      ['cách làm bánh mì', 'topic'],
      ['món chay', 'topic'],
      ['nấu ăn cho bé', 'topic'],
      ['cách pha cà phê', 'topic'],
      ['món ăn giảm cân', 'topic'],
      ['đặc sản vùng miền', 'topic'],
      ['cách làm sữa chua', 'topic'],
    ],
  },
  {
    slug: 'thoi-trang',
    name: 'Thời trang',
    title: 'Từ khóa ngành Thời trang – quần áo, giày dép, phụ kiện',
    description:
      'Bộ từ khóa ngành thời trang: quần áo, giày dép, túi xách, phối đồ. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Thời trang có nhu cầu tìm kiếm theo mùa, theo phong cách và theo dịp. Đây là các từ khóa trụ cột cho shop và blog phối đồ.',
    entries: [
      ['giày chạy bộ', 'product'],
      ['áo khoác nam', 'product'],
      ['váy đầm dự tiệc', 'product'],
      ['giày sneaker', 'product'],
      ['túi xách nữ', 'product'],
      ['đồ đôi', 'product'],
      ['quần jean nam', 'product'],
      ['cách phối đồ', 'topic'],
      ['áo thun form rộng', 'product'],
      ['giày cao gót', 'product'],
      ['đồ ngủ', 'product'],
      ['balo laptop', 'product'],
    ],
  },
  {
    slug: 'noi-that',
    name: 'Nội thất – Nhà cửa',
    title: 'Từ khóa ngành Nội thất – trang trí, đồ gia dụng',
    description:
      'Bộ từ khóa ngành nội thất – nhà cửa: trang trí, sofa, đồ gia dụng, thiết kế. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Nội thất và đồ gia dụng có giá trị đơn hàng cao, người dùng tìm kiếm kỹ quanh mẫu mã, chất liệu và giá.',
    entries: [
      ['sofa phòng khách', 'product'],
      ['bàn làm việc', 'product'],
      ['tủ quần áo', 'product'],
      ['đèn trang trí', 'product'],
      ['nồi chiên không dầu', 'product'],
      ['máy lọc không khí', 'product'],
      ['máy lọc nước', 'product'],
      ['robot hút bụi', 'product'],
      ['giường ngủ', 'product'],
      ['rèm cửa', 'product'],
      ['thiết kế nội thất', 'service'],
      ['cây cảnh trong nhà', 'product'],
    ],
  },
  {
    slug: 'o-to-xe-may',
    name: 'Ô tô – Xe máy',
    title: 'Từ khóa ngành Ô tô – Xe máy: mua bán, phụ kiện, bảo dưỡng',
    description:
      'Bộ từ khóa ngành ô tô – xe máy: mua bán, phụ kiện, bảo dưỡng, giá xe. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Ô tô – xe máy có từ khóa giá trị cao quanh giá xe, so sánh dòng xe và dịch vụ bảo dưỡng, phụ kiện.',
    entries: [
      ['xe máy điện', 'product'],
      ['ô tô cũ', 'product'],
      ['giá xe ô tô', 'topic'],
      ['phụ kiện ô tô', 'product'],
      ['lốp xe ô tô', 'product'],
      ['bảo dưỡng ô tô', 'service'],
      ['xe máy tay ga', 'product'],
      ['camera hành trình', 'product'],
      ['dầu nhớt ô tô', 'product'],
      ['thuê xe tự lái', 'service'],
      ['học lái xe ô tô', 'service'],
      ['mũ bảo hiểm', 'product'],
    ],
  },
  {
    slug: 'me-va-be',
    name: 'Mẹ và bé',
    title: 'Từ khóa ngành Mẹ và bé – sữa, bỉm, đồ dùng cho bé',
    description:
      'Bộ từ khóa ngành mẹ và bé: sữa công thức, bỉm tã, đồ dùng, chăm sóc trẻ. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Mẹ và bé là ngành có độ trung thành cao và tần suất mua lặp lại lớn, tìm kiếm rất cụ thể theo độ tuổi của bé.',
    entries: [
      ['sữa công thức', 'product'],
      ['bỉm cho bé', 'product'],
      ['xe đẩy em bé', 'product'],
      ['đồ chơi cho bé', 'product'],
      ['ghế ăn dặm', 'product'],
      ['máy hút sữa', 'product'],
      ['thực đơn ăn dặm', 'topic'],
      ['sữa cho bà bầu', 'product'],
      ['quần áo trẻ em', 'product'],
      ['cách chăm sóc trẻ sơ sinh', 'topic'],
      ['ghế ngồi ô tô cho bé', 'product'],
      ['men vi sinh cho bé', 'product'],
    ],
  },
  {
    slug: 'the-thao',
    name: 'Thể thao – Gym',
    title: 'Từ khóa ngành Thể thao – tập luyện, dụng cụ, dinh dưỡng',
    description:
      'Bộ từ khóa ngành thể thao – gym: tập luyện, dụng cụ, thực phẩm bổ sung, yoga. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Thể thao và fitness có nhu cầu tìm kiếm ổn định quanh bài tập, dụng cụ và dinh dưỡng tập luyện.',
    entries: [
      ['tập gym cho người mới', 'topic'],
      ['tập yoga', 'topic'],
      ['thực phẩm bổ sung gym', 'product'],
      ['máy chạy bộ', 'product'],
      ['bài tập giảm mỡ bụng', 'topic'],
      ['whey protein', 'product'],
      ['dụng cụ tập gym tại nhà', 'product'],
      ['chạy bộ đúng cách', 'topic'],
      ['tập tăng cơ', 'topic'],
      ['thảm tập yoga', 'product'],
      ['bài tập cardio', 'topic'],
      ['xe đạp thể thao', 'product'],
    ],
  },
  {
    slug: 'kinh-doanh',
    name: 'Kinh doanh – Marketing',
    title: 'Từ khóa ngành Kinh doanh – marketing, khởi nghiệp, bán hàng',
    description:
      'Bộ từ khóa ngành kinh doanh – marketing: SEO, quảng cáo, bán hàng online, khởi nghiệp. Gợi ý long-tail và câu hỏi người dùng.',
    intro:
      'Kinh doanh – marketing là ngành có nhiều từ khóa dịch vụ giá trị cao và nội dung hướng dẫn được tìm kiếm liên tục.',
    entries: [
      ['dịch vụ seo', 'service'],
      ['thiết kế website', 'service'],
      ['chạy quảng cáo facebook', 'service'],
      ['bán hàng online', 'topic'],
      ['khởi nghiệp', 'topic'],
      ['marketing online', 'topic'],
      ['quảng cáo google', 'service'],
      ['phần mềm quản lý bán hàng', 'product'],
      ['kinh doanh online', 'topic'],
      ['content marketing', 'topic'],
      ['nghiên cứu từ khóa', 'topic'],
      ['xây dựng thương hiệu', 'topic'],
    ],
  },
];

// ── Build phẳng danh sách seed ──────────────────────────────────────────────
const seedList: KeywordSeed[] = [];
const industryMeta: Array<Omit<Industry, 'entries'> & { seeds: KeywordSeed[] }> = [];
const slugSet = new Set<string>();

for (const ind of INDUSTRIES) {
  const seeds: KeywordSeed[] = [];
  for (const [keyword, kind] of ind.entries) {
    const slug = slugify(keyword);
    if (slugSet.has(slug)) continue; // tránh trùng slug giữa các ngành
    slugSet.add(slug);
    const seed: KeywordSeed = {
      keyword,
      slug,
      kind,
      industry: ind.slug,
      industryName: ind.name,
    };
    seeds.push(seed);
    seedList.push(seed);
  }
  const { entries, ...rest } = ind;
  void entries;
  industryMeta.push({ ...rest, seeds });
}

export const ALL_SEEDS: KeywordSeed[] = seedList;

export const INDUSTRY_LIST: Array<Omit<Industry, 'entries'> & { seeds: KeywordSeed[] }> =
  industryMeta;

const seedBySlug = new Map(seedList.map((s) => [s.slug, s]));
const industryBySlug = new Map(industryMeta.map((i) => [i.slug, i]));

export function getSeed(slug: string): KeywordSeed | undefined {
  return seedBySlug.get(slug);
}

export function getIndustry(slug: string) {
  return industryBySlug.get(slug);
}

/** Các seed cùng ngành (trừ chính nó) — dùng cho internal link. */
export function siblingSeeds(seed: KeywordSeed, limit = 8): KeywordSeed[] {
  return seedList
    .filter((s) => s.industry === seed.industry && s.slug !== seed.slug)
    .slice(0, limit);
}

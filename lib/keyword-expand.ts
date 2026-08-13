// Bộ mở rộng từ khóa TẤT ĐỊNH (deterministic) chạy phía server, không phụ thuộc
// mạng khi render — nhờ vậy mỗi landing page luôn có nội dung phong phú, khác biệt
// theo từ khóa và loại (product/service/topic/place), không bao giờ rỗng.
// Công cụ tương tác (client) vẫn dùng Google Autocomplete trực tiếp qua /api.

import type { SearchIntent } from './keyword-types';
import { classifyIntent, normalizeKeyword } from './keyword-engine';
import type { KeywordSeed, SeedKind } from './keyword-seed';

export interface ExpandResult {
  seed: string;
  intent: SearchIntent;
  intentLabel: string;
  /** Từ khóa liên quan (biến thể tầm trung). */
  related: string[];
  /** Từ khóa dài, cụ thể (long-tail). */
  longTail: string[];
  /** Câu hỏi người dùng thường tìm. */
  questions: string[];
  /** Gợi ý tiêu đề bài viết. */
  titles: string[];
}

export const INTENT_LABELS: Record<SearchIntent, string> = {
  informational: 'Thông tin',
  commercial: 'Thương mại',
  transactional: 'Giao dịch',
  navigational: 'Điều hướng',
  local: 'Địa phương',
};

type Bank = {
  related: (k: string) => string[];
  longTail: (k: string) => string[];
  questions: (k: string) => string[];
  titles: (k: string) => string[];
};

const BANKS: Record<SeedKind, Bank> = {
  product: {
    related: (k) => [
      `${k} giá rẻ`,
      `${k} chính hãng`,
      `${k} tốt nhất`,
      `${k} loại nào tốt`,
      `${k} cao cấp`,
      `${k} giá bao nhiêu`,
      `review ${k}`,
      `top ${k}`,
      `${k} 2026`,
      `${k} bán chạy`,
      `${k} khuyến mãi`,
      `${k} nhập khẩu`,
    ],
    longTail: (k) => [
      `${k} loại nào tốt nhất hiện nay`,
      `${k} giá rẻ chất lượng tốt`,
      `kinh nghiệm chọn mua ${k}`,
      `${k} nên mua hãng nào`,
      `${k} tốt nhất 2026`,
      `${k} cho gia đình`,
      `${k} giá bao nhiêu tiền`,
      `mua ${k} ở đâu uy tín`,
      `${k} loại nào bền và tiết kiệm`,
      `hướng dẫn chọn mua ${k}`,
      `so sánh các loại ${k}`,
      `review ${k} chi tiết mới nhất`,
    ],
    questions: (k) => [
      `${k} là gì`,
      `${k} loại nào tốt`,
      `${k} giá bao nhiêu`,
      `có nên mua ${k} không`,
      `${k} mua ở đâu uy tín`,
      `${k} hãng nào tốt nhất`,
      `${k} dùng có tốt không`,
      `nên chọn ${k} loại nào`,
      `${k} bao nhiêu tiền là hợp lý`,
      `mua ${k} cần lưu ý gì`,
    ],
    titles: (k) => [
      `Top ${k} tốt nhất 2026: đánh giá & bảng giá`,
      `${k} loại nào tốt? Kinh nghiệm chọn mua từ A–Z`,
      `Review ${k}: nên mua loại nào, giá bao nhiêu?`,
      `Mua ${k} ở đâu uy tín, giá tốt nhất?`,
      `So sánh các loại ${k} phổ biến hiện nay`,
      `Hướng dẫn chọn ${k} phù hợp nhu cầu`,
    ],
  },
  service: {
    related: (k) => [
      `${k} uy tín`,
      `${k} giá rẻ`,
      `${k} chuyên nghiệp`,
      `${k} tốt nhất`,
      `bảng giá ${k}`,
      `${k} trọn gói`,
      `${k} tại nhà`,
      `${k} giá bao nhiêu`,
      `${k} 2026`,
      `${k} gần đây`,
      `công ty ${k}`,
      `${k} nhanh chóng`,
    ],
    longTail: (k) => [
      `${k} uy tín giá rẻ`,
      `${k} chuyên nghiệp trọn gói`,
      `bảng giá ${k} mới nhất`,
      `${k} ở đâu tốt và uy tín`,
      `kinh nghiệm chọn ${k}`,
      `${k} giá bao nhiêu tiền`,
      `${k} tại nhà nhanh chóng`,
      `dịch vụ ${k} tốt nhất hiện nay`,
      `nên chọn ${k} ở đâu`,
      `${k} trọn gói giá tốt`,
      `top công ty ${k} uy tín`,
      `quy trình ${k} như thế nào`,
    ],
    questions: (k) => [
      `${k} là gì`,
      `${k} giá bao nhiêu`,
      `${k} ở đâu uy tín`,
      `có nên dùng ${k} không`,
      `${k} mất bao lâu`,
      `${k} cần chuẩn bị gì`,
      `${k} có hiệu quả không`,
      `chọn ${k} như thế nào`,
      `${k} bao nhiêu tiền`,
      `${k} nào tốt nhất`,
    ],
    titles: (k) => [
      `${k} uy tín 2026: bảng giá & kinh nghiệm chọn`,
      `Dịch vụ ${k}: giá bao nhiêu, chọn ở đâu?`,
      `Top đơn vị ${k} chuyên nghiệp, uy tín`,
      `Kinh nghiệm chọn ${k} tránh mất tiền oan`,
      `${k} trọn gói: quy trình & báo giá chi tiết`,
      `Có nên dùng ${k}? Giải đáp từ A–Z`,
    ],
  },
  topic: {
    related: (k) => [
      `${k} cho người mới`,
      `cách ${k}`,
      `${k} hiệu quả`,
      `${k} tại nhà`,
      `${k} cơ bản`,
      `${k} nâng cao`,
      `lộ trình ${k}`,
      `${k} online`,
      `mẹo ${k}`,
      `${k} đúng cách`,
      `${k} miễn phí`,
      `${k} 2026`,
    ],
    longTail: (k) => [
      `${k} cho người mới bắt đầu`,
      `cách ${k} hiệu quả tại nhà`,
      `lộ trình ${k} từ đầu`,
      `${k} như thế nào cho đúng`,
      `kinh nghiệm ${k} thực tế`,
      `hướng dẫn ${k} chi tiết`,
      `${k} miễn phí cho người mới`,
      `mẹo ${k} nhanh hiệu quả`,
      `${k} cơ bản đến nâng cao`,
      `những sai lầm khi ${k}`,
      `bí quyết ${k} thành công`,
      `${k} cần bao lâu`,
    ],
    questions: (k) => [
      `${k} là gì`,
      `cách ${k} như thế nào`,
      `${k} có khó không`,
      `${k} mất bao lâu`,
      `${k} bắt đầu từ đâu`,
      `nên ${k} như thế nào`,
      `${k} có hiệu quả không`,
      `làm sao để ${k}`,
      `${k} cần chuẩn bị gì`,
      `tại sao nên ${k}`,
    ],
    titles: (k) => [
      `${k}: hướng dẫn từ A–Z cho người mới (2026)`,
      `Cách ${k} hiệu quả: lộ trình chi tiết`,
      `${k} bắt đầu từ đâu? Kinh nghiệm thực tế`,
      `${k} có khó không? Những điều cần biết`,
      `Bí quyết ${k} nhanh và hiệu quả`,
      `Những sai lầm thường gặp khi ${k}`,
    ],
  },
  place: {
    related: (k) => [
      `${k} tự túc`,
      `${k} 3 ngày 2 đêm`,
      `kinh nghiệm ${k}`,
      `${k} nên đi đâu`,
      `${k} mùa nào đẹp`,
      `chi phí ${k}`,
      `${k} có gì chơi`,
      `lịch trình ${k}`,
      `${k} giá rẻ`,
      `địa điểm ${k}`,
      `${k} ăn gì`,
      `review ${k}`,
    ],
    longTail: (k) => [
      `${k} tự túc tiết kiệm`,
      `${k} 3 ngày 2 đêm nên đi đâu`,
      `kinh nghiệm ${k} lần đầu`,
      `${k} nên đi vào mùa nào`,
      `chi phí ${k} hết bao nhiêu`,
      `lịch trình ${k} chi tiết`,
      `${k} có gì chơi và ăn gì`,
      `${k} tự túc cho người mới`,
      `địa điểm ${k} không thể bỏ lỡ`,
      `cẩm nang ${k} từ a đến z`,
      `${k} đi mấy ngày là đủ`,
      `review ${k} chi tiết`,
    ],
    questions: (k) => [
      `${k} nên đi đâu`,
      `${k} mùa nào đẹp`,
      `${k} chi phí bao nhiêu`,
      `${k} có gì chơi`,
      `${k} đi mấy ngày`,
      `${k} ăn gì ngon`,
      `${k} tháng mấy đẹp nhất`,
      `${k} tự túc cần chuẩn bị gì`,
      `${k} ở đâu đẹp`,
      `nên ${k} vào thời điểm nào`,
    ],
    titles: (k) => [
      `${k} tự túc 2026: cẩm nang từ A–Z`,
      `Kinh nghiệm ${k}: đi đâu, ăn gì, chi phí?`,
      `${k} nên đi mùa nào, mấy ngày là đủ?`,
      `Lịch trình ${k} 3 ngày 2 đêm chi tiết`,
      `${k} có gì chơi? Top địa điểm không nên bỏ lỡ`,
      `Chi phí ${k} hết bao nhiêu tiền?`,
    ],
  },
};

/** Mở rộng một seed thành các nhóm từ khóa, khử trùng lặp giữa các nhóm. */
export function expandKeyword(seed: KeywordSeed): ExpandResult {
  const k = seed.keyword;
  const bank = BANKS[seed.kind];
  const intent = classifyIntent(k);

  const seen = new Set<string>([normalizeKeyword(k)]);
  const take = (raw: string[]): string[] => {
    const out: string[] = [];
    for (const item of raw) {
      const norm = normalizeKeyword(item);
      if (!norm || seen.has(norm)) continue;
      seen.add(norm);
      out.push(item);
    }
    return out;
  };

  // Ưu tiên câu hỏi > long-tail > related khi khử trùng.
  const questions = take(bank.questions(k));
  const longTail = take(bank.longTail(k));
  const related = take(bank.related(k));

  return {
    seed: k,
    intent,
    intentLabel: INTENT_LABELS[intent],
    related,
    longTail,
    questions,
    titles: bank.titles(k),
  };
}

/** Câu trả lời ngắn tất định cho FAQPage schema (an toàn, không bịa số liệu). */
export function answerFor(question: string, seed: KeywordSeed): string {
  const k = seed.keyword;
  const q = question.toLowerCase();
  if (q.includes('là gì')) {
    return `“${k}” là một chủ đề được nhiều người tìm kiếm trong lĩnh vực ${seed.industryName.toLowerCase()}. Bài viết nên giải thích khái niệm, đặc điểm và các nhóm truy vấn liên quan để trả lời đúng ý định người dùng.`;
  }
  if (q.includes('giá') || q.includes('bao nhiêu tiền')) {
    return `Giá của “${k}” thay đổi theo thương hiệu, thời điểm và nơi bán, nên hãy so sánh nhiều nguồn thay vì dựa vào một con số cố định. Nội dung nên đưa ra khoảng giá tham khảo và các yếu tố ảnh hưởng.`;
  }
  if (q.includes('ở đâu') || q.includes('mua')) {
    return `Người dùng tìm “${question}” đang có ý định giao dịch. Trang nên gợi ý tiêu chí chọn nơi mua/dùng uy tín và các dấu hiệu cần tránh, thay vì chỉ liệt kê tên thương hiệu.`;
  }
  if (q.includes('bao lâu') || q.includes('mấy ngày')) {
    return `Thời gian cho “${k}” phụ thuộc vào mục tiêu và điều kiện cụ thể của mỗi người. Nội dung nên đưa ra mốc tham khảo và các yếu tố khiến nhanh hoặc chậm hơn.`;
  }
  if (q.includes('có nên') || q.includes('có tốt') || q.includes('có hiệu quả')) {
    return `Câu hỏi “${question}” cho thấy người dùng đang cân nhắc. Trang nên nêu ưu – nhược điểm khách quan và trường hợp nào phù hợp, trường hợp nào không.`;
  }
  return `“${question}” là một truy vấn liên quan tới “${k}”. Đây là câu hỏi tốt để làm tiêu đề phụ (H2/H3) hoặc mục FAQ, giúp bài viết phủ đúng nhu cầu tìm kiếm thực tế.`;
}

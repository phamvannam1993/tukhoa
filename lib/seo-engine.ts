import { classifyIntent, normalizeKeyword, tokenize } from './keyword-engine';
import type {
  ClusteredKeyword,
  ClusterResult,
  ContentBrief,
  ContentPlanItem,
  ContentType,
  KeywordCluster,
  SearchIntent,
  UniverseNode,
} from './keyword-types';

/** Trần an toàn cho việc gom nhóm phía trình duyệt. */
export const MAX_BULK_KEYWORDS = 10000;

const QUESTION_MARKERS = [
  'là gì',
  'có nên',
  'nên không',
  'tại sao',
  'vì sao',
  'như thế nào',
  'thế nào',
  'bao nhiêu',
  'bao lâu',
  'ở đâu',
  'khi nào',
  'cách ',
  'làm sao',
  'loại nào',
  'cái nào',
  'có tốt không',
  'gì ',
  'ai ',
];

const INTENT_CONTENT_TYPE: Record<SearchIntent, ContentType> = {
  informational: 'article',
  commercial: 'review',
  transactional: 'product',
  navigational: 'landing',
  local: 'landing',
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  article: 'Bài viết',
  review: 'Bài đánh giá / so sánh',
  category: 'Trang danh mục',
  product: 'Trang sản phẩm',
  landing: 'Landing page',
  faq: 'Trang câu hỏi (FAQ)',
};

export function isQuestionKeyword(keyword: string): boolean {
  const normalized = ` ${normalizeKeyword(keyword)} `;
  return QUESTION_MARKERS.some((marker) => normalized.includes(marker));
}

export function suggestContentType(
  keyword: string,
  intent: SearchIntent,
  keywordCount = 1,
): ContentType {
  if (isQuestionKeyword(keyword) && intent === 'informational') return 'article';
  if (intent === 'transactional' && keywordCount >= 5) return 'category';
  if (intent === 'commercial' && keywordCount >= 8) return 'category';
  return INTENT_CONTENT_TYPE[intent];
}

/** Tách danh sách thô (mỗi dòng / dấu phẩy / tab một từ khóa) thành mảng đã chuẩn hóa. */
export function parseKeywordList(raw: string): { keywords: string[]; duplicates: number } {
  const parts = raw
    .split(/[\n\r,;\t]+/)
    .map((part) => normalizeKeyword(part))
    .filter((part) => part.length >= 2 && part.length <= 160);

  const seen = new Set<string>();
  const keywords: string[] = [];
  let duplicates = 0;

  for (const part of parts) {
    if (seen.has(part)) {
      duplicates += 1;
      continue;
    }
    seen.add(part);
    keywords.push(part);
    if (keywords.length >= MAX_BULK_KEYWORDS) break;
  }

  return { keywords, duplicates };
}

function describe(keyword: string): ClusteredKeyword {
  const intent = classifyIntent(keyword);
  return {
    keyword,
    intent,
    contentType: suggestContentType(keyword, intent),
    isQuestion: isQuestionKeyword(keyword),
    words: keyword.split(/\s+/).filter(Boolean).length,
  };
}

function majorityIntent(keywords: ClusteredKeyword[]): SearchIntent {
  const counts = new Map<SearchIntent, number>();
  keywords.forEach((item) => counts.set(item.intent, (counts.get(item.intent) || 0) + 1));

  let best: SearchIntent = 'informational';
  let bestCount = -1;
  counts.forEach((count, intent) => {
    if (count > bestCount) {
      bestCount = count;
      best = intent;
    }
  });
  return best;
}

const INTENT_PRIORITY: Record<SearchIntent, number> = {
  transactional: 16,
  commercial: 14,
  local: 10,
  informational: 8,
  navigational: 3,
};

/**
 * Gom nhóm từ khóa theo token trùng nhau, có trọng số IDF.
 *
 * Dùng inverted index nên chỉ so sánh với các cụm có chung ít nhất một token —
 * đủ nhanh cho 10.000 từ khóa ngay trong trình duyệt, thay vì so tất cả với tất cả.
 */
export function clusterKeywords(keywords: string[], threshold = 0.45): ClusterResult {
  const tokensOf = new Map<string, string[]>();
  const documentFrequency = new Map<string, number>();

  keywords.forEach((keyword) => {
    const tokens = [...new Set(tokenize(keyword))];
    tokensOf.set(keyword, tokens);
    tokens.forEach((token) =>
      documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1),
    );
  });

  const total = Math.max(1, keywords.length);
  const idf = (token: string): number =>
    Math.log(1 + total / (1 + (documentFrequency.get(token) || 0)));

  interface WorkingCluster {
    /** Token của từ khóa hạt nhân (head term) — giữ cố định để cụm không trôi nghĩa. */
    tokens: Map<string, number>;
    weight: number;
    keywords: string[];
  }

  const clusters: WorkingCluster[] = [];
  const index = new Map<string, Set<number>>();

  // Từ khóa ngắn xử lý trước để head term trở thành hạt nhân của cụm.
  const ordered = [...keywords].sort(
    (a, b) =>
      (tokensOf.get(a)?.length || 0) - (tokensOf.get(b)?.length || 0) ||
      a.localeCompare(b, 'vi'),
  );

  for (const keyword of ordered) {
    const tokens = tokensOf.get(keyword) || [];
    if (tokens.length === 0) continue;

    const keywordWeight = tokens.reduce((sum, token) => sum + idf(token), 0);
    const candidates = new Set<number>();
    tokens.forEach((token) => {
      index.get(token)?.forEach((clusterIndex) => candidates.add(clusterIndex));
    });

    let bestIndex = -1;
    let bestScore = threshold;

    candidates.forEach((clusterIndex) => {
      const cluster = clusters[clusterIndex];
      let shared = 0;
      tokens.forEach((token) => {
        if (cluster.tokens.has(token)) shared += idf(token);
      });
      // Jaccard có trọng số so với head term của cụm: token hiếm (thương hiệu, model,
      // địa danh) không trùng sẽ kéo điểm xuống mạnh, nên "… karofi" và "… kangaroo"
      // không bị gộp chung dù chia sẻ toàn bộ phần lõi.
      const score = shared / Math.max(1e-6, keywordWeight + cluster.weight - shared);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = clusterIndex;
      }
    });

    if (bestIndex >= 0) {
      clusters[bestIndex].keywords.push(keyword);
      continue;
    }

    const newIndex = clusters.length;
    const tokenMap = new Map(tokens.map((token) => [token, idf(token)] as const));
    clusters.push({ tokens: tokenMap, weight: keywordWeight, keywords: [keyword] });
    tokens.forEach((token) => {
      const bucket = index.get(token) || new Set<number>();
      bucket.add(newIndex);
      index.set(token, bucket);
    });
  }

  const result: KeywordCluster[] = clusters.map((cluster) => {
    const items = cluster.keywords
      .map(describe)
      .sort((a, b) => a.words - b.words || a.keyword.localeCompare(b.keyword, 'vi'));

    const intent = majorityIntent(items);
    const questionCount = items.filter((item) => item.isQuestion).length;
    const name = items[0]?.keyword || '';

    return {
      name,
      intent,
      contentType: suggestContentType(name, intent, items.length),
      keywords: items,
      questionCount,
      priority: Math.round(items.length * 2 + INTENT_PRIORITY[intent] + questionCount),
    };
  });

  result.sort(
    (a, b) =>
      b.keywords.length - a.keywords.length ||
      b.priority - a.priority ||
      a.name.localeCompare(b.name, 'vi'),
  );

  return { total: keywords.length, duplicates: 0, clusters: result };
}

/**
 * Dựng “Keyword Universe”: cây chủ đề 2 tầng dựa trên các token phụ (modifier)
 * phổ biến nhất, sau khi loại bỏ phần lõi mà gần như từ khóa nào cũng có.
 */
export function buildUniverse(keywords: string[], rootLabel: string): UniverseNode {
  const documentFrequency = new Map<string, number>();
  const tokensOf = new Map<string, string[]>();

  keywords.forEach((keyword) => {
    const tokens = [...new Set(tokenize(keyword))];
    tokensOf.set(keyword, tokens);
    tokens.forEach((token) =>
      documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1),
    );
  });

  const total = Math.max(1, keywords.length);
  const coreTokens = new Set(
    [...documentFrequency.entries()]
      .filter(([, count]) => count / total >= 0.6)
      .map(([token]) => token),
  );

  const level1 = new Map<string, string[]>();

  keywords.forEach((keyword) => {
    const modifiers = (tokensOf.get(keyword) || []).filter((token) => !coreTokens.has(token));
    const primary =
      modifiers.sort(
        (a, b) => (documentFrequency.get(b) || 0) - (documentFrequency.get(a) || 0),
      )[0] || rootLabel;

    const bucket = level1.get(primary) || [];
    bucket.push(keyword);
    level1.set(primary, bucket);
  });

  // Nhãn nhánh lấy từ khóa ngắn nhất trong nhóm để đọc tự nhiên
  // ("du lịch đà nẵng") thay vì token trần ("đà nẵng").
  const labelOf = (groupKeywords: string[]): string =>
    [...groupKeywords].sort(
      (a, b) => a.length - b.length || a.localeCompare(b, 'vi'),
    )[0] || rootLabel;

  const children: UniverseNode[] = [...level1.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'vi'))
    .map(([label, groupKeywords]) => {
      const level2 = new Map<string, string[]>();

      groupKeywords.forEach((keyword) => {
        const modifiers = (tokensOf.get(keyword) || []).filter(
          (token) => !coreTokens.has(token) && token !== label,
        );
        const secondary =
          modifiers.sort(
            (a, b) => (documentFrequency.get(b) || 0) - (documentFrequency.get(a) || 0),
          )[0] || '';

        const key = secondary ? `${label} ${secondary}` : label;
        const bucket = level2.get(key) || [];
        bucket.push(keyword);
        level2.set(key, bucket);
      });

      const grandChildren: UniverseNode[] =
        level2.size <= 1
          ? []
          : [...level2.entries()]
              .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'vi'))
              .map(([, childKeywords]) => ({
                label: labelOf(childKeywords),
                count: childKeywords.length,
                keywords: childKeywords,
                children: [],
              }));

      return {
        label: labelOf(groupKeywords),
        count: groupKeywords.length,
        keywords: groupKeywords,
        children: grandChildren,
      };
    });

  return {
    label: rootLabel,
    count: keywords.length,
    keywords,
    children,
  };
}

const QUESTION_TEMPLATES: Array<(seed: string) => string> = [
  (seed) => `${seed} là gì`,
  (seed) => `${seed} như thế nào`,
  (seed) => `cách ${seed}`,
  (seed) => `cách ${seed} hiệu quả`,
  (seed) => `tại sao ${seed}`,
  (seed) => `có nên ${seed} không`,
  (seed) => `${seed} có tốt không`,
  (seed) => `${seed} giá bao nhiêu`,
  (seed) => `${seed} bao lâu`,
  (seed) => `${seed} ở đâu`,
  (seed) => `${seed} ở đâu uy tín`,
  (seed) => `khi nào nên ${seed}`,
  (seed) => `${seed} loại nào tốt`,
  (seed) => `${seed} cho người mới bắt đầu`,
  (seed) => `${seed} cần lưu ý gì`,
  (seed) => `${seed} có hại không`,
  (seed) => `nên chọn ${seed} nào`,
  (seed) => `${seed} khác gì`,
  (seed) => `${seed} bao nhiêu tiền`,
  (seed) => `${seed} có khó không`,
];

export const QUESTION_GROUPS: Array<{ label: string; markers: string[] }> = [
  { label: 'Là gì / định nghĩa', markers: ['là gì', 'khác gì'] },
  { label: 'Cách làm / hướng dẫn', markers: ['cách ', 'như thế nào', 'làm sao', 'thế nào'] },
  { label: 'Có nên / lựa chọn', markers: ['có nên', 'nên ', 'loại nào', 'cái nào', 'có tốt không', 'có hại không', 'có khó không'] },
  { label: 'Bao nhiêu / chi phí', markers: ['bao nhiêu', 'giá', 'bao lâu', 'tiền'] },
  { label: 'Ở đâu / khi nào', markers: ['ở đâu', 'khi nào', 'tại sao', 'vì sao'] },
];

export function generateQuestions(seed: string): string[] {
  const normalized = normalizeKeyword(seed);
  if (normalized.length < 2) return [];
  return [...new Set(QUESTION_TEMPLATES.map((template) => normalizeKeyword(template(normalized))))];
}

export function groupQuestions(questions: string[]): Array<{ label: string; items: string[] }> {
  const used = new Set<string>();
  const groups = QUESTION_GROUPS.map((group) => {
    const items = questions.filter((question) => {
      if (used.has(question)) return false;
      const padded = ` ${question} `;
      if (!group.markers.some((marker) => padded.includes(marker))) return false;
      used.add(question);
      return true;
    });
    return { label: group.label, items };
  }).filter((group) => group.items.length > 0);

  const rest = questions.filter((question) => !used.has(question));
  if (rest.length > 0) groups.push({ label: 'Câu hỏi khác', items: rest });

  return groups;
}

function titleCase(value: string): string {
  return value.replace(/^./u, (letter) => letter.toLocaleUpperCase('vi'));
}

const TITLE_PATTERNS: Record<ContentType, (keyword: string) => string> = {
  article: (keyword) => `${titleCase(keyword)}: hướng dẫn chi tiết từ A–Z`,
  review: (keyword) => `Top ${titleCase(keyword)} tốt nhất — so sánh & đánh giá`,
  category: (keyword) => `${titleCase(keyword)} — bảng giá & lựa chọn mới nhất`,
  product: (keyword) => `${titleCase(keyword)} chính hãng, giá tốt`,
  landing: (keyword) => `${titleCase(keyword)} — thông tin đầy đủ`,
  faq: (keyword) => `${titleCase(keyword)}: giải đáp các câu hỏi thường gặp`,
};

const META_PATTERNS: Record<ContentType, (keyword: string) => string> = {
  article: (keyword) =>
    `Tìm hiểu ${keyword} đầy đủ: khái niệm, cách thực hiện, kinh nghiệm và lưu ý quan trọng. Hướng dẫn cập nhật, dễ áp dụng.`,
  review: (keyword) =>
    `So sánh chi tiết ${keyword}: ưu nhược điểm, mức giá, tiêu chí chọn và gợi ý phù hợp cho từng nhu cầu.`,
  category: (keyword) =>
    `Danh mục ${keyword} với đầy đủ lựa chọn, mức giá tham khảo và tiêu chí so sánh giúp bạn quyết định nhanh.`,
  product: (keyword) =>
    `${titleCase(keyword)} — thông số, mức giá, chính sách bảo hành và tư vấn chọn mua phù hợp nhu cầu.`,
  landing: (keyword) => `Tất cả thông tin về ${keyword}: tổng quan, lựa chọn và hướng dẫn tiếp theo.`,
  faq: (keyword) => `Giải đáp các thắc mắc phổ biến nhất về ${keyword}, ngắn gọn và dễ hiểu.`,
};

/** Kế hoạch nội dung: một trang pillar và các trang cluster xoay quanh nó. */
export function buildContentPlan(clusters: KeywordCluster[], seed: string): ContentPlanItem[] {
  if (clusters.length === 0) return [];

  const pillarKeyword = normalizeKeyword(seed) || clusters[0].name;
  const clusterItems = clusters.slice(0, 60);

  const pillar: ContentPlanItem = {
    role: 'pillar',
    title: `${titleCase(pillarKeyword)} — tổng hợp đầy đủ`,
    targetKeyword: pillarKeyword,
    contentType: 'article',
    intent: classifyIntent(pillarKeyword),
    keywordCount: clusterItems.reduce((sum, cluster) => sum + cluster.keywords.length, 0),
    supportingKeywords: clusterItems.slice(0, 12).map((cluster) => cluster.name),
    internalLinks: clusterItems.slice(0, 12).map((cluster) => cluster.name),
  };

  const children: ContentPlanItem[] = clusterItems.map((cluster) => ({
    role: 'cluster',
    title: TITLE_PATTERNS[cluster.contentType](cluster.name),
    targetKeyword: cluster.name,
    contentType: cluster.contentType,
    intent: cluster.intent,
    keywordCount: cluster.keywords.length,
    supportingKeywords: cluster.keywords.slice(1, 9).map((item) => item.keyword),
    internalLinks: [pillarKeyword],
  }));

  return [pillar, ...children];
}

/** Content brief cho một cụm: title, meta, outline, entity, câu hỏi, internal link. */
export function buildContentBrief(
  cluster: KeywordCluster,
  allClusters: KeywordCluster[],
): ContentBrief {
  const target = cluster.name;
  const questions = cluster.keywords.filter((item) => item.isQuestion).map((item) => item.keyword);
  const generated = generateQuestions(target).slice(0, 6);
  const mergedQuestions = [...new Set([...questions, ...generated])].slice(0, 10);

  const nameTokens = new Set(tokenize(target));
  const secondary = cluster.keywords
    .filter((item) => item.keyword !== target && !item.isQuestion)
    .map((item) => item.keyword)
    .slice(0, 15);

  // Entity: token riêng biệt (thương hiệu, địa danh, số hiệu) xuất hiện trong cụm.
  const entities = [
    ...new Set(
      cluster.keywords
        .flatMap((item) => tokenize(item.keyword))
        .filter((token) => !nameTokens.has(token) && (/\d/.test(token) || /^[a-z]+$/.test(token))),
    ),
  ].slice(0, 12);

  const outline: ContentBrief['outline'] = [
    { heading: `${titleCase(target)} là gì?`, level: 2 },
    ...secondary.slice(0, 6).map((keyword) => ({ heading: titleCase(keyword), level: 2 as const })),
    { heading: 'Tiêu chí lựa chọn / lưu ý quan trọng', level: 2 },
    ...mergedQuestions.slice(0, 5).map((question) => ({ heading: titleCase(question), level: 3 as const })),
    { heading: 'Câu hỏi thường gặp', level: 2 },
  ];

  const wordCountTarget: [number, number] =
    cluster.contentType === 'product' || cluster.contentType === 'category'
      ? [600, 1200]
      : cluster.keywords.length >= 10
        ? [1800, 2500]
        : [1200, 1800];

  return {
    targetKeyword: target,
    intent: cluster.intent,
    contentType: cluster.contentType,
    title: TITLE_PATTERNS[cluster.contentType](target),
    metaDescription: META_PATTERNS[cluster.contentType](target).slice(0, 160),
    h1: titleCase(target),
    outline,
    secondaryKeywords: secondary,
    questions: mergedQuestions,
    entities,
    internalLinks: allClusters
      .filter((item) => item.name !== target)
      .slice(0, 6)
      .map((item) => item.name),
    wordCountTarget,
  };
}

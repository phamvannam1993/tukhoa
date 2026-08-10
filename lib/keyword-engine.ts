import type {
  KeywordItem,
  KeywordSource,
  SearchIntent,
  SourceMode,
} from './keyword-types';

const STOP_WORDS = new Set([
  'và', 'là', 'của', 'cho', 'với', 'từ', 'có', 'không', 'một', 'các',
  'những', 'được', 'ở', 'tại', 'nào', 'gì', 'về', 'trên', 'theo',
]);

const INTENT_PATTERNS: Array<{ intent: SearchIntent; terms: string[] }> = [
  {
    intent: 'local',
    terms: ['gần đây', 'gần nhất', 'tại hà nội', 'tại tphcm', 'ở đâu', 'quanh đây'],
  },
  {
    intent: 'transactional',
    terms: ['mua', 'giá', 'đặt hàng', 'đăng ký', 'tải', 'download', 'khuyến mãi', 'voucher'],
  },
  {
    intent: 'commercial',
    terms: ['review', 'đánh giá', 'so sánh', 'tốt nhất', 'top ', 'nên mua', 'uy tín'],
  },
  {
    intent: 'navigational',
    terms: ['đăng nhập', 'login', 'website', 'trang chủ', 'chính thức', 'app '],
  },
  {
    intent: 'informational',
    terms: ['cách ', 'là gì', 'hướng dẫn', 'tại sao', 'bao nhiêu', 'khi nào', 'kinh nghiệm'],
  },
];

export function normalizeKeyword(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/[|•]+/g, ' ')
    .trim()
    .toLocaleLowerCase('vi');
}

export function tokenize(value: string): string[] {
  return normalizeKeyword(value)
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export function classifyIntent(keyword: string): SearchIntent {
  const normalized = normalizeKeyword(keyword);

  for (const group of INTENT_PATTERNS) {
    if (group.terms.some((term) => normalized.includes(term))) {
      return group.intent;
    }
  }

  return 'informational';
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

function assignClusters(keywords: string[], fallback: string): Map<string, string> {
  const clusters: Array<{ name: string; tokens: Set<string> }> = [];
  const output = new Map<string, string>();

  const ordered = [...keywords].sort(
    (a, b) => tokenize(a).length - tokenize(b).length || a.localeCompare(b, 'vi'),
  );

  for (const keyword of ordered) {
    const tokens = new Set(tokenize(keyword));
    let bestIndex = -1;
    let bestScore = 0;

    clusters.forEach((cluster, index) => {
      const score = jaccard(tokens, cluster.tokens);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    if (bestIndex >= 0 && bestScore >= 0.45) {
      output.set(keyword, clusters[bestIndex].name);
      clusters[bestIndex].tokens = new Set([...clusters[bestIndex].tokens, ...tokens]);
      continue;
    }

    const nameTokens = [...tokens].slice(0, 4);
    const name = nameTokens.length
      ? nameTokens.join(' ').replace(/^./u, (letter) => letter.toLocaleUpperCase('vi'))
      : fallback;

    clusters.push({ name, tokens });
    output.set(keyword, name);
  }

  return output;
}

function score(keyword: string, sourceCount: number, intent: SearchIntent): number {
  const intentBonus: Record<SearchIntent, number> = {
    informational: 4,
    commercial: 13,
    transactional: 15,
    navigational: 2,
    local: 10,
  };

  const wordCount = tokenize(keyword).length;
  let total = 36 + Math.min(sourceCount * 10, 30) + intentBonus[intent];

  if (wordCount >= 3 && wordCount <= 6) total += 14;
  if (wordCount >= 7) total += 7;
  if (wordCount <= 1) total -= 10;

  return Math.max(1, Math.min(100, total));
}

export function buildKeywordItems(
  seed: string,
  raw: Array<{
    keyword: string;
    source: KeywordSource;
    sourceMode: SourceMode;
  }>,
): KeywordItem[] {
  const merged = new Map<
    string,
    {
      keyword: string;
      sources: Set<KeywordSource>;
      sourceModes: Set<SourceMode>;
    }
  >();

  raw.forEach((item) => {
    const keyword = normalizeKeyword(item.keyword);
    if (!keyword) return;

    const current = merged.get(keyword) || {
      keyword,
      sources: new Set<KeywordSource>(),
      sourceModes: new Set<SourceMode>(),
    };

    current.sources.add(item.source);
    current.sourceModes.add(item.sourceMode);
    merged.set(keyword, current);
  });

  const values = [...merged.values()];
  const clusters = assignClusters(values.map((item) => item.keyword), seed);

  return values
    .map((item) => {
      const intent = classifyIntent(item.keyword);
      return {
        keyword: item.keyword,
        sources: [...item.sources],
        sourceModes: [...item.sourceModes],
        intent,
        cluster: clusters.get(item.keyword) || seed,
        opportunityScore: score(item.keyword, item.sources.size, intent),
      };
    })
    .sort(
      (a, b) =>
        b.opportunityScore - a.opportunityScore ||
        a.keyword.localeCompare(b.keyword, 'vi'),
    )
    .slice(0, 300);
}

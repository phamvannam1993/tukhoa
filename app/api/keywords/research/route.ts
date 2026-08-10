import { NextRequest, NextResponse } from 'next/server';
import {
  buildKeywordItems,
  normalizeKeyword,
} from '../../../../lib/keyword-engine';
import { fetchAutocomplete } from '../../../../lib/autocomplete';
import type {
  KeywordSource,
  SourceMode,
} from '../../../../lib/keyword-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_SOURCES = new Set<KeywordSource>([
  'google',
  'youtube',
  'tiktok',
  'shopee',
]);

const LIVE_EXPANSIONS = [
  '',
  'cách ',
  'là gì ',
  'giá ',
  'review ',
  'so sánh ',
] as const;

const LIVE_SUFFIXES = ['', ' a', ' b', ' c', ' 2026'] as const;

function fallbackSuggestions(seed: string, source: KeywordSource): string[] {
  const common = [
    seed,
    `${seed} là gì`,
    `cách ${seed}`,
    `${seed} cho người mới`,
    `${seed} hướng dẫn`,
    `${seed} kinh nghiệm`,
    `${seed} tốt nhất`,
    `${seed} review`,
    `${seed} so sánh`,
    `${seed} 2026`,
    `${seed} miễn phí`,
    `${seed} online`,
    `${seed} có tốt không`,
    `${seed} nên chọn loại nào`,
  ];

  const sourceTemplates: Record<KeywordSource, string[]> = {
    google: [
      ...common,
      `${seed} giá bao nhiêu`,
      `${seed} ở đâu`,
      `${seed} gần đây`,
      `${seed} pdf`,
      `${seed} bài tập`,
      `${seed} đáp án`,
      `${seed} tại nhà`,
      `${seed} cho trẻ em`,
      `${seed} cho người lớn`,
    ],
    youtube: [
      ...common,
      `${seed} video`,
      `${seed} youtube`,
      `${seed} shorts`,
      `${seed} từng bước`,
      `${seed} mẹo hay`,
      `${seed} hướng dẫn chi tiết`,
      `video cách ${seed}`,
      `${seed} cho người mới bắt đầu`,
    ],
    tiktok: [
      ...common,
      `${seed} tiktok`,
      `${seed} xu hướng`,
      `${seed} viral`,
      `${seed} video ngắn`,
      `${seed} mẹo`,
      `cách làm ${seed}`,
      `${seed} trend 2026`,
      `${seed} cho người mới bắt đầu`,
    ],
    shopee: [
      seed,
      `${seed} shopee`,
      `mua ${seed}`,
      `${seed} giá rẻ`,
      `${seed} chính hãng`,
      `${seed} tốt nhất`,
      `${seed} review`,
      `${seed} khuyến mãi`,
      `${seed} freeship`,
      `${seed} giá bao nhiêu`,
      `${seed} nên mua loại nào`,
      `${seed} bán chạy`,
      `${seed} cao cấp`,
      `${seed} cho gia đình`,
    ],
  };

  return [...new Set(sourceTemplates[source].map(normalizeKeyword))];
}

function buildLiveQueries(seed: string): string[] {
  const queries = new Set<string>();

  LIVE_EXPANSIONS.forEach((prefix) => {
    queries.add(`${prefix}${seed}`.trim());
  });

  LIVE_SUFFIXES.forEach((suffix) => {
    queries.add(`${seed}${suffix}`.trim());
  });

  return [...queries];
}

async function getSuggestions(
  seed: string,
  source: KeywordSource,
  language: string,
): Promise<
  Array<{ keyword: string; source: KeywordSource; sourceMode: SourceMode }>
> {
  const fallback = fallbackSuggestions(seed, source).map((keyword) => ({
    keyword,
    source,
    sourceMode: 'heuristic' as const,
  }));

  if (source !== 'google' && source !== 'youtube') return fallback;

  const batches = await Promise.all(
    buildLiveQueries(seed).map((query) =>
      fetchAutocomplete(source, query, language),
    ),
  );

  const live = [...new Set(batches.flat().map(normalizeKeyword))]
    .filter((keyword) => keyword.length >= 2)
    .slice(0, 160)
    .map((keyword) => ({
      keyword,
      source,
      sourceMode: 'live_autocomplete' as const,
    }));

  // Luôn trộn một bộ dự phòng. Vì vậy công cụ vẫn có kết quả khi
  // Google chặn IP máy chủ, DNS lỗi hoặc môi trường deploy không ra Internet.
  return [...live, ...fallback];
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { message: 'Dữ liệu không hợp lệ.' },
        { status: 400 },
      );
    }

    const input = body as {
      seed?: unknown;
      sources?: unknown;
      language?: unknown;
    };

    const seed =
      typeof input.seed === 'string' ? normalizeKeyword(input.seed) : '';
    const language =
      typeof input.language === 'string' && input.language.length <= 10
        ? input.language
        : 'vi';

    const sources = Array.isArray(input.sources)
      ? input.sources.filter(
          (source): source is KeywordSource =>
            typeof source === 'string' &&
            VALID_SOURCES.has(source as KeywordSource),
        )
      : [];

    const uniqueSources = [...new Set(sources)];

    if (seed.length < 2 || seed.length > 120) {
      return NextResponse.json(
        { message: 'Từ khóa gốc phải dài từ 2 đến 120 ký tự.' },
        { status: 400 },
      );
    }

    if (uniqueSources.length === 0 || uniqueSources.length > 4) {
      return NextResponse.json(
        { message: 'Hãy chọn từ 1 đến 4 nguồn.' },
        { status: 400 },
      );
    }

    const raw = (
      await Promise.all(
        uniqueSources.map((source) =>
          getSuggestions(seed, source, language),
        ),
      )
    ).flat();

    const items = buildKeywordItems(seed, raw);
    const hasLiveData = items.some((item) =>
      item.sourceModes.includes('live_autocomplete'),
    );

    return NextResponse.json(
      {
        seed,
        total: items.length,
        note: hasLiveData
          ? 'Đã lấy được Autocomplete trực tiếp và bổ sung thêm các biến thể liên quan.'
          : 'Nguồn Autocomplete đang không phản hồi, công cụ đã dùng bộ mở rộng dự phòng để vẫn trả kết quả.',
        items,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('Keyword research error:', error);

    return NextResponse.json(
      { message: 'Không thể xử lý yêu cầu lúc này.' },
      { status: 500 },
    );
  }
}

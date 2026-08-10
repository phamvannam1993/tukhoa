import { NextRequest, NextResponse } from 'next/server';
import { fetchAutocomplete } from '../../../../lib/autocomplete';
import { normalizeKeyword } from '../../../../lib/keyword-engine';
import { generateQuestions } from '../../../../lib/seo-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALPHABET = 'abcdeghiklmnopqrstuvxy'.split('');

const QUESTION_PREFIXES = [
  'cách',
  'tại sao',
  'có nên',
  'khi nào',
  'nên chọn',
  'làm sao',
];

const QUESTION_SUFFIXES = [
  'là gì',
  'như thế nào',
  'bao nhiêu',
  'ở đâu',
  'loại nào',
  'có tốt không',
  'bao lâu',
  'cần lưu ý gì',
];

type Mode = 'questions' | 'alphabet' | 'both';

function buildQueries(seed: string, mode: Mode): string[] {
  const queries = new Set<string>([seed]);

  if (mode === 'questions' || mode === 'both') {
    QUESTION_PREFIXES.forEach((prefix) => queries.add(`${prefix} ${seed}`));
    QUESTION_SUFFIXES.forEach((suffix) => queries.add(`${seed} ${suffix}`));
  }

  if (mode === 'alphabet' || mode === 'both') {
    ALPHABET.forEach((letter) => queries.add(`${seed} ${letter}`));
  }

  return [...queries];
}

/** Chạy theo lô để không mở hàng chục kết nối cùng lúc tới Autocomplete. */
async function runBatched(
  queries: string[],
  worker: (query: string) => Promise<string[]>,
  size = 6,
): Promise<string[]> {
  const output: string[] = [];

  for (let index = 0; index < queries.length; index += size) {
    const batch = queries.slice(index, index + size);
    const results = await Promise.all(batch.map(worker));
    output.push(...results.flat());
  }

  return output;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      seed?: unknown;
      mode?: unknown;
      language?: unknown;
    } | null;

    const seed = typeof body?.seed === 'string' ? normalizeKeyword(body.seed) : '';
    const mode: Mode =
      body?.mode === 'alphabet' || body?.mode === 'both' ? body.mode : 'questions';
    const language =
      typeof body?.language === 'string' && body.language.length <= 10 ? body.language : 'vi';

    if (seed.length < 2 || seed.length > 120) {
      return NextResponse.json(
        { message: 'Từ khóa gốc phải dài từ 2 đến 120 ký tự.' },
        { status: 400 },
      );
    }

    const live = await runBatched(buildQueries(seed, mode), (query) =>
      fetchAutocomplete('google', query, language),
    );

    const liveKeywords = [...new Set(live.map(normalizeKeyword))].filter(
      (keyword) => keyword.length >= 2 && keyword.includes(seed.split(' ')[0]),
    );

    const fallback = mode === 'alphabet' ? [] : generateQuestions(seed);
    const keywords = [...new Set([...liveKeywords, ...fallback])].slice(0, 500);

    return NextResponse.json(
      {
        seed,
        mode,
        total: keywords.length,
        live: liveKeywords.length,
        note:
          liveKeywords.length > 0
            ? 'Đã lấy gợi ý trực tiếp từ Google Autocomplete.'
            : 'Autocomplete không phản hồi, kết quả đang dùng bộ mẫu câu hỏi tiếng Việt.',
        keywords,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (error) {
    console.error('Keyword expand error:', error);
    return NextResponse.json({ message: 'Không thể xử lý yêu cầu lúc này.' }, { status: 500 });
  }
}

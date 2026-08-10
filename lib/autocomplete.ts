import type { KeywordSource } from './keyword-types';

function autocompleteUrls(
  source: KeywordSource,
  query: string,
  language: string,
): string[] {
  if (source !== 'google' && source !== 'youtube') return [];

  const build = (host: string, client: 'firefox' | 'chrome'): string => {
    const params = new URLSearchParams({
      client,
      hl: language,
      gl: 'vn',
      q: query,
    });

    if (source === 'youtube') params.set('ds', 'yt');
    return `${host}/complete/search?${params.toString()}`;
  };

  return [
    build('https://suggestqueries.google.com', 'firefox'),
    build('https://clients1.google.com', 'firefox'),
    build('https://www.google.com', 'chrome'),
  ];
}

export function parseAutocompletePayload(text: string): string[] {
  const cleaned = text
    .replace(/^\)\]\}'\s*/, '')
    .replace(/^\/\*\*\//, '')
    .trim();

  let payload: unknown;

  try {
    payload = JSON.parse(cleaned);
  } catch {
    const firstParen = cleaned.indexOf('(');
    const lastParen = cleaned.lastIndexOf(')');

    if (firstParen < 0 || lastParen <= firstParen) return [];

    try {
      payload = JSON.parse(cleaned.slice(firstParen + 1, lastParen));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(payload) || !Array.isArray(payload[1])) return [];

  return payload[1]
    .map((item) => {
      if (typeof item === 'string') return item;
      if (Array.isArray(item) && typeof item[0] === 'string') return item[0];
      return '';
    })
    .filter((item): item is string => Boolean(item));
}

async function fetchAutocompleteFromUrl(url: string): Promise<string[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        accept: 'application/json,text/plain,*/*',
        'accept-language': 'vi-VN,vi;q=0.9,en;q=0.7',
        referer: 'https://www.google.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
      },
    });

    if (!response.ok) return [];
    return parseAutocompletePayload(await response.text());
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchAutocomplete(
  source: KeywordSource,
  query: string,
  language: string,
): Promise<string[]> {
  for (const url of autocompleteUrls(source, query, language)) {
    const suggestions = await fetchAutocompleteFromUrl(url);
    if (suggestions.length > 0) return suggestions;
  }

  return [];
}

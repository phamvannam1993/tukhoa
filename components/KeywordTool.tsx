'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { buildKeywordItems, normalizeKeyword } from '../lib/keyword-engine';
import type {
  KeywordItem,
  KeywordSource,
  ResearchResponse,
  SearchIntent,
} from '../lib/keyword-types';

const SOURCE_LABELS: Record<KeywordSource, string> = {
  google: 'Google',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  shopee: 'Shopee',
};

const INTENT_LABELS: Record<SearchIntent, string> = {
  informational: 'Thông tin',
  commercial: 'Thương mại',
  transactional: 'Giao dịch',
  navigational: 'Điều hướng',
  local: 'Địa phương',
};

const QUICK_SEEDS = ['máy lọc không khí', 'học tiếng anh', 'du lịch đà nẵng', 'nồi chiên không dầu'];

function browserFallbackSuggestions(seed: string, source: KeywordSource): string[] {
  const common = [
    seed,
    `${seed} là gì`,
    `cách ${seed}`,
    `${seed} hướng dẫn`,
    `${seed} cho người mới`,
    `${seed} kinh nghiệm`,
    `${seed} tốt nhất`,
    `${seed} review`,
    `${seed} so sánh`,
    `${seed} 2026`,
    `${seed} miễn phí`,
    `${seed} online`,
    `${seed} có tốt không`,
  ];

  const templates: Record<KeywordSource, string[]> = {
    google: [...common, `${seed} giá bao nhiêu`, `${seed} ở đâu`, `${seed} gần đây`, `${seed} pdf`, `${seed} bài tập`, `${seed} đáp án`, `${seed} tại nhà`],
    youtube: [...common, `${seed} video`, `${seed} youtube`, `${seed} shorts`, `${seed} từng bước`, `${seed} mẹo hay`, `video cách ${seed}`],
    tiktok: [...common, `${seed} tiktok`, `${seed} xu hướng`, `${seed} viral`, `${seed} video ngắn`, `${seed} trend 2026`, `cách làm ${seed}`],
    shopee: [seed, `${seed} shopee`, `mua ${seed}`, `${seed} giá rẻ`, `${seed} chính hãng`, `${seed} tốt nhất`, `${seed} review`, `${seed} khuyến mãi`, `${seed} freeship`, `${seed} bán chạy`, `${seed} nên mua loại nào`],
  };

  return [...new Set(templates[source].map(normalizeKeyword))];
}

function buildBrowserFallback(seed: string, sources: KeywordSource[]): ResearchResponse {
  const normalizedSeed = normalizeKeyword(seed);
  const raw = sources.flatMap((source) =>
    browserFallbackSuggestions(normalizedSeed, source).map((keyword) => ({
      keyword,
      source,
      sourceMode: 'heuristic' as const,
    })),
  );
  const items = buildKeywordItems(normalizedSeed, raw);
  return {
    seed: normalizedSeed,
    total: items.length,
    note: 'API tìm kiếm chưa phản hồi nên trình duyệt đang dùng bộ mở rộng dự phòng. Kết quả vẫn dùng được để lên ý tưởng nhưng không phải volume trực tiếp.',
    items,
  };
}

function csvEscape(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadCsv(items: KeywordItem[]): void {
  const rows = [
    ['Từ khóa', 'Nguồn', 'Ý định', 'Cụm chủ đề', 'Điểm cơ hội'],
    ...items.map((item) => [
      item.keyword,
      item.sources.map((source) => SOURCE_LABELS[source]).join(', '),
      INTENT_LABELS[item.intent],
      item.cluster,
      item.opportunityScore,
    ]),
  ];
  const csv = '﻿' + rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tu-khoa-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const RECENT_KEY = 'tukhoa_recent';

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as string[];
  } catch {
    return [];
  }
}

export function KeywordTool({ defaultSources }: { defaultSources: KeywordSource[] }) {
  const [seed, setSeed] = useState('');
  const [sources, setSources] = useState<KeywordSource[]>(defaultSources);
  const [data, setData] = useState<ResearchResponse | null>(null);
  const [query, setQuery] = useState('');
  const [intent, setIntent] = useState<'all' | SearchIntent>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => setRecent(readRecent()), []);

  // Cho phép chia sẻ kết quả qua URL ?seed=... và hỗ trợ sitelinks searchbox.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('seed');
    if (s && s.trim().length >= 2) {
      setSeed(s);
      void runSearch(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const keywordQuery = query.trim().toLocaleLowerCase('vi');
    return data.items.filter((item) => {
      const matchesText =
        !keywordQuery ||
        item.keyword.includes(keywordQuery) ||
        item.cluster.toLocaleLowerCase('vi').includes(keywordQuery);
      const matchesIntent = intent === 'all' || item.intent === intent;
      return matchesText && matchesIntent;
    });
  }, [data, query, intent]);

  const stats = useMemo(() => {
    if (!data) return null;
    const clusters = new Set(data.items.map((i) => i.cluster)).size;
    const info = data.items.filter((i) => i.intent === 'informational').length;
    const buy = data.items.filter((i) => i.intent === 'transactional' || i.intent === 'commercial').length;
    return { total: data.total, clusters, info, buy };
  }, [data]);

  function toggleSource(source: KeywordSource): void {
    setSources((current) =>
      current.includes(source) ? current.filter((item) => item !== source) : [...current, source],
    );
  }

  function saveRecent(value: string): void {
    try {
      const current = readRecent();
      const next = [value, ...current.filter((item) => item !== value)].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next);
    } catch {
      /* localStorage optional */
    }
  }

  async function runSearch(rawSeed: string): Promise<void> {
    setError('');
    const normalizedSeed = rawSeed.trim();
    if (normalizedSeed.length < 2) {
      setError('Hãy nhập từ khóa dài ít nhất 2 ký tự.');
      return;
    }
    if (sources.length === 0) {
      setError('Hãy chọn ít nhất một nguồn.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/keywords/research', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seed: normalizedSeed, sources, language: 'vi' }),
      });
      const payload = (await response.json().catch(() => null)) as
        | ResearchResponse
        | { message?: string }
        | null;
      if (!response.ok || !payload || !('items' in payload) || !Array.isArray(payload.items) || payload.items.length === 0) {
        setData(buildBrowserFallback(normalizedSeed, sources));
      } else {
        setData(payload);
      }
      saveRecent(normalizedSeed);
    } catch {
      setData(buildBrowserFallback(normalizedSeed, sources));
      saveRecent(normalizedSeed);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void runSearch(seed);
  }

  function pickSeed(value: string): void {
    setSeed(value);
    void runSearch(value);
  }

  async function copyKeyword(kw: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(kw);
      setCopied(kw);
      setTimeout(() => setCopied((c) => (c === kw ? null : c)), 1200);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  async function copyAll(): Promise<void> {
    try {
      await navigator.clipboard.writeText(filtered.map((i) => i.keyword).join('\n'));
      setCopied('__all__');
      setTimeout(() => setCopied((c) => (c === '__all__' ? null : c)), 1200);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="container toolSection">
      <div className="toolPanel">
        <form onSubmit={submit}>
          <div className="toolPanelHead">
            <label className="fieldLabel" htmlFor="keyword-seed">
              Nhập từ khóa gốc
            </label>
            <span className="toolHint">Miễn phí · không đăng nhập</span>
          </div>

          <div className="searchRow">
            <input
              id="keyword-seed"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="Ví dụ: toán lớp 1, máy lọc không khí…"
              maxLength={120}
              autoComplete="off"
            />
            <button type="submit" className="primaryBtn" disabled={loading}>
              {loading ? 'Đang tìm…' : 'Tìm từ khóa'}
            </button>
          </div>

          <div className="quickSeeds">
            <span className="qLabel">Thử nhanh:</span>
            {QUICK_SEEDS.map((s) => (
              <button type="button" key={s} className="chip" onClick={() => pickSeed(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>

          <div className="sourceList">
            {(Object.keys(SOURCE_LABELS) as KeywordSource[]).map((source) => {
              const active = sources.includes(source);
              return (
                <label
                  className={`sourceOption${active ? ' isActive' : ''}`}
                  data-platform={source}
                  key={source}
                >
                  <input type="checkbox" checked={active} onChange={() => toggleSource(source)} />
                  <span className="srcDot" aria-hidden="true" />
                  <span>{SOURCE_LABELS[source]}</span>
                  {(source === 'tiktok' || source === 'shopee') && <small>Mẫu</small>}
                </label>
              );
            })}
          </div>

          {recent.length > 0 && (
            <div className="recentRow">
              <span className="qLabel">Gần đây:</span>
              {recent.slice(0, 6).map((r) => (
                <button type="button" key={r} className="chip" onClick={() => pickSeed(r)} disabled={loading}>
                  {r}
                </button>
              ))}
            </div>
          )}

          {error && <p className="errorText">{error}</p>}
        </form>
      </div>

      {loading && !data && (
        <div className="skeletonPanel" aria-hidden="true">
          <div className="skelRow head" />
          <div className="skelRow" />
          <div className="skelRow" />
          <div className="skelRow" />
          <div className="skelRow" />
        </div>
      )}

      {data && (
        <div className="resultsPanel">
          <div className="resultsHeader">
            <div>
              <p className="eyebrow">KẾT QUẢ</p>
              <h2>
                {data.total} từ khóa cho “{data.seed}”
              </h2>
              <p className="note">{data.note}</p>
            </div>
            <div className="headerActions">
              <button className="secondaryButton" type="button" onClick={copyAll} disabled={filtered.length === 0}>
                {copied === '__all__' ? '✓ Đã chép' : 'Chép tất cả'}
              </button>
              <button className="secondaryButton" type="button" onClick={() => downloadCsv(filtered)} disabled={filtered.length === 0}>
                Xuất CSV
              </button>
            </div>
          </div>

          {stats && (
            <div className="statStrip">
              <div className="statCard">
                <div className="statVal">{stats.total}</div>
                <div className="statLbl">Từ khóa</div>
              </div>
              <div className="statCard">
                <div className="statVal">{stats.clusters}</div>
                <div className="statLbl">Cụm chủ đề</div>
              </div>
              <div className="statCard">
                <div className="statVal">{stats.info}</div>
                <div className="statLbl">Ý định thông tin</div>
              </div>
              <div className="statCard">
                <div className="statVal">{stats.buy}</div>
                <div className="statLbl">Thương mại / giao dịch</div>
              </div>
            </div>
          )}

          <div className="filters">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Lọc theo từ khóa hoặc cụm…" />
            <select value={intent} onChange={(event) => setIntent(event.target.value as 'all' | SearchIntent)} aria-label="Lọc theo ý định">
              <option value="all">Mọi ý định</option>
              {(Object.keys(INTENT_LABELS) as SearchIntent[]).map((item) => (
                <option value={item} key={item}>
                  {INTENT_LABELS[item]}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="emptyState">
              <strong>Không có từ khóa khớp bộ lọc</strong>
              Thử xóa bớt điều kiện lọc hoặc chọn ý định khác.
            </div>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Từ khóa</th>
                    <th>Nguồn</th>
                    <th>Ý định</th>
                    <th>Cụm</th>
                    <th>Điểm cơ hội</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={`${item.keyword}-${item.sources.join('-')}`}>
                      <td className="keywordCell">
                        <span className="keywordMain">
                          {item.keyword}
                          <button
                            type="button"
                            className={`copyBtn${copied === item.keyword ? ' copied' : ''}`}
                            onClick={() => copyKeyword(item.keyword)}
                            aria-label="Chép từ khóa"
                            title="Chép"
                          >
                            {copied === item.keyword ? '✓' : '⧉'}
                          </button>
                        </span>
                      </td>
                      <td>
                        <div className="tagRow">
                          {item.sources.map((source) => (
                            <span className="sourceTag" data-platform={source} key={source}>
                              {SOURCE_LABELS[source]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`intentTag intent-${item.intent}`}>{INTENT_LABELS[item.intent]}</span>
                      </td>
                      <td>{item.cluster}</td>
                      <td>
                        <div className="scoreWrap">
                          <div className="scoreBar">
                            <span style={{ width: `${Math.min(100, item.opportunityScore)}%` }} />
                          </div>
                          <span className="scoreNum">{item.opportunityScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="resultsFooter">
            <p className="resultsCount">
              Hiển thị {filtered.length}/{data.total} từ khóa.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

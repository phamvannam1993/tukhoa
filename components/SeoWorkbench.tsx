'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  CONTENT_TYPE_LABELS,
  MAX_BULK_KEYWORDS,
  buildContentBrief,
  buildContentPlan,
  buildFaqSchema,
  buildUniverse,
  clusterKeywords,
  parseKeywordList,
  parseSitePages,
  suggestInternalLinks,
} from '../lib/seo-engine';
import type {
  KeywordCluster,
  SearchIntent,
  UniverseNode,
} from '../lib/keyword-types';

const INTENT_LABELS: Record<SearchIntent, string> = {
  informational: 'Thông tin',
  commercial: 'Thương mại',
  transactional: 'Giao dịch',
  navigational: 'Điều hướng',
  local: 'Địa phương',
};

type TabKey = 'clusters' | 'universe' | 'plan' | 'brief' | 'links';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'clusters', label: 'Gom cụm' },
  { key: 'universe', label: 'Cây chủ đề' },
  { key: 'plan', label: 'Kế hoạch nội dung' },
  { key: 'brief', label: 'Content brief' },
  { key: 'links', label: 'Internal link' },
];

const SAMPLE = [
  'máy lọc nước',
  'máy lọc nước tốt',
  'máy lọc nước gia đình',
  'máy lọc nước giá rẻ',
  'máy lọc nước nào tốt',
  'máy lọc nước ro',
  'máy lọc nước karofi',
  'máy lọc nước karofi giá bao nhiêu',
  'mua máy lọc nước ở đâu',
  'máy lọc nước là gì',
  'có nên mua máy lọc nước không',
  'giá máy lọc nước gia đình',
  'máy lọc nước kangaroo',
  'máy lọc nước kangaroo review',
  'lõi lọc nước bao lâu thay một lần',
].join('\n');

function csvEscape(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function download(name: string, content: string, type = 'text/csv;charset=utf-8'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function UniverseBranch({ node, depth }: { node: UniverseNode; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;

  return (
    <li className="uniNode" data-depth={depth}>
      <button type="button" className="uniLabel" onClick={() => setOpen((v) => !v)}>
        <span className="uniCaret">{hasChildren ? (open ? '▾' : '▸') : '•'}</span>
        <span>{node.label}</span>
        <span className="uniCount">{node.count}</span>
      </button>

      {open && hasChildren && (
        <ul className="uniList">
          {node.children.map((child) => (
            <UniverseBranch key={`${child.label}-${child.count}`} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}

      {open && !hasChildren && node.keywords.length > 0 && (
        <ul className="uniLeafList">
          {node.keywords.slice(0, 30).map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
          {node.keywords.length > 30 && <li className="uniMore">…và {node.keywords.length - 30} từ khóa nữa</li>}
        </ul>
      )}
    </li>
  );
}

export function SeoWorkbench({ initialTab = 'clusters' }: { initialTab?: TabKey }) {
  const [raw, setRaw] = useState('');
  const [seed, setSeed] = useState('');
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [submitted, setSubmitted] = useState('');
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [tightness, setTightness] = useState(0.45);
  const [sitePagesRaw, setSitePagesRaw] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const parsed = useMemo(() => parseKeywordList(submitted), [submitted]);

  const result = useMemo(
    () => (parsed.keywords.length > 0 ? clusterKeywords(parsed.keywords, tightness) : null),
    [parsed, tightness],
  );

  const rootLabel = seed.trim() || result?.clusters[0]?.name || 'từ khóa';

  const universe = useMemo(
    () => (result ? buildUniverse(parsed.keywords, rootLabel) : null),
    [result, parsed.keywords, rootLabel],
  );

  const plan = useMemo(
    () => (result ? buildContentPlan(result.clusters, rootLabel) : []),
    [result, rootLabel],
  );

  const brief = useMemo(() => {
    if (!result || result.clusters.length === 0) return null;
    const cluster = result.clusters[Math.min(selected, result.clusters.length - 1)];
    return buildContentBrief(cluster, result.clusters);
  }, [result, selected]);

  const linkSuggestions = useMemo(() => {
    if (!result) return [];
    const pages = parseSitePages(sitePagesRaw);
    return suggestInternalLinks(result.clusters, pages).filter(
      (item) => item.matches.length > 0,
    );
  }, [result, sitePagesRaw]);

  async function copyFaqSchema(): Promise<void> {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(buildFaqSchema(brief.questions));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 1400);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  function analyse(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError('');
    const { keywords } = parseKeywordList(raw);
    if (keywords.length < 2) {
      setError('Hãy dán ít nhất 2 từ khóa, mỗi từ khóa một dòng.');
      return;
    }
    setSubmitted(raw);
    setSelected(0);
  }

  async function fetchFromSeed(): Promise<void> {
    const value = seed.trim();
    if (value.length < 2) {
      setError('Nhập một từ khóa gốc để lấy danh sách tự động.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/keywords/expand', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seed: value, mode: 'both', language: 'vi' }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { keywords?: string[]; note?: string }
        | null;

      const keywords = Array.isArray(payload?.keywords) ? payload!.keywords : [];
      if (keywords.length === 0) {
        setError('Chưa lấy được gợi ý. Bạn có thể dán danh sách từ khóa thủ công.');
        return;
      }
      const text = keywords.join('\n');
      setRaw(text);
      setSubmitted(text);
      setSelected(0);
      setNote(payload?.note || '');
    } catch {
      setError('Không kết nối được tới máy chủ gợi ý. Hãy dán danh sách từ khóa thủ công.');
    } finally {
      setLoading(false);
    }
  }

  function exportClusters(clusters: KeywordCluster[]): void {
    const rows = [
      ['Cụm', 'Từ khóa', 'Ý định', 'Loại nội dung', 'Câu hỏi'],
      ...clusters.flatMap((cluster) =>
        cluster.keywords.map((item) => [
          cluster.name,
          item.keyword,
          INTENT_LABELS[item.intent],
          CONTENT_TYPE_LABELS[item.contentType],
          item.isQuestion ? 'Có' : '',
        ]),
      ),
    ];
    download(
      `cum-tu-khoa-${new Date().toISOString().slice(0, 10)}.csv`,
      '﻿' + rows.map((row) => row.map(csvEscape).join(',')).join('\n'),
    );
  }

  function exportBriefMarkdown(): void {
    if (!brief) return;
    const lines = [
      `# ${brief.title}`,
      '',
      `- **Từ khóa chính:** ${brief.targetKeyword}`,
      `- **Search intent:** ${INTENT_LABELS[brief.intent]}`,
      `- **Loại trang:** ${CONTENT_TYPE_LABELS[brief.contentType]}`,
      `- **Độ dài đề xuất:** ${brief.wordCountTarget[0]}–${brief.wordCountTarget[1]} từ`,
      '',
      `**Meta description:** ${brief.metaDescription}`,
      '',
      `**H1:** ${brief.h1}`,
      '',
      '## Dàn ý',
      ...brief.outline.map((item) => `${item.level === 2 ? '##' : '###'} ${item.heading}`),
      '',
      '## Từ khóa phụ',
      ...brief.secondaryKeywords.map((keyword) => `- ${keyword}`),
      '',
      '## Câu hỏi cần trả lời (FAQ)',
      ...brief.questions.map((question) => `- ${question}`),
      '',
      '## Entity nên nhắc tới',
      brief.entities.length > 0 ? brief.entities.join(', ') : '(chưa phát hiện)',
      '',
      '## Internal link gợi ý',
      ...brief.internalLinks.map((link) => `- ${link}`),
    ];
    download(
      `content-brief-${brief.targetKeyword.replace(/\s+/g, '-')}.md`,
      lines.join('\n'),
      'text/markdown;charset=utf-8',
    );
  }

  return (
    <section className="container toolSection">
      <div className="toolPanel">
        <form onSubmit={analyse}>
          <div className="toolPanelHead">
            <label className="fieldLabel" htmlFor="bulk-keywords">
              Dán danh sách từ khóa (tối đa {MAX_BULK_KEYWORDS.toLocaleString('vi-VN')})
            </label>
            <span className="toolHint">Xử lý ngay trong trình duyệt · không gửi đi đâu</span>
          </div>

          <div className="searchRow">
            <input
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="Từ khóa gốc (ví dụ: máy lọc nước) — dùng để tự lấy danh sách"
              maxLength={120}
              autoComplete="off"
            />
            <button type="button" className="secondaryButton" onClick={fetchFromSeed} disabled={loading}>
              {loading ? 'Đang lấy…' : 'Lấy tự động'}
            </button>
          </div>

          <textarea
            id="bulk-keywords"
            className="bulkInput"
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            rows={10}
            placeholder={'máy lọc nước\nmáy lọc nước gia đình\nmáy lọc nước giá rẻ\n…'}
          />

          <div className="quickSeeds">
            <button type="submit" className="primaryBtn">
              Phân tích {parseKeywordList(raw).keywords.length > 0 ? `${parseKeywordList(raw).keywords.length} từ khóa` : ''}
            </button>
            <button type="button" className="chip" onClick={() => setRaw(SAMPLE)}>
              Dùng danh sách mẫu
            </button>
            <label className="tightnessField">
              Độ chặt của cụm
              <select value={tightness} onChange={(event) => setTightness(Number(event.target.value))}>
                <option value={0.35}>Rộng — ít cụm, mỗi cụm nhiều từ khóa</option>
                <option value={0.45}>Cân bằng (khuyên dùng)</option>
                <option value={0.6}>Chặt — nhiều cụm, tách kỹ theo biến thể</option>
              </select>
            </label>
            {raw && (
              <button type="button" className="chip" onClick={() => { setRaw(''); setSubmitted(''); }}>
                Xóa
              </button>
            )}
          </div>

          {error && <p className="errorText">{error}</p>}
        </form>
      </div>

      {result && (
        <div className="resultsPanel">
          <div className="resultsHeader">
            <div>
              <p className="eyebrow">KẾT QUẢ</p>
              <h2>
                {result.clusters.length} cụm từ {result.total} từ khóa
              </h2>
              <p className="note">
                {note || 'Mỗi cụm nên tương ứng với một trang. Đừng viết nhiều bài cho cùng một cụm.'}
                {parsed.duplicates > 0 && ` Đã loại ${parsed.duplicates} từ khóa trùng.`}
              </p>
            </div>
            <div className="headerActions">
              <button className="secondaryButton" type="button" onClick={() => exportClusters(result.clusters)}>
                Xuất CSV
              </button>
            </div>
          </div>

          <div className="tabRow">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`tabBtn${tab === item.key ? ' isActive' : ''}`}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'clusters' && (
            <div className="clusterGrid">
              {result.clusters.map((cluster, index) => (
                <article className="clusterCard" key={cluster.name}>
                  <header>
                    <h3>{cluster.name}</h3>
                    <span className="clusterCount">{cluster.keywords.length} từ khóa</span>
                  </header>
                  <div className="tagRow">
                    <span className={`intentTag intent-${cluster.intent}`}>{INTENT_LABELS[cluster.intent]}</span>
                    <span className="sourceTag">{CONTENT_TYPE_LABELS[cluster.contentType]}</span>
                    {cluster.questionCount > 0 && <span className="sourceTag">{cluster.questionCount} câu hỏi</span>}
                  </div>
                  <ul className="clusterKeywords">
                    {cluster.keywords.slice(0, 8).map((item) => (
                      <li key={item.keyword}>{item.keyword}</li>
                    ))}
                    {cluster.keywords.length > 8 && (
                      <li className="uniMore">…và {cluster.keywords.length - 8} từ khóa nữa</li>
                    )}
                  </ul>
                  <button
                    type="button"
                    className="secondaryButton"
                    onClick={() => {
                      setSelected(index);
                      setTab('brief');
                    }}
                  >
                    Tạo content brief →
                  </button>
                </article>
              ))}
            </div>
          )}

          {tab === 'universe' && universe && (
            <div className="universeWrap">
              <ul className="uniList">
                <UniverseBranch node={universe} depth={0} />
              </ul>
            </div>
          )}

          {tab === 'plan' && (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Vai trò</th>
                    <th>Tiêu đề đề xuất</th>
                    <th>Từ khóa chính</th>
                    <th>Loại trang</th>
                    <th>Ý định</th>
                    <th>Từ khóa</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.map((item) => (
                    <tr key={`${item.role}-${item.targetKeyword}`}>
                      <td>
                        <span className={`intentTag intent-${item.role === 'pillar' ? 'transactional' : 'informational'}`}>
                          {item.role === 'pillar' ? 'Pillar' : 'Cluster'}
                        </span>
                      </td>
                      <td>{item.title}</td>
                      <td className="keywordCell">{item.targetKeyword}</td>
                      <td>{CONTENT_TYPE_LABELS[item.contentType]}</td>
                      <td>{INTENT_LABELS[item.intent]}</td>
                      <td>{item.keywordCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'brief' && brief && (
            <div className="briefWrap">
              <div className="filters">
                <select
                  value={selected}
                  onChange={(event) => setSelected(Number(event.target.value))}
                  aria-label="Chọn cụm để tạo brief"
                >
                  {result.clusters.map((cluster, index) => (
                    <option value={index} key={cluster.name}>
                      {cluster.name} ({cluster.keywords.length})
                    </option>
                  ))}
                </select>
                <button type="button" className="secondaryButton" onClick={exportBriefMarkdown}>
                  Tải brief (.md)
                </button>
                <button type="button" className="secondaryButton" onClick={copyFaqSchema}>
                  {copiedSchema ? '✓ Đã chép schema' : 'Chép FAQ schema'}
                </button>
              </div>

              <div className="briefGrid">
                <article className="briefCard">
                  <h3>Thẻ meta</h3>
                  <p><strong>Title:</strong> {brief.title}</p>
                  <p><strong>Meta description:</strong> {brief.metaDescription}</p>
                  <p><strong>H1:</strong> {brief.h1}</p>
                  <p>
                    <strong>Loại trang:</strong> {CONTENT_TYPE_LABELS[brief.contentType]} ·{' '}
                    <strong>Intent:</strong> {INTENT_LABELS[brief.intent]} · <strong>Độ dài:</strong>{' '}
                    {brief.wordCountTarget[0]}–{brief.wordCountTarget[1]} từ
                  </p>
                </article>

                <article className="briefCard">
                  <h3>Dàn ý</h3>
                  <ul className="outlineList">
                    {brief.outline.map((item, index) => (
                      <li key={`${item.heading}-${index}`} data-level={item.level}>
                        <span className="hTag">H{item.level}</span> {item.heading}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="briefCard">
                  <h3>Từ khóa phụ</h3>
                  <ul className="clusterKeywords">
                    {brief.secondaryKeywords.map((keyword) => (
                      <li key={keyword}>{keyword}</li>
                    ))}
                    {brief.secondaryKeywords.length === 0 && <li>Chưa có — cụm này chỉ có một từ khóa.</li>}
                  </ul>
                </article>

                <article className="briefCard">
                  <h3>Câu hỏi cần trả lời</h3>
                  <ul className="clusterKeywords">
                    {brief.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </article>

                <article className="briefCard">
                  <h3>Entity nên nhắc tới</h3>
                  <div className="tagRow">
                    {brief.entities.length > 0 ? (
                      brief.entities.map((entity) => (
                        <span className="sourceTag" key={entity}>
                          {entity}
                        </span>
                      ))
                    ) : (
                      <span className="note">Chưa phát hiện thương hiệu/thực thể riêng trong cụm.</span>
                    )}
                  </div>
                </article>

                <article className="briefCard">
                  <h3>Internal link gợi ý</h3>
                  <ul className="clusterKeywords">
                    {brief.internalLinks.map((link) => (
                      <li key={link}>{link}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          )}
          {tab === 'links' && (
            <div className="briefWrap">
              <label className="fieldLabel" htmlFor="site-pages">
                Dán danh sách trang đã có trên website — mỗi dòng một trang, dạng
                {' '}<code>url | tiêu đề</code>
              </label>
              <textarea
                id="site-pages"
                className="bulkInput"
                rows={7}
                value={sitePagesRaw}
                onChange={(event) => setSitePagesRaw(event.target.value)}
                placeholder={'/may-loc-nuoc-gia-dinh | Máy lọc nước gia đình loại nào tốt\n/may-loc-nuoc-karofi | Đánh giá máy lọc nước Karofi'}
              />

              {sitePagesRaw.trim() === '' ? (
                <p className="note">
                  Bạn có thể lấy danh sách này từ sitemap.xml hoặc export Search Console.
                  Công cụ so khớp tiêu đề trang với từng cụm để gợi ý nên đặt link ở đâu.
                </p>
              ) : linkSuggestions.length === 0 ? (
                <div className="emptyState">
                  <strong>Chưa tìm được liên kết phù hợp</strong>
                  Tiêu đề các trang bạn dán chưa đủ gần với cụm từ khóa nào.
                </div>
              ) : (
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Cụm (trang sẽ viết)</th>
                        <th>Nên link tới trang có sẵn</th>
                        <th>Anchor text đề xuất</th>
                        <th>Độ liên quan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkSuggestions.flatMap((item) =>
                        item.matches.map((match) => (
                          <tr key={`${item.cluster}-${match.page.url}`}>
                            <td className="keywordCell">{item.cluster}</td>
                            <td>
                              <strong>{match.page.title}</strong>
                              <br />
                              <span className="note">{match.page.url}</span>
                            </td>
                            <td>{match.anchor}</td>
                            <td>
                              <div className="scoreWrap">
                                <div className="scoreBar">
                                  <span style={{ width: `${match.score}%` }} />
                                </div>
                                <span className="scoreNum">{match.score}</span>
                              </div>
                            </td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

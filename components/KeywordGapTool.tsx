'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CONTENT_TYPE_LABELS, compareKeywordSets, parseKeywordList } from '../lib/seo-engine';
import type { SearchIntent } from '../lib/keyword-types';

const INTENT_LABELS: Record<SearchIntent, string> = {
  informational: 'Thông tin',
  commercial: 'Thương mại',
  transactional: 'Giao dịch',
  navigational: 'Điều hướng',
  local: 'Địa phương',
};

type IntentFilter = 'all' | 'money' | SearchIntent;

function csvEscape(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function KeywordGapTool() {
  const [mineRaw, setMineRaw] = useState('');
  const [rivalA, setRivalA] = useState('');
  const [rivalB, setRivalB] = useState('');
  const [submitted, setSubmitted] = useState<{ mine: string; a: string; b: string } | null>(null);
  const [filter, setFilter] = useState<IntentFilter>('all');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    if (!submitted) return null;
    const mine = parseKeywordList(submitted.mine).keywords;
    const lists = [submitted.a, submitted.b]
      .map((value) => parseKeywordList(value).keywords)
      .filter((list) => list.length > 0);
    if (lists.length === 0) return null;
    return compareKeywordSets(mine, lists);
  }, [submitted]);

  const missing = useMemo(() => {
    if (!result) return [];
    if (filter === 'all') return result.missing;
    if (filter === 'money') {
      return result.missing.filter(
        (item) => item.intent === 'transactional' || item.intent === 'commercial',
      );
    }
    return result.missing.filter((item) => item.intent === filter);
  }, [result, filter]);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const rivals = parseKeywordList(`${rivalA}\n${rivalB}`).keywords;
    if (rivals.length === 0) {
      setError('Hãy dán ít nhất một danh sách từ khóa của đối thủ.');
      return;
    }
    setError('');
    setSubmitted({ mine: mineRaw, a: rivalA, b: rivalB });
  }

  function exportCsv(): void {
    if (!result) return;
    const rows = [
      ['Từ khóa thiếu', 'Ý định', 'Loại trang nên tạo', 'Số đối thủ có', 'Dạng câu hỏi'],
      ...missing.map((item) => [
        item.keyword,
        INTENT_LABELS[item.intent],
        CONTENT_TYPE_LABELS[item.contentType],
        item.competitors,
        item.isQuestion ? 'Có' : '',
      ]),
    ];
    const csv = '﻿' + rows.map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keyword-gap-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const moneyCount = result
    ? result.missing.filter(
        (item) => item.intent === 'transactional' || item.intent === 'commercial',
      ).length
    : 0;

  return (
    <section className="container toolSection">
      <div className="toolPanel">
        <form onSubmit={submit}>
          <div className="toolPanelHead">
            <span className="fieldLabel">Dán từ khóa của bạn và của đối thủ</span>
            <span className="toolHint">So sánh ngay trong trình duyệt · không gửi đi đâu</span>
          </div>

          <div className="gapGrid">
            <label className="gapField">
              <span>Website của bạn</span>
              <textarea
                className="bulkInput"
                rows={8}
                value={mineRaw}
                onChange={(event) => setMineRaw(event.target.value)}
                placeholder={'máy lọc nước gia đình\nmáy lọc nước là gì\n…'}
              />
            </label>
            <label className="gapField">
              <span>Đối thủ 1</span>
              <textarea
                className="bulkInput"
                rows={8}
                value={rivalA}
                onChange={(event) => setRivalA(event.target.value)}
                placeholder={'máy lọc nước karofi\nmua máy lọc nước trả góp\n…'}
              />
            </label>
            <label className="gapField">
              <span>Đối thủ 2 (không bắt buộc)</span>
              <textarea
                className="bulkInput"
                rows={8}
                value={rivalB}
                onChange={(event) => setRivalB(event.target.value)}
                placeholder={'máy lọc nước ao smith\n…'}
              />
            </label>
          </div>

          <div className="quickSeeds">
            <button type="submit" className="primaryBtn">
              So sánh
            </button>
          </div>

          {error && <p className="errorText">{error}</p>}
        </form>
      </div>

      {result && (
        <div className="resultsPanel">
          <div className="resultsHeader">
            <div>
              <p className="eyebrow">KẾT QUẢ</p>
              <h2>{result.missing.length} từ khóa đối thủ có mà bạn chưa có</h2>
              <p className="note">
                So sánh dựa trên đúng danh sách bạn cung cấp — không có volume hay thứ hạng thật.
                Danh sách càng sát thực tế (export Search Console, Ahrefs…) thì kết quả càng đáng tin.
              </p>
            </div>
            <div className="headerActions">
              <button className="secondaryButton" type="button" onClick={exportCsv} disabled={missing.length === 0}>
                Xuất CSV
              </button>
            </div>
          </div>

          <div className="statStrip">
            <div className="statCard">
              <div className="statVal">{result.competitorTotal}</div>
              <div className="statLbl">Từ khóa đối thủ đang có</div>
            </div>
            <div className="statCard">
              <div className="statVal">{result.missing.length}</div>
              <div className="statLbl">Bạn chưa có</div>
            </div>
            <div className="statCard">
              <div className="statVal">{moneyCount}</div>
              <div className="statLbl">Có ý định mua hàng</div>
            </div>
            <div className="statCard">
              <div className="statVal">{result.shared.length}</div>
              <div className="statLbl">Cả hai cùng có</div>
            </div>
          </div>

          <div className="filters">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as IntentFilter)}
              aria-label="Lọc theo ý định"
            >
              <option value="all">Mọi ý định</option>
              <option value="money">Ưu tiên: thương mại + giao dịch</option>
              {(Object.keys(INTENT_LABELS) as SearchIntent[]).map((intent) => (
                <option value={intent} key={intent}>
                  {INTENT_LABELS[intent]}
                </option>
              ))}
            </select>
          </div>

          {missing.length === 0 ? (
            <div className="emptyState">
              <strong>Không có từ khóa nào khớp bộ lọc</strong>
              Thử chọn ý định khác, hoặc bạn đã phủ hết từ khóa của đối thủ.
            </div>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Từ khóa còn thiếu</th>
                    <th>Ý định</th>
                    <th>Loại trang nên tạo</th>
                    <th>Số đối thủ có</th>
                  </tr>
                </thead>
                <tbody>
                  {missing.slice(0, 500).map((item) => (
                    <tr key={item.keyword}>
                      <td className="keywordCell">{item.keyword}</td>
                      <td>
                        <span className={`intentTag intent-${item.intent}`}>
                          {INTENT_LABELS[item.intent]}
                        </span>
                      </td>
                      <td>{CONTENT_TYPE_LABELS[item.contentType]}</td>
                      <td>{item.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="resultsFooter">
            <p className="resultsCount">
              Hiển thị {Math.min(missing.length, 500)}/{result.missing.length} từ khóa còn thiếu.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

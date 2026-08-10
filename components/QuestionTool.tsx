'use client';

import { FormEvent, useMemo, useState } from 'react';
import { generateQuestions, groupQuestions, isQuestionKeyword } from '../lib/seo-engine';

const QUICK_SEEDS = ['trồng cây', 'máy lọc nước', 'học tiếng anh', 'du lịch đà nẵng'];

function download(name: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function QuestionTool() {
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const groups = useMemo(() => groupQuestions(questions), [questions]);

  async function run(rawSeed: string): Promise<void> {
    const value = rawSeed.trim();
    if (value.length < 2) {
      setError('Hãy nhập từ khóa dài ít nhất 2 ký tự.');
      return;
    }
    setError('');
    setLoading(true);
    setSeed(value);

    const fallback = generateQuestions(value);

    try {
      const response = await fetch('/api/keywords/expand', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seed: value, mode: 'questions', language: 'vi' }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { keywords?: string[]; note?: string }
        | null;

      const live = Array.isArray(payload?.keywords) ? payload!.keywords : [];
      const merged = [...new Set([...live.filter(isQuestionKeyword), ...fallback])];

      setQuestions(merged);
      setCurrent(value);
      setNote(
        live.length > 0
          ? payload?.note || ''
          : 'Autocomplete chưa phản hồi — đang hiển thị bộ câu hỏi mẫu tiếng Việt.',
      );
    } catch {
      setQuestions(fallback);
      setCurrent(value);
      setNote('Không gọi được máy chủ gợi ý — đang hiển thị bộ câu hỏi mẫu tiếng Việt.');
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void run(seed);
  }

  async function copyAll(): Promise<void> {
    try {
      await navigator.clipboard.writeText(questions.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <section className="container toolSection">
      <div className="toolPanel">
        <form onSubmit={submit}>
          <div className="toolPanelHead">
            <label className="fieldLabel" htmlFor="question-seed">
              Nhập chủ đề để tìm câu hỏi
            </label>
            <span className="toolHint">Miễn phí · không đăng nhập</span>
          </div>

          <div className="searchRow">
            <input
              id="question-seed"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="Ví dụ: trồng cây, máy lọc nước…"
              maxLength={120}
              autoComplete="off"
            />
            <button type="submit" className="primaryBtn" disabled={loading}>
              {loading ? 'Đang tìm…' : 'Tìm câu hỏi'}
            </button>
          </div>

          <div className="quickSeeds">
            <span className="qLabel">Thử nhanh:</span>
            {QUICK_SEEDS.map((item) => (
              <button type="button" key={item} className="chip" onClick={() => void run(item)} disabled={loading}>
                {item}
              </button>
            ))}
          </div>

          {error && <p className="errorText">{error}</p>}
        </form>
      </div>

      {questions.length > 0 && (
        <div className="resultsPanel">
          <div className="resultsHeader">
            <div>
              <p className="eyebrow">KẾT QUẢ</p>
              <h2>
                {questions.length} câu hỏi cho “{current}”
              </h2>
              <p className="note">
                {note} Mỗi nhóm câu hỏi có thể trở thành một mục H2/H3 hoặc một phần FAQ có schema.
              </p>
            </div>
            <div className="headerActions">
              <button className="secondaryButton" type="button" onClick={copyAll}>
                {copied ? '✓ Đã chép' : 'Chép tất cả'}
              </button>
              <button
                className="secondaryButton"
                type="button"
                onClick={() =>
                  download(
                    `cau-hoi-${current.replace(/\s+/g, '-')}.txt`,
                    questions.join('\n'),
                    'text/plain;charset=utf-8',
                  )
                }
              >
                Tải .txt
              </button>
            </div>
          </div>

          <div className="clusterGrid">
            {groups.map((group) => (
              <article className="clusterCard" key={group.label}>
                <header>
                  <h3>{group.label}</h3>
                  <span className="clusterCount">{group.items.length}</span>
                </header>
                <ul className="clusterKeywords">
                  {group.items.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

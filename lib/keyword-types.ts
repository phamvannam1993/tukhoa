export type KeywordSource = 'google' | 'youtube' | 'tiktok' | 'shopee';

export type SearchIntent =
  | 'informational'
  | 'commercial'
  | 'transactional'
  | 'navigational'
  | 'local';

export type SourceMode = 'live_autocomplete' | 'heuristic';

export interface KeywordItem {
  keyword: string;
  sources: KeywordSource[];
  sourceModes: SourceMode[];
  intent: SearchIntent;
  cluster: string;
  opportunityScore: number;
}

export interface ResearchResponse {
  seed: string;
  total: number;
  note: string;
  items: KeywordItem[];
}

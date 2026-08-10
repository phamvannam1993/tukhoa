export type KeywordSource = 'google' | 'youtube' | 'tiktok' | 'shopee';

export type SearchIntent =
  | 'informational'
  | 'commercial'
  | 'transactional'
  | 'navigational'
  | 'local';

export type SourceMode = 'live_autocomplete' | 'heuristic';

/** Loại trang nên tạo cho một từ khóa / cụm từ khóa. */
export type ContentType =
  | 'article'
  | 'review'
  | 'category'
  | 'product'
  | 'landing'
  | 'faq';

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

/** Một từ khóa trong luồng gom nhóm hàng loạt (không cần dữ liệu nguồn). */
export interface ClusteredKeyword {
  keyword: string;
  intent: SearchIntent;
  contentType: ContentType;
  isQuestion: boolean;
  words: number;
}

export interface KeywordCluster {
  /** Tên cụm — lấy từ khóa ngắn nhất (head term) trong cụm. */
  name: string;
  /** Ý định chiếm đa số trong cụm. */
  intent: SearchIntent;
  contentType: ContentType;
  keywords: ClusteredKeyword[];
  /** Số từ khóa dạng câu hỏi trong cụm. */
  questionCount: number;
  /** Điểm ưu tiên tương đối, dùng để xếp thứ tự triển khai. */
  priority: number;
}

export interface ClusterResult {
  total: number;
  duplicates: number;
  clusters: KeywordCluster[];
}

export interface UniverseNode {
  label: string;
  count: number;
  keywords: string[];
  children: UniverseNode[];
}

export interface ContentPlanItem {
  role: 'pillar' | 'cluster';
  title: string;
  targetKeyword: string;
  contentType: ContentType;
  intent: SearchIntent;
  keywordCount: number;
  supportingKeywords: string[];
  internalLinks: string[];
}

export interface ContentBrief {
  targetKeyword: string;
  intent: SearchIntent;
  contentType: ContentType;
  title: string;
  metaDescription: string;
  h1: string;
  outline: Array<{ heading: string; level: 2 | 3 }>;
  secondaryKeywords: string[];
  questions: string[];
  entities: string[];
  internalLinks: string[];
  wordCountTarget: [number, number];
}

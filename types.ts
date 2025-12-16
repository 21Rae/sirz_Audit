export interface AuditMetric {
  name: string;
  score: number; // 0-100
  status: 'good' | 'average' | 'poor';
  description: string;
}

export interface Recommendation {
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  issue: string;
  fix: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AuditResult {
  url: string;
  overallScore: number;
  summary: string;
  metrics: {
    seo: AuditMetric;
    ux: AuditMetric;
    performance: AuditMetric;
    content: AuditMetric;
  };
  recommendations: Recommendation[];
  strengths: string[];
  competitors: string[];
  sources?: GroundingSource[];
}

export enum AuditStatus {
  IDLE,
  ANALYZING,
  COMPLETE,
  ERROR
}
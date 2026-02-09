export interface Metric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface PlatformAnalysis {
  name: string;
  status: 'Strong' | 'Average' | 'Weak' | 'Missing';
  followerCount?: string;
  engagementLevel?: string;
  contentStrategy: string;
  auditSnippet: string; // New field for short analysis
  lastActivityDate?: string; // e.g., "2 days ago", "Oct 2023"
  url?: string;
}

export interface PitchFramework {
  subjectLine: string;
  hook: string;
  problem: string;
  solution: string;
  cta: string;
}

export interface StrategySection {
  title: string;
  content: string;
}

export interface AnalysisResult {
  organizationName: string;
  summary: string;
  metrics: Metric[];
  platforms: PlatformAnalysis[];
  weaknesses: string[];
  strengths: string[];
  opportunities: string[];
  strategy: {
    relationshipBuilding: string;
    emailFramework: PitchFramework;
    improvementIdeas: string[];
  };
  sources: Array<{ title: string; uri: string }>;
  estimatedImpactScore: number; // 0-100
}

export enum AnalysisState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
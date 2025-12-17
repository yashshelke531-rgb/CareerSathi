
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  MENTOR = 'MENTOR',
  EXPLORER = 'EXPLORER',
  EXAMS = 'EXAMS',
  MAPS = 'MAPS',
  INTEREST_TEST = 'INTEREST_TEST',
  MIND_DISCOVERY = 'MIND_DISCOVERY',
  INDIA_HUB = 'INDIA_HUB',
  COMPARISON = 'COMPARISON'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  links?: Array<{title: string, uri: string}>;
  imageUrl?: string;
  metrics?: {
    growth: number;
    demand: number;
    salary: string;
    difficulty: number;
  };
}

export interface CareerComparisonData {
  careerA: string;
  careerB: string;
  salaryA: string;
  salaryB: string;
  difficultyA: number;
  difficultyB: number;
  studyTimeA: string;
  studyTimeB: string;
  summary: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
  timestamp: number;
}

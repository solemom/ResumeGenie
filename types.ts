
export interface ResumeSection {
  title: string;
  original: string;
  optimized: string;
  changes: string[];
}

export interface OptimizationResult {
  id: string;
  date: string;
  initialScore: number;
  optimizedScore: number;
  analysis: string;
  sections: ResumeSection[];
  suggestedKeywords: string[];
  fullOptimizedResume: string;
}

export interface FileData {
  name: string;
  content: string;
  type: 'pdf' | 'docx' | 'text';
}

export type PlanType = 'Free' | 'Basic' | 'Advanced';

export interface User {
  email: string;
  plan: PlanType;
  revisionsUsed: number;
  revisionsTotal: number;
  history: OptimizationResult[];
  paymentMethod?: {
    type: string;
    last4: string;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  OPTIMIZING = 'OPTIMIZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}


export interface AnalysisResult {
  verdict: 'Real' | 'AI-Generated' | 'Inconclusive';
  confidence: number;
  reasoning: string[];
  technicalAnalysis: string;
  metadata?: {
    artifactsDetected: string[];
    lightingConsistency: string;
    textureQuality: string;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  result: AnalysisResult;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

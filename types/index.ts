
export interface YouTubeVideo {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  progress: number;
}

export interface Highlight {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: 'funny' | 'emotional' | 'motivational' | 'quote' | 'visual' | 'action';
  confidence: number;
  summary: string;
  keywords: string[];
}

export interface AnalysisResult {
  highlights: Highlight[];
  summary: string;
  keywords: string[];
  hashtags: string[];
}

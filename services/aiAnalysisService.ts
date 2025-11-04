
import axios from 'axios';

export interface HighlightSegment {
  startTime: number;
  endTime: number;
  type: 'funny' | 'emotional' | 'motivational' | 'quote' | 'visual' | 'action';
  confidence: number;
  summary: string;
  keywords: string[];
}

export interface AnalysisResult {
  highlights: HighlightSegment[];
  summary: string;
  keywords: string[];
  hashtags: string[];
}

class AIAnalysisService {
  private apiKey: string = '';
  private apiBase: string = 'https://api.openai.com/v1';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async analyzeVideoContent(
    title: string,
    description: string,
    duration: number,
    transcript?: string
  ): Promise<AnalysisResult | null> {
    try {
      if (!this.apiKey) {
        console.log('OpenAI API key not configured. Using fallback analysis.');
        return this.generateFallbackAnalysis(title, description, duration);
      }

      const prompt = this.buildAnalysisPrompt(title, description, duration, transcript);

      const response = await axios.post(
        `${this.apiBase}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert video content analyzer. Analyze videos and identify the most engaging moments.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      return this.parseAnalysisResponse(content, duration);
    } catch (error) {
      console.log('Error analyzing video with AI:', error);
      return this.generateFallbackAnalysis(title, description, duration);
    }
  }

  private buildAnalysisPrompt(
    title: string,
    description: string,
    duration: number,
    transcript?: string
  ): string {
    return `Analyze this YouTube video and identify the most engaging moments:

Title: ${title}
Duration: ${duration} seconds
Description: ${description}
${transcript ? `Transcript: ${transcript}` : ''}

Please identify 3-5 highlight segments in JSON format with this structure:
{
  "highlights": [
    {
      "startTime": 0,
      "endTime": 30,
      "type": "funny|emotional|motivational|quote|visual|action",
      "confidence": 0.95,
      "summary": "Brief description of the highlight",
      "keywords": ["keyword1", "keyword2"]
    }
  ],
  "summary": "Overall video summary",
  "keywords": ["main", "keywords"],
  "hashtags": ["#hashtag1", "#hashtag2"]
}

Focus on moments that would work well as short clips (15-90 seconds).`;
  }

  private parseAnalysisResponse(content: string, duration: number): AnalysisResult {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.generateFallbackAnalysis('', '', duration);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and sanitize the response
      const highlights = (parsed.highlights || []).map((h: any) => ({
        startTime: Math.max(0, Math.min(h.startTime || 0, duration - 15)),
        endTime: Math.max(15, Math.min(h.endTime || 30, duration)),
        type: h.type || 'visual',
        confidence: Math.min(1, Math.max(0, h.confidence || 0.8)),
        summary: h.summary || 'Engaging moment',
        keywords: Array.isArray(h.keywords) ? h.keywords.slice(0, 5) : [],
      }));

      return {
        highlights,
        summary: parsed.summary || 'Video analysis complete',
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 10) : [],
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.slice(0, 5) : [],
      };
    } catch (error) {
      console.log('Error parsing AI response:', error);
      return this.generateFallbackAnalysis('', '', duration);
    }
  }

  private generateFallbackAnalysis(
    title: string,
    description: string,
    duration: number
  ): AnalysisResult {
    const highlights: HighlightSegment[] = [];
    const segmentCount = Math.min(5, Math.ceil(duration / 300));

    for (let i = 0; i < segmentCount; i++) {
      const startTime = Math.floor((duration / segmentCount) * i);
      const endTime = Math.min(startTime + 45, duration);

      highlights.push({
        startTime,
        endTime,
        type: ['funny', 'emotional', 'motivational', 'quote', 'visual'][i % 5] as any,
        confidence: 0.7 + Math.random() * 0.25,
        summary: `Highlight segment ${i + 1}`,
        keywords: ['highlight', 'moment', 'engaging'],
      });
    }

    return {
      highlights,
      summary: title || 'Video analysis complete',
      keywords: ['video', 'highlight', 'moment'],
      hashtags: ['#highlight', '#viral', '#shorts'],
    };
  }
}

export default new AIAnalysisService();

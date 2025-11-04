
import axios from 'axios';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideoMetadata {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  channelTitle: string;
  publishedAt: string;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

class YouTubeService {
  private apiKey: string = '';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async getVideoMetadata(videoId: string): Promise<YouTubeVideoMetadata | null> {
    try {
      if (!this.apiKey) {
        console.log('YouTube API key not configured. Please set your API key in settings.');
        return null;
      }

      const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
          key: this.apiKey,
        },
      });

      if (!response.data.items || response.data.items.length === 0) {
        console.log('Video not found');
        return null;
      }

      const item = response.data.items[0];
      const duration = this.parseDuration(item.contentDetails.duration);

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      };
    } catch (error) {
      console.log('Error fetching video metadata:', error);
      return null;
    }
  }

  async getVideoTranscript(videoId: string): Promise<string | null> {
    try {
      // Note: YouTube API doesn't directly provide transcripts
      // This would require using a third-party service or youtube-transcript-api
      // For now, we'll return a placeholder that indicates transcript fetching
      console.log('Transcript fetching requires additional setup');
      return null;
    } catch (error) {
      console.log('Error fetching transcript:', error);
      return null;
    }
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let seconds = 0;

    if (match[1]) seconds += parseInt(match[1]) * 3600;
    if (match[2]) seconds += parseInt(match[2]) * 60;
    if (match[3]) seconds += parseInt(match[3]);

    return seconds;
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
}

export default new YouTubeService();

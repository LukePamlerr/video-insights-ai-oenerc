
import * as SecureStore from 'expo-secure-store';

class ConfigService {
  private youtubeApiKey: string = '';
  private openaiApiKey: string = '';

  async loadConfig(): Promise<void> {
    try {
      const youtubeKey = await SecureStore.getItemAsync('youtube_api_key');
      const openaiKey = await SecureStore.getItemAsync('openai_api_key');

      if (youtubeKey) this.youtubeApiKey = youtubeKey;
      if (openaiKey) this.openaiApiKey = openaiKey;
    } catch (error) {
      console.log('Error loading config:', error);
    }
  }

  async saveYouTubeApiKey(key: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('youtube_api_key', key);
      this.youtubeApiKey = key;
    } catch (error) {
      console.log('Error saving YouTube API key:', error);
    }
  }

  async saveOpenAIApiKey(key: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('openai_api_key', key);
      this.openaiApiKey = key;
    } catch (error) {
      console.log('Error saving OpenAI API key:', error);
    }
  }

  getYouTubeApiKey(): string {
    return this.youtubeApiKey;
  }

  getOpenAIApiKey(): string {
    return this.openaiApiKey;
  }

  hasYouTubeApiKey(): boolean {
    return this.youtubeApiKey.length > 0;
  }

  hasOpenAIApiKey(): boolean {
    return this.openaiApiKey.length > 0;
  }
}

export default new ConfigService();

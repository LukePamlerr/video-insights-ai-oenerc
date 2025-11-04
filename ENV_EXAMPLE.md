
# Environment Configuration Example

This file shows how to configure the app with API keys.

## Configuration Methods

### Method 1: In-App Settings (Recommended)

1. Open the app
2. Go to Settings tab
3. Paste your API keys
4. Click Save

Your keys are stored securely on your device.

### Method 2: Environment Variables (Development)

If you're developing the app, you can set environment variables:

```bash
export YOUTUBE_API_KEY="your_youtube_api_key_here"
export OPENAI_API_KEY="your_openai_api_key_here"
```

Then in your code:

```typescript
import configService from '@/services/configService';

// Load from environment
const youtubeKey = process.env.YOUTUBE_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (youtubeKey) {
  await configService.saveYouTubeApiKey(youtubeKey);
}
if (openaiKey) {
  await configService.saveOpenAIApiKey(openaiKey);
}
```

## API Key Format

### YouTube API Key

- Format: Long alphanumeric string
- Example: `AIzaSyDxxx...`
- Length: ~40 characters
- Source: Google Cloud Console

### OpenAI API Key

- Format: `sk-` followed by alphanumeric characters
- Example: `sk-proj-xxx...`
- Length: ~50+ characters
- Source: OpenAI Platform

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use .gitignore** to exclude sensitive files
3. **Rotate keys regularly** for security
4. **Use environment variables** in development
5. **Store securely** using expo-secure-store in production

## Revoking Keys

If you accidentally expose an API key:

### YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to APIs & Services > Credentials
3. Find your API key
4. Click the delete icon
5. Create a new key

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Find your key in the list
3. Click the delete icon
4. Create a new key

## Testing Your Setup

### Test YouTube API

```typescript
import youtubeService from '@/services/youtubeService';

const videoId = 'dQw4w9WgXcQ'; // Example video
const metadata = await youtubeService.getVideoMetadata(videoId);
console.log(metadata);
```

### Test OpenAI API

```typescript
import aiAnalysisService from '@/services/aiAnalysisService';

const result = await aiAnalysisService.analyzeVideoContent(
  'Test Video',
  'Test description',
  600
);
console.log(result);
```

## Troubleshooting

### Keys Not Loading

1. Check that keys are saved in Settings
2. Verify app has permission to access secure storage
3. Try restarting the app

### API Calls Failing

1. Verify API keys are correct
2. Check that APIs are enabled in Google Cloud Console
3. Verify you have quota remaining
4. Check internet connection

### Secure Store Issues

On some devices, secure storage might not work:

1. Try clearing app cache
2. Restart the device
3. Reinstall the app
4. Check device storage space

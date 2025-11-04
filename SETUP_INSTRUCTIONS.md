
# YouTube Highlight Analyzer - Setup Guide

## Overview
This app uses real YouTube API and OpenAI API to analyze videos and extract engaging highlights.

## Prerequisites
1. Google Cloud Project with YouTube Data API v3 enabled
2. OpenAI API key (optional, but recommended for better AI analysis)

## Step 1: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## Step 2: Get OpenAI API Key (Optional)

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key

## Step 3: Configure in App

1. Open the app and go to Settings tab
2. Paste your YouTube API key in the "YouTube API" section
3. (Optional) Paste your OpenAI API key in the "OpenAI API" section
4. Your keys are stored securely on your device

## Step 4: Start Analyzing

1. Go to the Analyzer tab
2. Paste YouTube URLs (one per line)
3. Click "Start Analysis"
4. Wait for the AI to identify highlights
5. Download or share the clips

## Features

- **Real YouTube Integration**: Fetches actual video metadata
- **AI-Powered Analysis**: Uses OpenAI to identify engaging moments
- **Automatic Highlights**: Detects funny, emotional, motivational moments
- **Keyword Extraction**: Automatically extracts relevant keywords
- **Instant Download**: Share clips directly from the app

## Privacy

- Your API keys are stored securely on your device
- No data is sent to external servers except for API calls
- Analysis results are stored locally in your app

## Troubleshooting

### "API Key Required" Error
- Make sure you've configured your YouTube API key in Settings
- Check that your API key is valid and has YouTube Data API v3 enabled

### "Could not fetch video metadata"
- Verify the YouTube URL is correct
- Check that your YouTube API key has quota remaining
- Ensure the video is public and not restricted

### No highlights found
- Try a longer video (at least 5 minutes)
- Check that your OpenAI API key is configured for better results
- Some videos may not have identifiable highlights

## Support

For issues or questions, check the app's error logs or contact support.

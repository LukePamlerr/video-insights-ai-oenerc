
# Complete API Setup Guide

## Getting Started

This YouTube Highlight Analyzer requires two API keys to function with real data:

1. **YouTube Data API v3** - To fetch video metadata
2. **OpenAI API** (Optional) - For AI-powered highlight detection

## YouTube API Setup (Required)

### Step 1: Create a Google Cloud Project

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "YouTube Analyzer")
5. Click "CREATE"
6. Wait for the project to be created

### Step 2: Enable YouTube Data API v3

1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search for "YouTube Data API v3"
3. Click on it
4. Click the **ENABLE** button
5. Wait for it to enable

### Step 3: Create an API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **API Key**
4. A dialog will appear with your new API key
5. Click the copy icon to copy your key
6. Click **CLOSE**

### Step 4: Add API Key to App

1. Open the app
2. Go to the **Settings** tab
3. Paste your YouTube API key in the "YouTube API" section
4. Click **Save YouTube Key**
5. You should see a "API Key Configured" message

## OpenAI API Setup (Optional but Recommended)

### Step 1: Create OpenAI Account

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to **API keys** section

### Step 2: Create API Key

1. Click **+ Create new secret key**
2. Give it a name (e.g., "YouTube Analyzer")
3. Click **Create secret key**
4. Copy the key (you won't see it again!)

### Step 3: Add API Key to App

1. Open the app
2. Go to the **Settings** tab
3. Paste your OpenAI API key in the "OpenAI API" section
4. Click **Save OpenAI Key**
5. You should see a "API Key Configured" message

## Using the App

### Basic Workflow

1. **Go to Analyzer Tab**
   - This is the main screen

2. **Paste YouTube URLs**
   - Enter one or more YouTube URLs (one per line)
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

3. **Click Start Analysis**
   - The app will fetch video metadata
   - AI will analyze the content
   - Highlights will be extracted

4. **Review Highlights**
   - See all detected highlights
   - Each shows confidence score and keywords
   - View start/end times

5. **Download Clips**
   - Click the Download button on any highlight
   - Share or save the clip

## Troubleshooting

### "API Key Required" Error

**Problem**: The app says you need to configure an API key

**Solution**:
1. Go to Settings tab
2. Make sure you've pasted your YouTube API key
3. Click "Save YouTube Key"
4. Go back to Analyzer tab and try again

### "Could not fetch video metadata"

**Problem**: The app can't get video information

**Causes & Solutions**:
- **Invalid URL**: Make sure the YouTube URL is correct
- **Private Video**: The video might be private or restricted
- **API Quota**: You might have exceeded your daily quota
  - YouTube API has a default quota of 10,000 units per day
  - Each video fetch uses about 100 units
- **API Not Enabled**: Go back to Google Cloud Console and verify YouTube Data API v3 is enabled

### "No highlights found"

**Problem**: The app analyzes the video but finds no highlights

**Causes & Solutions**:
- **Short Video**: Try videos longer than 5 minutes
- **No OpenAI Key**: Configure OpenAI API for better results
- **Video Type**: Some videos (like music) may not have identifiable highlights

### API Key Not Saving

**Problem**: The app won't save your API key

**Solution**:
1. Make sure you copied the entire key
2. Check for extra spaces at the beginning or end
3. Try clearing the input and pasting again
4. Restart the app

## API Quotas & Limits

### YouTube API

- **Free Tier**: 10,000 units per day
- **Cost per video**: ~100 units
- **Meaning**: You can analyze ~100 videos per day for free

### OpenAI API

- **Pay as you go**: Charged per token used
- **Typical cost**: $0.001-0.01 per video analysis
- **Free trial**: $5 credit for new accounts

## Security Notes

- Your API keys are stored **securely** on your device
- Keys are **never** sent to external servers
- Only used for direct API calls to YouTube and OpenAI
- You can revoke keys anytime from their respective dashboards

## Advanced Tips

### Maximize YouTube API Quota

1. Analyze longer videos (more content = better highlights)
2. Batch analyze multiple videos at once
3. Monitor your quota usage in Google Cloud Console

### Better AI Results

1. Configure OpenAI API key
2. Use videos with clear dialogue or action
3. Avoid videos with background music only

### Cost Optimization

1. Use OpenAI's cheaper models if available
2. Analyze videos in batches
3. Monitor your OpenAI usage in the dashboard

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Verify your API keys are correct
3. Check that APIs are enabled in Google Cloud Console
4. Ensure you have quota remaining
5. Try restarting the app

## Next Steps

1. Set up your YouTube API key
2. (Optional) Set up your OpenAI API key
3. Go to the Analyzer tab
4. Paste a YouTube URL
5. Click "Start Analysis"
6. Enjoy your highlights!

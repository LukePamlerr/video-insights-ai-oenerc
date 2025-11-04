
import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import {
  ScrollView,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import youtubeService, { YouTubeVideoMetadata } from '@/services/youtubeService';
import aiAnalysisService, { AnalysisResult } from '@/services/aiAnalysisService';
import clipDownloadService from '@/services/clipDownloadService';
import configService from '@/services/configService';

interface YouTubeVideo extends YouTubeVideoMetadata {
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  progress: number;
  analysis?: AnalysisResult;
}

interface Highlight {
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

export default function HomeScreen() {
  const theme = useTheme();
  const [urlInput, setUrlInput] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [currentView, setCurrentView] = useState<'input' | 'dashboard' | 'highlights'>('input');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      await configService.loadConfig();
      const youtubeKey = configService.getYouTubeApiKey();
      const openaiKey = configService.getOpenAIApiKey();

      if (youtubeKey) {
        youtubeService.setApiKey(youtubeKey);
      }
      if (openaiKey) {
        aiAnalysisService.setApiKey(openaiKey);
      }

      setApiConfigured(youtubeKey.length > 0);
    } catch (error) {
      console.log('Error initializing services:', error);
    }
  };

  const handleAddUrls = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Error', 'Please enter at least one YouTube URL');
      return;
    }

    if (!apiConfigured) {
      Alert.alert(
        'API Key Required',
        'Please configure your YouTube API key in Settings to analyze real videos.'
      );
      return;
    }

    const urls = urlInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const newVideos: YouTubeVideo[] = [];

    for (const url of urls) {
      const videoId = youtubeService.extractVideoId(url);
      if (videoId) {
        const metadata = await youtubeService.getVideoMetadata(videoId);
        if (metadata) {
          newVideos.push({
            ...metadata,
            status: 'pending',
            progress: 0,
          });
        } else {
          Alert.alert('Error', `Could not fetch metadata for video: ${url}`);
        }
      } else {
        Alert.alert('Error', `Invalid YouTube URL: ${url}`);
      }
    }

    if (newVideos.length > 0) {
      setVideos(newVideos);
      setCurrentView('dashboard');
      setUrlInput('');
      startAnalysis(newVideos);
    }
  };

  const startAnalysis = async (videosToAnalyze: YouTubeVideo[]) => {
    setIsAnalyzing(true);
    const allHighlights: Highlight[] = [];

    for (let i = 0; i < videosToAnalyze.length; i++) {
      const video = videosToAnalyze[i];

      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id ? { ...v, status: 'analyzing' as const, progress: 10 } : v
        )
      );

      try {
        const analysis = await aiAnalysisService.analyzeVideoContent(
          video.title,
          video.description,
          video.duration
        );

        if (analysis) {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === video.id ? { ...v, analysis, progress: 80 } : v
            )
          );

          const videoHighlights = analysis.highlights.map((h, idx) => ({
            id: `${video.id}-${idx}`,
            videoId: video.id,
            startTime: h.startTime,
            endTime: h.endTime,
            duration: h.endTime - h.startTime,
            type: h.type,
            confidence: h.confidence,
            summary: h.summary,
            keywords: h.keywords,
          }));

          allHighlights.push(...videoHighlights);
        }

        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id ? { ...v, status: 'completed' as const, progress: 100 } : v
          )
        );
      } catch (error) {
        console.log('Error analyzing video:', error);
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id ? { ...v, status: 'error' as const } : v
          )
        );
      }
    }

    setHighlights(allHighlights);
    setIsAnalyzing(false);
    setCurrentView('highlights');
  };

  const handleDownloadClip = async (highlight: Highlight) => {
    const video = videos.find((v) => v.id === highlight.videoId);
    if (!video) return;

    try {
      const success = await clipDownloadService.downloadClip({
        videoId: highlight.videoId,
        startTime: highlight.startTime,
        endTime: highlight.endTime,
        title: video.title,
      });

      if (success) {
        Alert.alert('Success', 'Clip shared successfully');
      } else {
        Alert.alert('Info', 'Clip URL generated. You can download it from YouTube.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download clip');
    }
  };

  const renderInputView = () => (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.inputContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Find the Magic Moments
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Paste YouTube links to extract engaging highlights
        </Text>
      </View>

      {!apiConfigured && (
        <View style={[styles.warningBox, { backgroundColor: colors.accent }]}>
          <IconSymbol name="exclamationmark.triangle.fill" color={colors.text} size={20} />
          <View style={styles.warningContent}>
            <Text style={[styles.warningTitle, { color: colors.text }]}>
              API Key Required
            </Text>
            <Text style={[styles.warningText, { color: colors.text }]}>
              Configure your YouTube API key in Settings to analyze real videos
            </Text>
          </View>
        </View>
      )}

      <View style={styles.inputSection}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.secondary,
              color: colors.text,
              borderColor: colors.primary,
            },
          ]}
          placeholder="Paste YouTube URLs (one per line)"
          placeholderTextColor={colors.textSecondary}
          value={urlInput}
          onChangeText={setUrlInput}
          multiline
          numberOfLines={6}
          editable={apiConfigured}
        />
      </View>

      <Pressable
        style={[
          styles.analyzeButton,
          {
            backgroundColor: colors.primary,
            opacity: apiConfigured && urlInput.trim() ? 1 : 0.5,
          },
        ]}
        onPress={handleAddUrls}
        disabled={!apiConfigured || !urlInput.trim()}
      >
        <IconSymbol name="play.fill" color={colors.text} size={20} />
        <Text style={[styles.analyzeButtonText, { color: colors.text }]}>
          Start Analysis
        </Text>
      </Pressable>

      <View style={styles.featuresList}>
        <Text style={[styles.featuresTitle, { color: colors.text }]}>
          Features
        </Text>
        {[
          'Real YouTube API Integration',
          'AI-Powered Highlight Detection',
          'Automatic Keyword Extraction',
          'Instant Preview & Download',
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <IconSymbol name="checkmark.circle.fill" color={colors.success} size={20} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderDashboardView = () => (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.dashboardContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.dashboardHeader}>
        <Text style={[styles.dashboardTitle, { color: colors.text }]}>
          Analyzing Videos
        </Text>
        <Text style={[styles.dashboardSubtitle, { color: colors.textSecondary }]}>
          {videos.length} video{videos.length !== 1 ? 's' : ''} in queue
        </Text>
      </View>

      {videos.map((video) => (
        <View
          key={video.id}
          style={[
            styles.videoCard,
            { backgroundColor: colors.card, borderColor: colors.secondary },
          ]}
        >
          {video.thumbnail && (
            <Image
              source={{ uri: video.thumbnail }}
              style={styles.videoThumbnail}
            />
          )}

          <View style={styles.videoCardHeader}>
            <View style={styles.videoInfo}>
              <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={[styles.videoChannel, { color: colors.textSecondary }]}>
                {video.channelTitle}
              </Text>
              <Text style={[styles.videoDuration, { color: colors.textSecondary }]}>
                {Math.floor(video.duration / 60)} min
              </Text>
            </View>
            {video.status === 'analyzing' && (
              <ActivityIndicator color={colors.primary} size="small" />
            )}
            {video.status === 'completed' && (
              <IconSymbol name="checkmark.circle.fill" color={colors.success} size={24} />
            )}
            {video.status === 'error' && (
              <IconSymbol name="xmark.circle.fill" color={colors.accent} size={24} />
            )}
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${video.progress}%`,
                },
              ]}
            />
          </View>

          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {Math.round(video.progress)}%
          </Text>
        </View>
      ))}

      {isAnalyzing && (
        <View style={styles.analyzingFooter}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.analyzingText, { color: colors.text }]}>
            Processing highlights...
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderHighlightsView = () => (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.highlightsContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.highlightsHeader}>
        <Text style={[styles.highlightsTitle, { color: colors.text }]}>
          Highlights Found
        </Text>
        <Text style={[styles.highlightsSubtitle, { color: colors.textSecondary }]}>
          {highlights.length} clips ready to download
        </Text>
      </View>

      {highlights.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="film" color={colors.textSecondary} size={48} />
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            No highlights found
          </Text>
        </View>
      ) : (
        highlights.map((highlight) => {
          const video = videos.find((v) => v.id === highlight.videoId);
          return (
            <View
              key={highlight.id}
              style={[
                styles.highlightCard,
                { backgroundColor: colors.card, borderColor: colors.secondary },
              ]}
            >
              <View style={styles.highlightHeader}>
                <View style={styles.highlightType}>
                  <Text
                    style={[
                      styles.highlightTypeText,
                      {
                        backgroundColor: colors.accent,
                        color: colors.text,
                      },
                    ]}
                  >
                    {highlight.type.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.highlightConfidence, { color: colors.highlight }]}>
                  {Math.round(highlight.confidence * 100)}% match
                </Text>
              </View>

              <Text style={[styles.highlightSummary, { color: colors.text }]}>
                {highlight.summary}
              </Text>

              {highlight.keywords.length > 0 && (
                <View style={styles.keywordsContainer}>
                  {highlight.keywords.slice(0, 3).map((keyword, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.keyword,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text style={[styles.keywordText, { color: colors.primary }]}>
                        {keyword}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.highlightFooter}>
                <View>
                  <Text style={[styles.highlightDuration, { color: colors.textSecondary }]}>
                    {Math.round(highlight.duration)}s clip
                  </Text>
                  <Text style={[styles.highlightTime, { color: colors.textSecondary }]}>
                    {Math.floor(highlight.startTime / 60)}:{String(Math.floor(highlight.startTime % 60)).padStart(2, '0')} - {Math.floor(highlight.endTime / 60)}:{String(Math.floor(highlight.endTime % 60)).padStart(2, '0')}
                  </Text>
                </View>
                <Pressable
                  style={[styles.downloadButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleDownloadClip(highlight)}
                >
                  <IconSymbol name="arrow.down.circle.fill" color={colors.text} size={18} />
                  <Text style={[styles.downloadButtonText, { color: colors.text }]}>
                    Download
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}

      <Pressable
        style={[styles.newAnalysisButton, { backgroundColor: colors.secondary }]}
        onPress={() => {
          setCurrentView('input');
          setVideos([]);
          setHighlights([]);
        }}
      >
        <Text style={[styles.newAnalysisButtonText, { color: colors.primary }]}>
          Analyze More Videos
        </Text>
      </Pressable>
    </ScrollView>
  );

  const renderHeaderRight = () => (
    <Pressable style={styles.headerButtonContainer}>
      <IconSymbol name="gear" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Highlight Analyzer',
            headerRight: renderHeaderRight,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              color: colors.text,
            },
          }}
        />
      )}
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        {currentView === 'input' && renderInputView()}
        {currentView === 'dashboard' && renderDashboardView()}
        {currentView === 'highlights' && renderHighlightsView()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  inputContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'android' ? 120 : 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  warningBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontWeight: '500',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  featuresList: {
    marginTop: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dashboardContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'android' ? 120 : 24,
  },
  dashboardHeader: {
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  dashboardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  videoCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: colors.secondary,
  },
  videoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
  videoInfo: {
    flex: 1,
    marginRight: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  videoChannel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.secondary,
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  analyzingFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  analyzingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  highlightsContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'android' ? 120 : 24,
  },
  highlightsHeader: {
    marginBottom: 24,
  },
  highlightsTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  highlightsSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  highlightCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightType: {
    flex: 1,
  },
  highlightTypeText: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  highlightConfidence: {
    fontSize: 12,
    fontWeight: '700',
  },
  highlightSummary: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 12,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  keyword: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  keywordText: {
    fontSize: 11,
    fontWeight: '600',
  },
  highlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  highlightTime: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  newAnalysisButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  newAnalysisButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerButtonContainer: {
    padding: 8,
  },
});

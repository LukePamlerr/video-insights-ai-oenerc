import React, { useState } from "react";
import { Stack } from "expo-router";
import {
  ScrollView,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";

interface YouTubeVideo {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  status: "pending" | "analyzing" | "completed" | "error";
  progress: number;
}

interface Highlight {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: "funny" | "emotional" | "motivational" | "quote" | "visual";
  confidence: number;
  summary: string;
}

export default function HomeScreen() {
  const theme = useTheme();
  const [urlInput, setUrlInput] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [currentView, setCurrentView] = useState<"input" | "dashboard" | "highlights">("input");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const mockFetchVideoMetadata = (videoId: string): YouTubeVideo => {
    const mockTitles = [
      "Amazing AI Breakthrough",
      "Incredible Journey",
      "Life Changing Moment",
      "Epic Adventure",
      "Inspiring Story",
    ];
    const randomTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];

    return {
      id: videoId,
      url: `https://youtube.com/watch?v=${videoId}`,
      title: randomTitle,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: Math.floor(Math.random() * 3600) + 600,
      status: "pending",
      progress: 0,
    };
  };

  const mockAnalyzeVideo = async (
    video: YouTubeVideo,
    onProgress: (progress: number) => void
  ): Promise<Highlight[]> => {
    const highlightTypes: Array<"funny" | "emotional" | "motivational" | "quote" | "visual"> = [
      "funny",
      "emotional",
      "motivational",
      "quote",
      "visual",
    ];
    const mockHighlights: Highlight[] = [];

    for (let i = 0; i < 5; i++) {
      onProgress((i / 5) * 100);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const startTime = Math.floor(Math.random() * (video.duration - 90));
      mockHighlights.push({
        id: `${video.id}-${i}`,
        videoId: video.id,
        startTime,
        endTime: startTime + (Math.random() * 60 + 15),
        duration: Math.random() * 60 + 15,
        type: highlightTypes[Math.floor(Math.random() * highlightTypes.length)],
        confidence: Math.random() * 0.5 + 0.5,
        summary: `Highlight ${i + 1}: Amazing moment captured`,
      });
    }

    onProgress(100);
    return mockHighlights;
  };

  const handleAddUrls = async () => {
    if (!urlInput.trim()) {
      console.log("No URLs provided");
      return;
    }

    const urls = urlInput
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const newVideos: YouTubeVideo[] = [];

    for (const url of urls) {
      const videoId = extractVideoId(url);
      if (videoId) {
        newVideos.push(mockFetchVideoMetadata(videoId));
      }
    }

    if (newVideos.length > 0) {
      setVideos(newVideos);
      setCurrentView("dashboard");
      setUrlInput("");
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
          v.id === video.id ? { ...v, status: "analyzing" as const } : v
        )
      );

      const videoHighlights = await mockAnalyzeVideo(video, (progress) => {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id ? { ...v, progress } : v
          )
        );
      });

      allHighlights.push(...videoHighlights);

      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id ? { ...v, status: "completed" as const, progress: 100 } : v
        )
      );
    }

    setHighlights(allHighlights);
    setIsAnalyzing(false);
    setCurrentView("highlights");
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
        />
      </View>

      <Pressable
        style={[styles.analyzeButton, { backgroundColor: colors.primary }]}
        onPress={handleAddUrls}
        disabled={!urlInput.trim()}
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
          "AI Emotion Detection",
          "Automatic Highlight Extraction",
          "Keyword Insights",
          "Instant Preview & Download",
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
          {videos.length} video{videos.length !== 1 ? "s" : ""} in queue
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
          <View style={styles.videoCardHeader}>
            <View style={styles.videoInfo}>
              <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={[styles.videoId, { color: colors.textSecondary }]}>
                {video.id}
              </Text>
            </View>
            {video.status === "analyzing" && (
              <ActivityIndicator color={colors.primary} size="small" />
            )}
            {video.status === "completed" && (
              <IconSymbol name="checkmark.circle.fill" color={colors.success} size={24} />
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

      {highlights.map((highlight) => (
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

          <View style={styles.highlightFooter}>
            <Text style={[styles.highlightDuration, { color: colors.textSecondary }]}>
              {Math.round(highlight.duration)}s clip
            </Text>
            <Pressable
              style={[styles.downloadButton, { backgroundColor: colors.primary }]}
            >
              <IconSymbol name="arrow.down.circle.fill" color={colors.text} size={18} />
              <Text style={[styles.downloadButtonText, { color: colors.text }]}>
                Download
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable
        style={[styles.newAnalysisButton, { backgroundColor: colors.secondary }]}
        onPress={() => {
          setCurrentView("input");
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
      {Platform.OS === "ios" && (
        <Stack.Screen
          options={{
            title: "Highlight Analyzer",
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
        edges={["top"]}
      >
        {currentView === "input" && renderInputView()}
        {currentView === "dashboard" && renderDashboardView()}
        {currentView === "highlights" && renderHighlightsView()}
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
    paddingBottom: Platform.OS === "android" ? 120 : 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontWeight: "500",
    minHeight: 120,
    textAlignVertical: "top",
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  featuresList: {
    marginTop: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dashboardContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === "android" ? 120 : 24,
  },
  dashboardHeader: {
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  dashboardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  videoCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  videoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  videoInfo: {
    flex: 1,
    marginRight: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  videoId: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.secondary,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
  },
  analyzingFooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 12,
  },
  analyzingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  highlightsContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === "android" ? 120 : 24,
  },
  highlightsHeader: {
    marginBottom: 24,
  },
  highlightsTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  highlightsSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  highlightCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  highlightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  highlightType: {
    flex: 1,
  },
  highlightTypeText: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  highlightConfidence: {
    fontSize: 12,
    fontWeight: "700",
  },
  highlightSummary: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 12,
  },
  highlightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  highlightDuration: {
    fontSize: 12,
    fontWeight: "600",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  newAnalysisButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  newAnalysisButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerButtonContainer: {
    padding: 8,
  },
});

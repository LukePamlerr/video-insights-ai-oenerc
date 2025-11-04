
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import configService from '@/services/configService';
import youtubeService from '@/services/youtubeService';
import aiAnalysisService from '@/services/aiAnalysisService';

export default function SettingsScreen() {
  const theme = useTheme();
  const [youtubeKey, setYoutubeKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedYoutube, setSavedYoutube] = useState(false);
  const [savedOpenai, setSavedOpenai] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    await configService.loadConfig();
    setSavedYoutube(configService.hasYouTubeApiKey());
    setSavedOpenai(configService.hasOpenAIApiKey());
  };

  const handleSaveYouTubeKey = async () => {
    if (!youtubeKey.trim()) {
      Alert.alert('Error', 'Please enter a YouTube API key');
      return;
    }

    setLoading(true);
    try {
      await configService.saveYouTubeApiKey(youtubeKey);
      youtubeService.setApiKey(youtubeKey);
      setSavedYoutube(true);
      Alert.alert('Success', 'YouTube API key saved');
      setYoutubeKey('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save YouTube API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOpenAIKey = async () => {
    if (!openaiKey.trim()) {
      Alert.alert('Error', 'Please enter an OpenAI API key');
      return;
    }

    setLoading(true);
    try {
      await configService.saveOpenAIApiKey(openaiKey);
      aiAnalysisService.setApiKey(openaiKey);
      setSavedOpenai(true);
      Alert.alert('Success', 'OpenAI API key saved');
      setOpenaiKey('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save OpenAI API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Configure API keys for real data
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="play.circle.fill" color={colors.primary} size={24} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              YouTube API
            </Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Get your API key from{' '}
            <Text style={{ color: colors.primary }}>
              console.cloud.google.com
            </Text>
          </Text>

          {savedYoutube && (
            <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
              <IconSymbol name="checkmark.circle.fill" color={colors.text} size={16} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                API Key Configured
              </Text>
            </View>
          )}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.secondary,
                color: colors.text,
                borderColor: colors.primary,
              },
            ]}
            placeholder="Enter YouTube API Key"
            placeholderTextColor={colors.textSecondary}
            value={youtubeKey}
            onChangeText={setYoutubeKey}
            secureTextEntry
            editable={!loading}
          />

          <Pressable
            style={[
              styles.button,
              { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 },
            ]}
            onPress={handleSaveYouTubeKey}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <IconSymbol name="checkmark" color={colors.text} size={18} />
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Save YouTube Key
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="sparkles" color={colors.accent} size={24} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              OpenAI API
            </Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Get your API key from{' '}
            <Text style={{ color: colors.primary }}>
              platform.openai.com/api-keys
            </Text>
          </Text>

          {savedOpenai && (
            <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
              <IconSymbol name="checkmark.circle.fill" color={colors.text} size={16} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                API Key Configured
              </Text>
            </View>
          )}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.secondary,
                color: colors.text,
                borderColor: colors.primary,
              },
            ]}
            placeholder="Enter OpenAI API Key"
            placeholderTextColor={colors.textSecondary}
            value={openaiKey}
            onChangeText={setOpenaiKey}
            secureTextEntry
            editable={!loading}
          />

          <Pressable
            style={[
              styles.button,
              { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 },
            ]}
            onPress={handleSaveOpenAIKey}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <IconSymbol name="checkmark" color={colors.text} size={18} />
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Save OpenAI Key
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.infoSection}>
          <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
            <IconSymbol name="info.circle.fill" color={colors.highlight} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Why API Keys?
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                API keys enable real YouTube video data and AI-powered highlight detection. Your keys are stored securely on your device.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary,
    marginVertical: 24,
  },
  infoSection: {
    marginTop: 24,
  },
  infoBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});

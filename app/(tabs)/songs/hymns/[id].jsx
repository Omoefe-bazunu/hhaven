import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../../components/TopNavigation';
import { AudioPlayer } from '../../../../components/AudioPlayer';
import { mockHymns } from '../../../../data/mockData';

// Displays detailed view of a single hymn
export default function HymnDetailScreen() {
  const { id } = useLocalSearchParams(); // Get hymn ID from route params
  const { currentLanguage } = useLanguage(); // Access current language
  const { colors } = useTheme(); // Access theme colors

  // Find hymn by ID
  const hymn = mockHymns.find((h) => h.id === id);
  const content =
    hymn?.translations?.[currentLanguage] || hymn?.translations?.en || {};

  // Handle case where hymn is not found
  if (!hymn) {
    return (
      <SafeAreaWrapper>
        <Text style={[styles.error, { color: colors.error }]}>
          Hymn not found
        </Text>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {content.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {content.title}
        </Text>
        <AudioPlayer url={content.audioUrl} title={content.title} />
        <View
          style={[styles.lyricsContainer, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.lyricsTitle, { color: colors.text }]}>
            Lyrics
          </Text>
          <Text style={[styles.lyrics, { color: colors.textSecondary }]}>
            {content.content}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  lyricsContainer: {
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lyricsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lyrics: {
    fontSize: 16,
    lineHeight: 24,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

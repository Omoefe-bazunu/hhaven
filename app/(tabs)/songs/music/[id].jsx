import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../../components/TopNavigation';
import { AudioPlayer } from '../../../../components/AudioPlayer';
import { mockSongs } from '../../../../data/mockData';

// Displays detailed view of a single non-hymn song
export default function MusicDetailScreen() {
  const { id } = useLocalSearchParams(); // Get song ID from route params
  const { translations } = useLanguage(); // Access translations
  const { colors } = useTheme(); // Access theme colors

  // Find song by ID
  const song = mockSongs.find((s) => s.id === id);
  if (!song) {
    return (
      <SafeAreaWrapper>
        <Text style={[styles.error, { color: colors.error }]}>
          Song not found
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
          {song.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>{song.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {song.style}
        </Text>
        <AudioPlayer url={song.audioUrl} title={song.title} />
        <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            {translations.details}
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {translations.category}: {song.category}
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {translations.duration}: {song.duration}
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

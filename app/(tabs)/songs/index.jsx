import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Play, Clock } from 'lucide-react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../components/TopNavigation';
import { mockSongs, mockHymns } from '../../../data/mockData';
import { AudioPlayer } from '../../../components/AudioPlayer';
import { Book, Music } from 'lucide-react-native';

const CATEGORIES = [
  {
    id: 'native',
    label: 'Instrumental Native',
    description: 'Traditional tunes with instruments',
  },
  {
    id: 'acappella',
    label: 'A Cappella',
    description: 'Pure vocal harmony without instruments',
  },
  {
    id: 'english',
    label: 'Instrumental English',
    description: 'English songs with instrumental backing',
  },
];

// Defines the Songs screen with Hymns and Music tabs
export default function SongsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { translations, currentLanguage } = useLanguage();
  const { colors } = useTheme();

  const safeSearchQuery = (searchQuery || '').toString();

  // Filter hymns
  const filteredHymns = mockHymns.filter((hymn) => {
    const content =
      (hymn.translations && hymn.translations[currentLanguage]) ||
      hymn.translations?.en ||
      {};
    const title = content.title || '';
    const hymnContent = content.content || '';
    return (
      title.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
      hymnContent.toLowerCase().includes(safeSearchQuery.toLowerCase())
    );
  });

  // Filter non-hymn songs
  const filteredSongs = mockSongs.filter((song) => {
    const title = song.title || '';
    const style = song.style || '';
    return (
      title.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
      style.toLowerCase().includes(safeSearchQuery.toLowerCase())
    );
  });

  return (
    <SafeAreaWrapper>
      <TopNavigation title={translations.songs || 'Songs'} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs for Hymns and Music */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/songs/hymns')}
          >
            <Text style={[styles.tabText, { color: colors.text }]}>
              {translations.hymns || 'Hymns'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/songs/music')}
          >
            <Text style={[styles.tabText, { color: colors.text }]}>
              {translations.music || 'Music'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hymns Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translations.hymns || 'Hymns'}
          </Text>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {/* Theocratic Songs of Praise */}
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colors.card, width: '48%' },
              ]}
              onPress={() => router.push('/songs/hymns')}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text, marginBottom: 4 },
                ]}
              >
                Theocratic Songs of Praise (TSPs)
              </Text>
              <Text style={[styles.metaText, { color: colors.primary }]}>
                Explore
              </Text>
            </TouchableOpacity>

            {/* Psalms */}
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colors.card, width: '48%' },
              ]}
              onPress={() => router.push('/songs/hymns')}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text, marginBottom: 4 },
                ]}
              >
                Psalms
              </Text>
              <Text style={[styles.metaText, { color: colors.primary }]}>
                Explore
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Music section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {translations.music || 'Music'}
          </Text>

          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card }]}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/songs/music',
                    params: { category: item.id },
                  })
                }
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Text
                  style={[styles.cardContent, { color: colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {item.description}
                </Text>
                <Text style={[styles.metaText, { color: colors.primary }]}>
                  Explore
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  listContainer: {
    paddingVertical: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    flexGrow: 1,
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  songInfo: {
    flex: 1,
  },
  songMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  playButton: {
    borderRadius: 25,
    padding: 12,
  },
});

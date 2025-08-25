import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Play, Clock } from 'lucide-react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../components/TopNavigation';
import { Input } from '../../../components/ui/Input';
import { mockSongs, mockHymns } from '../../../data/mockData';
import { AudioPlayer } from '../../../components/AudioPlayer';

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

  // Render hymn card
  const renderHymnItem = ({ item }) => {
    const content =
      (item.translations && item.translations[currentLanguage]) ||
      item.translations?.en ||
      {};
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/(tabs)/songs/hymns/${item.id}`)}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {content.title || 'Untitled'}
        </Text>
        <Text
          style={[styles.cardContent, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {content.content || 'No content available'}
        </Text>
        <AudioPlayer
          url={content.audioUrl}
          title={content.title || 'Untitled'}
        />
      </TouchableOpacity>
    );
  };

  // Render non-hymn song card
  const renderSongItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/(tabs)/songs/music/${item.id}`)}
    >
      <View style={styles.songInfo}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {item.title || 'Untitled'}
        </Text>
        <Text style={[styles.cardContent, { color: colors.textSecondary }]}>
          {item.style || 'Unknown style'}
        </Text>
        <View style={styles.songMeta}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.duration || 'Unknown'}
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            •
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.category || 'Unknown'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: colors.primaryLight }]}
      >
        <Play size={20} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper>
      <TopNavigation title={translations.songs || 'Songs'} />
      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Search
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <Input
          placeholder={`${translations.search || 'Search'} ${(
            translations.songs || 'Songs'
          ).toLowerCase()}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

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

      {/* Hymns section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translations.hymns || 'Hymns'}
        </Text>
        <FlatList
          data={filteredHymns.slice(0, 3)}
          renderItem={renderHymnItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Music section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translations.music || 'Music'}
        </Text>
        <FlatList
          data={filteredSongs.slice(0, 3)}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 36,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    marginBottom: 0,
  },
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
    fontSize: 16,
    fontWeight: '600',
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

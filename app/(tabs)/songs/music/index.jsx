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
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../../components/TopNavigation';
import { Input } from '../../../../components/ui/Input';
import { mockSongs } from '../../../../data/mockData';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'instrumental', label: 'Instrumental' },
  { id: 'acappella', label: 'A Cappella' },
  { id: 'gospel', label: 'Gospel' },
];

// Displays the Music (non-hymns) screen with categorized songs
export default function MusicScreen() {
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [selectedCategory, setSelectedCategory] = useState('all'); // State for selected category
  const { translations } = useLanguage(); // Access translations
  const { colors } = useTheme(); // Access theme colors

  // Filter songs based on search query and category
  const filteredSongs = mockSongs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.style.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || song.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render category tab for filtering songs
  const renderCategoryTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        {
          backgroundColor:
            selectedCategory === item.id ? colors.primary : colors.card,
        },
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          {
            color:
              selectedCategory === item.id ? colors.text : colors.textSecondary,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  // Render individual song card
  const renderSongItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.songCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/(tabs)/songs/music/${item.id}`)}
    >
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.songStyle, { color: colors.textSecondary }]}>
          {item.style}
        </Text>
        <View style={styles.songMeta}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.duration}
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            •
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.category}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: colors.primaryLight }]}
      >
        <Text>
          {' '}
          <Play size={20} color={colors.primary} />
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper>
      <TopNavigation title={translations.music} />{' '}
      {/* Navigation bar with title */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Search
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <Input
          placeholder={`${
            translations.search
          } ${translations.music.toLowerCase()}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>
      <View
        style={[
          styles.categoriesContainer,
          { backgroundColor: colors.surface },
        ]}
      >
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      <FlatList
        data={filteredSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      />
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
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  songCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songStyle: {
    fontSize: 14,
    marginBottom: 8,
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

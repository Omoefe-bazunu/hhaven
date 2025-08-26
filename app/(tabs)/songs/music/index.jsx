import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Play, Clock } from 'lucide-react-native';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../../components/TopNavigation';
import {
  getSongs,
  searchContent,
  getSongsByCategory,
} from '../../../../services/dataService'; // Import getSongsByCategory
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'native', label: 'Instrumental Native' },
  { id: 'acappella', label: 'A Cappella' },
  { id: 'english', label: 'Instrumental English' },
];

const SkeletonCard = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.songCard, { backgroundColor: colors.card }]}>
      <View style={styles.songInfo}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonTitle}
        />
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonStyle}
        />
        <View style={styles.songMeta}>
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonMeta}
          />
        </View>
      </View>
      <LinearGradient
        colors={[colors.skeleton, colors.skeletonHighlight]}
        style={styles.skeletonPlayButton}
      />
    </View>
  );
};

export default function MusicScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useLanguage();
  const { colors } = useTheme();

  // Fetch songs on initial load and category change
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        let data;
        if (selectedCategory === 'all') {
          data = await getSongs();
        } else {
          data = await getSongsByCategory(selectedCategory);
        }
        setSongs(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [selectedCategory]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setLoading(true);
      if (!query.trim()) {
        // If query is empty, refetch based on category
        try {
          let data;
          if (selectedCategory === 'all') {
            data = await getSongs();
          } else {
            data = await getSongsByCategory(selectedCategory);
          }
          setSongs(data);
        } catch (error) {
          console.error('Error fetching songs:', error);
          setSongs([]);
        } finally {
          setLoading(false);
        }
        return;
      }
      try {
        // searchContent is updated to not filter by category, it will return all songs
        const results = await searchContent(query);
        const filteredSongs = results.songs.filter((song) =>
          selectedCategory === 'all' ? true : song.category === selectedCategory
        );
        setSongs(filteredSongs);
      } catch (error) {
        console.error('Error searching songs:', error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [selectedCategory] // Add selectedCategory to dependencies
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

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
              selectedCategory === item.id ? '#FFFFFF' : colors.textSecondary,
          },
        ]}
      >
        {translations[item.id] || item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.songCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/(tabs)/songs/music/${item.id}`)}
    >
      <View style={styles.songInfo}>
        <Text
          style={[styles.songTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.title || translations.noTitle}
        </Text>
        <Text style={[styles.songStyle, { color: colors.textSecondary }]}>
          {item.style || translations.unknownStyle}
        </Text>
        <View style={styles.songMeta}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.duration || translations.unknownDuration}
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            •
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.category || translations.unknownCategory}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.playButton,
          { backgroundColor: colors.primaryLight || colors.primary },
        ]}
      >
        <Play size={20} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSkeletonCards = () => (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  );

  return (
    <SafeAreaWrapper>
      <TopNavigation title={translations.music} />
      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Search
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={translations.search}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.text }]}
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
        data={loading || songs.length === 0 ? [] : songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderSkeletonCards}
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
    fontSize: 16,
    paddingLeft: 40,
    paddingVertical: 8,
    height: 40,
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
    opacity: 0.9,
  },
  songMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.9,
  },
  playButton: {
    borderRadius: 25,
    padding: 12,
  },
  skeletonTitle: {
    height: 16,
    width: '80%',
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonStyle: {
    height: 14,
    width: '60%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonMeta: {
    height: 12,
    width: 100,
    borderRadius: 4,
  },
  skeletonPlayButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
  },
});

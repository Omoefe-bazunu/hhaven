import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Calendar, Clock } from 'lucide-react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../components/TopNavigation';
import { getSermons, searchContent } from '../../../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

const SkeletonCard = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.sermonCard, { backgroundColor: colors.card }]}>
      <View style={styles.sermonHeader}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonTitle}
        />
        <View style={styles.sermonMeta}>
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonMeta}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonMeta}
          />
        </View>
      </View>
      <LinearGradient
        colors={[colors.skeleton, colors.skeletonHighlight]}
        style={styles.skeletonContent}
      />
      <LinearGradient
        colors={[colors.skeleton, colors.skeletonHighlight]}
        style={styles.skeletonAudio}
      />
    </View>
  );
};

export default function SermonsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations, currentLanguage } = useLanguage();
  const { colors } = useTheme();

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const data = await getSermons();
        setSermons(data);
      } catch (error) {
        console.error('Error fetching sermons:', error);
        setSermons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        try {
          const data = await getSermons();
          setSermons(data);
        } catch (error) {
          console.error('Error fetching sermons:', error);
          setSermons([]);
        }
        return;
      }
      try {
        const results = await searchContent(query);
        setSermons(results.sermons);
      } catch (error) {
        console.error('Error searching sermons:', error);
        setSermons([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const getTranslatedContent = (sermon) => {
    return (
      sermon.translations?.[currentLanguage] ||
      sermon.translations?.en ||
      sermon
    );
  };

  const renderSermonItem = ({ item }) => {
    const content = getTranslatedContent(item);

    return (
      <TouchableOpacity
        style={[styles.sermonCard, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/(tabs)/sermons/${item.id}`)}
      >
        <View style={styles.sermonHeader}>
          <Text
            style={[styles.sermonTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {content.title || translations.noTitle}
          </Text>
          <View style={styles.sermonMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.date || translations.unknownDate}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.duration || translations.unknownDuration}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.sermonContent, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {content.content || translations.noContent}
        </Text>
        {item.audioUrl && (
          <Text style={[styles.sermonContent, { color: colors.textSecondary }]}>
            {translations.audioIncluded || '(Audio included)'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderSkeletonCards = () => (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  );

  return (
    <SafeAreaWrapper>
      <TopNavigation title={translations.sermons} />

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

      <FlatList
        data={loading || sermons.length === 0 ? [] : sermons}
        renderItem={renderSermonItem}
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
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 30,
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
  listContainer: {
    padding: 20,
  },
  sermonCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sermonHeader: {
    marginBottom: 12,
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sermonMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.9,
  },
  sermonContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.9,
  },
  skeletonTitle: {
    height: 20,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonMeta: {
    height: 14,
    width: 80,
    borderRadius: 4,
  },
  skeletonContent: {
    height: 60,
    width: '100%',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonAudio: {
    height: 16,
    width: 100,
    borderRadius: 4,
  },
});

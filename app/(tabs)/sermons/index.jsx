import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Calendar, Clock } from 'lucide-react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../components/TopNavigation';
import { Input } from '../../../components/ui/Input';
import { mockSermons } from '../../../data/mockData';
import { AudioPlayer } from '../../../components/AudioPlayer';

export default function SermonsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { translations, currentLanguage } = useLanguage();
  const { colors } = useTheme();

  const getTranslatedContent = (sermon) => {
    return (
      sermon.translations?.[currentLanguage] || sermon.translations?.en || {}
    );
  };

  const filteredSermons = mockSermons.filter((sermon) => {
    const content = getTranslatedContent(sermon);
    return (
      content.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderSermonItem = ({ item }) => {
    const content = getTranslatedContent(item);

    return (
      <TouchableOpacity
        style={[styles.sermonCard, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/(tabs)/sermons/${item.id}`)}
      >
        <View style={styles.sermonHeader}>
          <Text style={[styles.sermonTitle, { color: colors.text }]}>
            {content.title}
          </Text>
          <View style={styles.sermonMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.date}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.duration}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.sermonContent, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {content.content}
        </Text>

        <AudioPlayer
          url={content.audioUrl}
          title={content.title}
          duration={item.duration}
        />
      </TouchableOpacity>
    );
  };

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
        <Input
          placeholder={`${
            translations.search
          } ${translations.sermons.toLowerCase()}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredSermons}
        renderItem={renderSermonItem}
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
  listContainer: {
    padding: 20,
  },
  sermonCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  },
  sermonContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
});

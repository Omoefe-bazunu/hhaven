import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../components/TopNavigation';
import {
  mockHymns,
  mockSermons,
  mockSongs,
  mockVideos,
} from '../../data/mockData';
import { ChevronRight, Play, Clock } from 'lucide-react-native';

export default function HomeScreen() {
  // Access language, user, and theme contexts
  const { translations, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { colors } = useTheme();

  // Get translated content for an item, defaulting to English or item itself
  const getTranslatedContent = (item) => {
    return (
      item.translations?.[currentLanguage] || item.translations?.en || item
    );
  };

  // Render hymn card with title, content, and listen action
  const renderHymnCard = (hymn) => {
    const content = getTranslatedContent(hymn);
    return (
      <TouchableOpacity
        key={hymn.id}
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/(tabs)/hymns/${hymn.id}`)}
      >
        <Text
          style={[styles.cardTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {content.title}
        </Text>
        <Text
          style={[styles.cardSubtitle, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {content.content}
        </Text>
        <View style={styles.cardFooter}>
          <Play size={16} color={colors.primary} />
          <Text style={[styles.cardAction, { color: colors.primary }]}>
            Listen
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render sermon card with title, content, and duration
  const renderSermonCard = (sermon) => {
    const content = getTranslatedContent(sermon);
    return (
      <TouchableOpacity
        key={sermon.id}
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/(tabs)/sermons/${sermon.id}`)}
      >
        <Text
          style={[styles.cardTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {content.title}
        </Text>
        <Text
          style={[styles.cardSubtitle, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {content.content}
        </Text>
        <View style={styles.cardFooter}>
          <Clock size={16} color={colors.primary} />
          <Text style={[styles.cardAction, { color: colors.primary }]}>
            {sermon.duration}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render song card with title, style, and duration
  const renderSongCard = (song) => (
    <TouchableOpacity
      key={song.id}
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push('/(tabs)/music')}
    >
      <Text
        style={[styles.cardTitle, { color: colors.text }]}
        numberOfLines={1}
      >
        {song.title}
      </Text>
      <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
        {song.style}
      </Text>
      <View style={styles.cardFooter}>
        <Play size={16} color={colors.primary} />
        <Text style={[styles.cardAction, { color: colors.primary }]}>
          {song.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render video card with thumbnail, title, and duration
  const renderVideoCard = (video) => (
    <TouchableOpacity
      key={video.id}
      style={[styles.videoCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/(tabs)/animations/${video.id}`)}
    >
      <Image
        source={{ uri: video.thumbnailUrl }}
        style={styles.videoThumbnail}
      />
      <View style={styles.videoInfo}>
        <Text
          style={[styles.cardTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {video.title}
        </Text>
        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          {video.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Main render: Safe area wrapper with navigation and scrollable content
  return (
    <SafeAreaWrapper>
      <TopNavigation title="Haven" />
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          {/* <Text style={[styles.greeting, { color: colors.text }]}>
            {translations.welcomeBack}
          </Text> */}
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || translations.guest}
          </Text>
        </View>

        {/* Sermons section with horizontal scroll */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {translations.latestSermons}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/sermons')}>
              <View style={styles.seeAllContainer}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>
                  {translations.seeAll}
                </Text>
                <ChevronRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {mockSermons.slice(0, 3).map(renderSermonCard)}
          </ScrollView>
        </View>

        {/* Music section with horizontal scroll */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {translations.featuredMusic}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/music')}>
              <View style={styles.seeAllContainer}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>
                  {translations.seeAll}
                </Text>
                <ChevronRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {mockSongs.slice(0, 3).map(renderSongCard)}
          </ScrollView>
        </View>

        {/* Animations section with horizontal scroll */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {translations.recentAnimations}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/animations')}>
              <View style={styles.seeAllContainer}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>
                  {translations.seeAll}
                </Text>
                <ChevronRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {mockVideos.slice(0, 3).map(renderVideoCard)}
          </ScrollView>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAll: {
    fontSize: 16,
    fontWeight: '500',
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    marginVertical: 10,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: '500',
  },
  videoCard: {
    borderRadius: 16,
    marginRight: 12,
    marginVertical: 10,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  videoInfo: {
    padding: 16,
  },
  bottomSpacer: {
    height: 24,
  },
});

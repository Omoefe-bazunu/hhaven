import React, { useState, useEffect } from 'react';
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
import { getRecentContent } from '../../services/dataService';
import { ChevronRight, Play, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SkeletonCard = ({ type }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        type === 'video' ? styles.videoCard : {},
        { backgroundColor: colors.card },
      ]}
    >
      {type === 'video' && (
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.videoThumbnail}
        />
      )}
      <View style={type === 'video' ? styles.videoInfo : {}}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonTitle}
        />
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonSubtitle}
        />
        {type !== 'video' && (
          <View style={styles.cardFooter}>
            <LinearGradient
              colors={[colors.skeleton, colors.skeletonHighlight]}
              style={styles.skeletonAction}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { translations, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [content, setContent] = useState({
    sermons: [],
    songs: [],
    videos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getRecentContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching recent content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getTranslatedContent = (item) => {
    return (
      item.translations?.[currentLanguage] || item.translations?.en || item
    );
  };

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
          {content.content || translations.noContent}
        </Text>
        <View style={styles.cardFooter}>
          {/* <Clock size={16} color={colors.primary} /> */}
          <Text style={[styles.cardAction, { color: colors.primary }]}>
            {/* {sermon.duration || translations.unknownDuration} */}
            Start studying
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSongCard = (song) => (
    <TouchableOpacity
      key={song.id}
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/(tabs)/songs/music/${song.id}`)}
    >
      <Text
        style={[styles.cardTitle, { color: colors.text }]}
        numberOfLines={1}
      >
        {song.title}
      </Text>
      <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
        Category: {song.category || translations.unknownCategory}
      </Text>
      <View style={styles.cardFooter}>
        <Play size={16} color={colors.primary} />
        <Text style={[styles.cardAction, { color: colors.primary }]}>
          Play now
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          {/* {video.duration || translations.unknownDuration} */} Watch Now
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSkeletonCards = (type) => (
    <>
      <SkeletonCard type={type} />
      <SkeletonCard type={type} />
      <SkeletonCard type={type} />
    </>
  );

  return (
    <SafeAreaWrapper>
      <TopNavigation title="Grace" />
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || translations.guest}
          </Text>
        </View>

        {/* Sermons section */}
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
            {loading || content.sermons.length === 0
              ? renderSkeletonCards('sermon')
              : content.sermons.map(renderSermonCard)}
          </ScrollView>
        </View>

        {/* Recent Music section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {translations.recentMusic}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/songs/music')}
            >
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
            {loading || content.songs.length === 0
              ? renderSkeletonCards('song')
              : content.songs.map(renderSongCard)}
          </ScrollView>
        </View>

        {/* Animations section */}
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
            {loading || content.videos.length === 0
              ? renderSkeletonCards('video')
              : content.videos.map(renderVideoCard)}
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
  userEmail: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
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
    testTransform: 'uppercase',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
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
  skeletonTitle: {
    height: 20,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    height: 16,
    width: '60%',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonAction: {
    height: 16,
    width: 60,
    borderRadius: 4,
  },
  bottomSpacer: {
    height: 24,
  },
});

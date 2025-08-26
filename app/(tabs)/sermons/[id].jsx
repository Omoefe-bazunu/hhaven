import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Play, Pause } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { useTheme } from '../../../contexts/ThemeContext';
import { AudioPlayer } from '../../../components/AudioPlayer';
import { getSermon } from '../../../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';

const CHUNK_SIZE = 400; // characters per batch

const SkeletonSermon = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonTitle}
        />
      </View>
      <View style={styles.content}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={[styles.skeletonTitle, { width: '80%', alignSelf: 'center' }]}
        />
        <View style={styles.metaContainer}>
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonMeta}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonMeta}
          />
        </View>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonAudio}
        />
        <View
          style={[styles.transcriptContainer, { backgroundColor: colors.card }]}
        >
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonTranscriptTitle}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonTranscript}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonTranscript}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams();
  const { currentLanguage, translations } = useLanguage();
  const { colors } = useTheme();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleChunks, setVisibleChunks] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const sermonData = await getSermon(id);
        setSermon(sermonData);
      } catch (error) {
        console.error('Error fetching sermon:', error);
        setSermon(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSermon();
  }, [id]);

  if (loading) {
    return <SkeletonSermon />;
  }

  if (!sermon) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.error, { color: colors.error }]}>
          {translations.errorSermonNotFound || 'Sermon not found'}
        </Text>
      </SafeAreaView>
    );
  }

  const content =
    sermon.translations?.[currentLanguage] || sermon.translations?.en || sermon;

  // Split content into chunks
  const chunks = content.content
    ? content.content.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'g'))
    : [];

  const handleLoadMore = () => {
    if (visibleChunks < chunks.length) {
      setVisibleChunks((prev) => prev + 1);
    }
  };

  const handleSpeak = () => {
    if (!isSpeaking) {
      const text = chunks.slice(0, visibleChunks).join(' ');
      Speech.speak(text, {
        language: currentLanguage || 'en',
        onStart: () => setIsSpeaking(true),
        onDone: () => {
          setIsSpeaking(false);
          setCurrentChunk(0);
        },
      });
    } else {
      Speech.stop();
      setIsSpeaking(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <LanguageSwitcher />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          {content.title || translations.noTitle}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {sermon.date || translations.unknownDate}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {sermon.duration || translations.unknownDuration}
            </Text>
          </View>
        </View>

        {sermon.audioUrl && (
          <AudioPlayer
            url={sermon.audioUrl}
            title={content.title || translations.noTitle}
            duration={sermon.duration || translations.unknownDuration}
          />
        )}

        <View
          style={[styles.transcriptContainer, { backgroundColor: colors.card }]}
        >
          <View style={styles.transcriptHeader}>
            <Text style={[styles.transcriptTitle, { color: colors.text }]}>
              {translations.sermonNotes || 'Sermon Notes'}
            </Text>
            <TouchableOpacity
              onPress={handleSpeak}
              style={[styles.ttsButton, { backgroundColor: colors.border }]}
            >
              {isSpeaking ? (
                <Pause size={20} color={colors.text} />
              ) : (
                <Play size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>

          {chunks.length > 0 ? (
            chunks.slice(0, visibleChunks).map((chunk, index) => (
              <Text
                key={index}
                style={[
                  styles.transcript,
                  { color: colors.textSecondary },
                  index === currentChunk && isSpeaking
                    ? { backgroundColor: colors.warning }
                    : null,
                ]}
              >
                {chunk}
              </Text>
            ))
          ) : (
            <Text style={[styles.transcript, { color: colors.textSecondary }]}>
              {translations.noContent}
            </Text>
          )}

          {visibleChunks < chunks.length && (
            <TouchableOpacity
              onPress={handleLoadMore}
              style={[styles.loadMoreBtn, { backgroundColor: colors.border }]}
            >
              <Text style={[styles.loadMoreText, { color: colors.text }]}>
                {translations.loadMore || 'Load More'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    opacity: 0.9,
  },
  transcriptContainer: {
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transcriptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transcript: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    opacity: 0.9,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ttsButton: {
    padding: 6,
    borderRadius: 6,
  },
  loadMoreBtn: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  loadMoreText: {
    fontWeight: '600',
  },
  skeletonTitle: {
    height: 28,
    width: '60%',
    borderRadius: 4,
    marginVertical: 8,
  },
  skeletonMeta: {
    height: 14,
    width: 80,
    borderRadius: 4,
  },
  skeletonAudio: {
    height: 40,
    width: '100%',
    borderRadius: 4,
    marginVertical: 10,
  },
  skeletonTranscriptTitle: {
    height: 20,
    width: '50%',
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonTranscript: {
    height: 60,
    width: '100%',
    borderRadius: 4,
    marginBottom: 12,
  },
});

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getVideo } from '../../../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaWrapper } from '../../../components/ui/SafeAreaWrapper';

const SkeletonVideo = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonTitle}
        />
      </View>
      <View style={styles.videoContainer}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.videoPlayer}
        />
      </View>
      <View style={[styles.videoInfo, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonTitle}
        />
        <View style={styles.metaInfo}>
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
      <View style={[styles.controls, { backgroundColor: colors.card }]}>
        {[...Array(5)].map((_, index) => (
          <LinearGradient
            key={index}
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonControl}
          />
        ))}
      </View>
    </View>
  );
};

export default function AnimationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [error, setError] = useState(null);
  const { translations } = useLanguage();
  const { colors } = useTheme();

  const player = useVideoPlayer();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideo(id);
        if (videoData?.videoUrl) {
          setVideo(videoData);
        } else {
          setError(translations.errorVideoNotFound || 'Video not found');
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setError(translations.errorVideoNotFound || 'Video not found');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (video?.videoUrl) {
      setIsVideoLoading(true);
      // Reset player to avoid stale state
      player.replace(null);
      player.replace({ uri: video.videoUrl });

      // Set timeout to prevent infinite loading
      timeoutRef.current = setTimeout(() => {
        if (isVideoLoading) {
          setIsVideoLoading(false);
          setError(
            translations.errorVideoLoadTimeout ||
              'Video failed to load. Please try again.'
          );
        }
      }, 30000); // 30-second timeout
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [video, player]);

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(video.videoUrl);
      alert(translations.linkCopied || 'Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${video.title || translations.noTitle}: ${video.videoUrl}`,
        title: translations.shareVideo || 'Share Video',
      });
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };

  if (loading) {
    return <SkeletonVideo />;
  }

  if (!video || error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.error, { color: colors.error }]}>
          {error || translations.errorVideoNotFound || 'Video not found'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaWrapper
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

      <View style={styles.videoContainer}>
        <VideoView
          style={styles.videoPlayer}
          player={player}
          nativeControls={true}
          contentFit="contain"
          onLoadStart={() => setIsVideoLoading(true)}
          onLoad={() => {
            setIsVideoLoading(false);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onError={(err) => {
            setIsVideoLoading(false);
            setError(
              translations.errorVideoLoadFailed || 'Failed to load video.'
            );
            console.error('Video player error:', err);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
        />
        {isVideoLoading && (
          <View style={styles.videoOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>

      <View style={[styles.videoInfo, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {video.title || translations.noTitle}
        </Text>
        <View style={styles.metaInfo}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {translations.duration}:{' '}
            {video.duration || translations.unknownDuration}
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {translations.language}:{' '}
            {video.languageCategory || translations.unknownCategory}
          </Text>
        </View>
      </View>

      <View style={[styles.controls, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.controlButton} onPress={handleShare}>
          <Share2 size={24} color={colors.primary} />
          <Text style={[styles.controlText, { color: colors.primary }]}>
            {translations.share || 'Share'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
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
  videoContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  videoInfo: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 14,
    opacity: 0.9,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  controlButton: {
    alignItems: 'center',
    margin: 8,
  },
  controlText: {
    fontSize: 12,
    fontWeight: '600',
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  skeletonTitle: {
    height: 24,
    width: '60%',
    borderRadius: 4,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  skeletonMeta: {
    height: 14,
    width: '40%',
    borderRadius: 4,
  },
  skeletonControl: {
    height: 40,
    width: 60,
    borderRadius: 4,
    margin: 8,
  },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Play,
  Pause,
  FastForward,
  Rewind,
} from 'lucide-react-native';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../../components/ui/SafeAreaWrapper';
import { getSong } from '../../../../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { LanguageSwitcher } from '../../../../components/LanguageSwitcher';

const SkeletonSong = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaWrapper>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonHeaderTitle}
        />
      </View>
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={[styles.skeletonTitle, { alignSelf: 'center' }]}
        />
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={[styles.skeletonSubtitle, { alignSelf: 'center' }]}
        />
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight]}
          style={styles.skeletonAudio}
        />
        <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonInfoTitle}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonInfoText}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={styles.skeletonInfoText}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default function MusicDetailScreen() {
  const { id } = useLocalSearchParams();
  const { translations } = useLanguage();
  const { colors } = useTheme();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const fetchAndLoadSong = async () => {
      try {
        const songData = await getSong(id);
        if (isMounted.current) {
          setSong(songData);
          if (songData?.audioUrl) {
            await loadAudio(songData.audioUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching or loading song:', error);
        if (isMounted.current) {
          setSong(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchAndLoadSong();

    return () => {
      isMounted.current = false;
      // Unload the sound when the component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const loadAudio = async (url) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      if (isMounted.current) {
        setSound(newSound);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!isMounted.current) return;
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis);
    if (status.durationMillis) {
      setDuration(status.durationMillis);
    }
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPosition(0);
      sound.setPositionAsync(0);
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const handleFastForward = async () => {
    if (sound) {
      const newPosition = position + 10000;
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleRewind = async () => {
    if (sound) {
      const newPosition = Math.max(0, position - 10000);
      await sound.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis) => {
    if (isNaN(millis)) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) {
    return <SkeletonSong />;
  }

  if (!song || !song.audioUrl) {
    return (
      <SafeAreaWrapper>
        <Text style={[styles.error, { color: colors.error }]}>
          {translations.errorSongNotFound || 'Song not found or no audio URL.'}
        </Text>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <LanguageSwitcher />
      </View>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {song.title || translations.noTitle}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {song.style || translations.unknownStyle}
        </Text>

        <View style={styles.audioControls}>
          <TouchableOpacity onPress={handleRewind} style={styles.controlButton}>
            <Rewind size={24} color={colors.text} />
            <Text style={[styles.controlText, { color: colors.text }]}>
              -10s
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.playPauseButton}
          >
            {isPlaying ? (
              <Pause size={48} color="#FFFFFF" />
            ) : (
              <Play size={48} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFastForward}
            style={styles.controlButton}
          >
            <FastForward size={24} color={colors.text} />
            <Text style={[styles.controlText, { color: colors.text }]}>
              +10s
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(position)}
          </Text>
          <View
            style={[
              styles.progressBarBackground,
              { backgroundColor: colors.textSecondary },
            ]}
          >
            <View
              style={[
                styles.progressBar,
                {
                  width: `${(position / duration) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(duration)}
          </Text>
        </View>

        <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            {translations.details}
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {translations.category}:{' '}
            {song.category || translations.unknownCategory}
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {translations.duration}:{' '}
            {song.duration || translations.unknownDuration}
          </Text>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.9,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  playPauseButton: {
    backgroundColor: 'rgba(30, 58, 138, 0.8)',
    borderRadius: 50,
    padding: 20,
  },
  controlButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlText: {
    fontSize: 12,
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  infoContainer: {
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
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    opacity: 0.9,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  skeletonHeaderTitle: {
    height: 18,
    width: '60%',
    borderRadius: 4,
    alignSelf: 'center',
  },
  skeletonTitle: {
    height: 28,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    height: 16,
    width: '60%',
    borderRadius: 4,
    marginBottom: 20,
  },
  skeletonAudio: {
    height: 40,
    width: '100%',
    borderRadius: 4,
    marginBottom: 20,
  },
  skeletonInfoTitle: {
    height: 20,
    width: '50%',
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonInfoText: {
    height: 16,
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
});

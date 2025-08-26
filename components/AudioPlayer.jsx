import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Audio } from 'expo-av';

export function AudioPlayer({ url, title, duration }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const { colors } = useTheme();

  const isMounted = useRef(true);

  // Load and unload the audio file
  useEffect(() => {
    isMounted.current = true;
    const loadSound = async () => {
      if (!url) {
        setSound(null);
        return;
      }
      try {
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate
        );
        if (isMounted.current) {
          setSound(newSound);
        }
      } catch (error) {
        console.error('Failed to load sound:', error);
        if (isMounted.current) {
          setSound(null);
        }
      }
    };
    loadSound();

    // Clean up function to unload the sound
    return () => {
      isMounted.current = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [url]);

  // Update playback status
  const onPlaybackStatusUpdate = (status) => {
    if (!isMounted.current) return;
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);
    setPositionMillis(status.positionMillis);
    if (status.durationMillis) {
      setDurationMillis(status.durationMillis);
    }
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPositionMillis(0);
      sound.setPositionAsync(0); // Reset to beginning
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSeek = async (value) => {
    if (!sound) return;
    const newPosition = positionMillis + value;
    await sound.setPositionAsync(Math.max(0, newPosition));
  };

  const formatTime = (millis) => {
    if (isNaN(millis) || millis === 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!url) {
    return (
      <View style={[styles.unavailable, { backgroundColor: colors.border }]}>
        <Text style={[styles.unavailableText, { color: colors.textSecondary }]}>
          Audio not available
        </Text>
      </View>
    );
  }

  const progress =
    durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>

      {isBuffering && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleSeek(-10000)}
        >
          <SkipBack size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: colors.primary }]}
          onPress={handlePlayPause}
        >
          {isPlaying ? (
            <Pause size={24} color="#FFFFFF" />
          ) : (
            <Play size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleSeek(10000)}
        >
          <SkipForward size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.timeContainer}>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {formatTime(positionMillis)}
        </Text>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: colors.textSecondary + '60' },
          ]}
        >
          <View
            style={[
              styles.progress,
              { backgroundColor: colors.primary, width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {duration ? duration : formatTime(durationMillis)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 12,
  },
  playButton: {
    borderRadius: 30,
    padding: 16,
    marginHorizontal: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 12,
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  unavailable: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  unavailableText: {
    fontStyle: 'italic',
  },
});

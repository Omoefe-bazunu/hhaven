import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

export function AudioPlayer({ url, title, duration }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const { colors } = useTheme();

  const handlePlayPause = () => {
    if (!url) return;
    // In real implementation, this would control actual audio playback
    setIsPlaying(!isPlaying);
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

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
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

        <TouchableOpacity style={styles.controlButton}>
          <SkipForward size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.timeContainer}>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {currentTime}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progress, { backgroundColor: colors.primary }]}
          />
        </View>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {duration || '0:00'}
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
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  progress: {
    height: '100%',
    width: '30%',
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

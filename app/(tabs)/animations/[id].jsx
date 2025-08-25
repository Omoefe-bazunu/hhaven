import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
} from 'lucide-react-native';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { mockVideos } from '../../../data/mockData';

export default function AnimationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);

  const video = mockVideos.find((v) => v.id === id);

  if (!video) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Video not found</Text>
      </SafeAreaView>
    );
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <LanguageSwitcher />
      </View>

      <View style={styles.content}>
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={styles.videoPlayer}
          />
          <View style={styles.videoOverlay}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={48} color="#FFFFFF" />
              ) : (
                <Play size={48} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.videoInfo}>
          <Text style={styles.title}>{video.title}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>Duration: {video.duration}</Text>
            <Text style={styles.metaText}>
              Language: {video.languageCategory}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <RotateCcw size={24} color="#1E3A8A" />
            <Text style={styles.controlText}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Volume2 size={24} color="#1E3A8A" />
            <Text style={styles.controlText}>Audio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    backgroundColor: 'rgba(30, 58, 138, 0.8)',
    borderRadius: 50,
    padding: 20,
  },
  videoInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  controlButton: {
    alignItems: 'center',
    gap: 8,
  },
  controlText: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  error: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 50,
  },
});

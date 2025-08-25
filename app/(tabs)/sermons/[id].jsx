import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { AudioPlayer } from '../../../components/AudioPlayer';
import { mockSermons } from '../../../data/mockData';

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams();
  const { currentLanguage } = useLanguage();

  const sermon = mockSermons.find((s) => s.id === id);
  const content =
    sermon?.translations?.[currentLanguage] || sermon?.translations?.en || {};

  if (!sermon) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Sermon not found</Text>
      </SafeAreaView>
    );
  }

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{content.title}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.metaText}>{sermon.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.metaText}>{sermon.duration}</Text>
          </View>
        </View>

        <AudioPlayer
          url={content.audioUrl}
          title={content.title}
          duration={sermon.duration}
        />

        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptTitle}>Sermon Notes</Text>
          <Text style={styles.transcript}>{content.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
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
    color: '#6B7280',
  },
  transcriptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transcriptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  transcript: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  error: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 50,
  },
});

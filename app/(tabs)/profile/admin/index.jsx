import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert, // 👈 Added Alert for user feedback
} from 'react-native';
import { router } from 'expo-router';
import {
  MessageCircle,
  MessageCircleQuestion,
  Brain,
  Music,
  Video,
  Bell,
  Mic,
} from 'lucide-react-native';
import { useAuth } from '../../../../contexts/AuthContext';
import { LanguageSwitcher } from '../../../../components/LanguageSwitcher';
import { TopNavigation } from '../../../../components/TopNavigation';
import { SafeAreaWrapper } from '../../../../components/ui/SafeAreaWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Import AsyncStorage

export default function AdminDashboardScreen() {
  const { user } = useAuth();

  // 👈 Add this function to clear the onboarding state
  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenOnboarding');
      Alert.alert(
        'Success',
        'Onboarding state has been reset. Please restart the app to see it again.'
      );
    } catch (error) {
      console.error('Failed to reset onboarding state:', error);
      Alert.alert('Error', 'Failed to reset onboarding state.');
    }
  };

  const adminActions = [
    {
      id: 'upload-notice',
      title: 'Send Notice',
      description: 'Send Notification to all users',
      icon: <Bell size={32} color="#1E3A8A" />,
      onPress: () => router.push('/(tabs)/profile/admin/upload/notice'),
    },
    {
      id: 'upload-sermon',
      title: 'Add Sermon',
      description: 'Upload new sermons with audio',
      icon: <Mic size={32} color="#1E3A8A" />,
      onPress: () => router.push('/(tabs)/profile/admin/upload/sermon'),
    },
    {
      id: 'upload-song',
      title: 'Upload Song',
      description: 'Add gospel music to the library',
      icon: <Music size={32} color="#1E3A8A" />,
      onPress: () => router.push('/(tabs)/profile/admin/upload/song'),
    },
    {
      id: 'upload-video',
      title: 'Upload Video',
      description: 'Add animated Bible stories',
      icon: <Video size={32} color="#1E3A8A" />,
      onPress: () => router.push('/(tabs)/profile/admin/upload/video'),
    },
    {
      id: 'view-messages',
      title: 'View Messages',
      description: 'Check contact form submissions',
      icon: <MessageCircle size={32} color="#059669" />,
      onPress: () => router.push('/(tabs)/profile/admin/messages'),
    },
    {
      id: 'quiz-resource',
      title: 'Quiz Resource',
      description: 'Upload Quiz Resources',
      icon: <Brain size={32} color="#DC2626" />,
      onPress: () => router.push('/(tabs)/profile/admin/quizupload'),
    },
    {
      id: 'quiz-help-questions',
      title: 'Quiz Help Questions',
      description: 'Manage Quiz Help Questions',
      icon: <MessageCircleQuestion size={32} color="#DC2626" />,
      onPress: () => router.push('/(tabs)/profile/admin/quizhelpquestions'),
    },
    // 👈 Add the new action here
    {
      id: 'reset-onboarding',
      title: 'Reset Onboarding',
      description: 'Clear onboarding state for testing',
      icon: <Bell size={32} color="#EF4444" />,
      onPress: handleResetOnboarding,
    },
  ];

  return (
    <SafeAreaWrapper>
      <TopNavigation />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, Administrator</Text>
          <Text style={styles.welcomeSubtitle}>{user?.email}</Text>
        </View>

        <View style={styles.actionsGrid}>
          {adminActions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionCard,
                index % 2 === 0 ? styles.leftCard : styles.rightCard,
              ]}
              onPress={action.onPress}
            >
              <View style={styles.actionIcon}>{action.icon}</View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
  leftCard: {
    width: '48%',
  },
  rightCard: {
    width: '48%',
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  quickStats: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    width: '48%',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});

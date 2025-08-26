import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Upload,
  MessageCircle,
  ChartBar as BarChart3,
  Settings,
  Music,
  Video,
  Bell,
  Mic,
} from 'lucide-react-native';
import { useAuth } from '../../../../contexts/AuthContext';
import { LanguageSwitcher } from '../../../../components/LanguageSwitcher';
import { TopNavigation } from '../../../../components/TopNavigation';

export default function AdminDashboardScreen() {
  const { user } = useAuth();

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
      id: 'analytics',
      title: 'Analytics',
      description: 'View app usage statistics',
      icon: <BarChart3 size={32} color="#DC2626" />,
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
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

        <View style={styles.quickStats}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Hymns</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Sermons</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Songs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </View>
          </View>
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

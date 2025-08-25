import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, User, Mail } from 'lucide-react-native';
import { LanguageSwitcher } from '../../../../components/LanguageSwitcher';

const mockMessages = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    message:
      'I love the hymns in Yoruba! Could you add more traditional songs?',
    type: 'suggestion',
    createdAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    message:
      'The app crashes when I try to play sermons. Please fix this issue.',
    type: 'complaint',
    createdAt: '2025-01-14T15:45:00Z',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    message: 'Can you add Chinese subtitles to the animated videos?',
    type: 'request',
    createdAt: '2025-01-13T09:20:00Z',
  },
];

export default function MessagesScreen() {
  const getTypeColor = (type) => {
    switch (type) {
      case 'complaint':
        return '#EF4444';
      case 'suggestion':
        return '#059669';
      case 'request':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getTypeBackground = (type) => {
    switch (type) {
      case 'complaint':
        return '#FEF2F2';
      case 'suggestion':
        return '#ECFDF5';
      case 'request':
        return '#FFFBEB';
      default:
        return '#F9FAFB';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageCard}>
      <View style={styles.messageHeader}>
        <View style={styles.userInfo}>
          <User size={16} color="#6B7280" />
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getTypeBackground(item.type) },
          ]}
        >
          <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
            {item.type}
          </Text>
        </View>
      </View>

      <View style={styles.contactInfo}>
        <Mail size={14} color="#6B7280" />
        <Text style={styles.email}>{item.email}</Text>
      </View>

      <Text style={styles.messageText}>{item.message}</Text>

      <View style={styles.messageFooter}>
        <Calendar size={14} color="#6B7280" />
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Contact Messages</Text>
        <LanguageSwitcher />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{mockMessages.length}</Text>
          <Text style={styles.statLabel}>Total Messages</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {mockMessages.filter((m) => m.type === 'complaint').length}
          </Text>
          <Text style={styles.statLabel}>Complaints</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {mockMessages.filter((m) => m.type === 'suggestion').length}
          </Text>
          <Text style={styles.statLabel}>Suggestions</Text>
        </View>
      </View>

      <FlatList
        data={mockMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  listContainer: {
    padding: 20,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
});

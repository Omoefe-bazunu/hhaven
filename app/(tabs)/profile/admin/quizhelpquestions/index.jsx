import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  MessageCircleOff,
  Send,
} from 'lucide-react-native';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import { subscribeToQuizHelpQuestions } from '@/services/dataService';
import { LinearGradient } from 'expo-linear-gradient';
import { TopNavigation } from '../../../../../components/TopNavigation';
import { SafeAreaWrapper } from '../../../../../components/ui/SafeAreaWrapper';

const SkeletonCard = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.messageCard, { backgroundColor: colors.card }]}>
      <LinearGradient
        colors={[colors.skeleton, colors.skeletonHighlight]}
        style={[styles.skeletonLine, { width: '60%', height: 20 }]}
      />
      <LinearGradient
        colors={[colors.skeleton, colors.skeletonHighlight]}
        style={[styles.skeletonLine, { width: '40%', height: 16 }]}
      />
      <LinearGradient
        colors={[colors.skeleton, colors.skeletonHighlight]}
        style={[styles.skeletonLine, { width: '100%', height: 14 }]}
      />
      <LinearGradient
        colors={[colors.skeleton, colors.skeletonHighlight]}
        style={[styles.skeletonLine, { width: '100%', height: 14 }]}
      />
    </View>
  );
};

export default function QuizHelpQuestionsScreen() {
  const [messages, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = subscribeToQuizHelpQuestions((newMessages) => {
      setQuestions(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Unknown Date';
    const d = new Date(date.seconds * 1000);
    return (
      d.toLocaleDateString() +
      ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageCard, { backgroundColor: colors.card }]}>
      <View style={styles.messageHeader}>
        <View style={styles.userInfo}>
          <User size={16} color={colors.textSecondary} />
          <Text style={[styles.userName, { color: colors.text }]}>
            {item.name}
          </Text>
        </View>
      </View>

      <View style={styles.contactInfo}>
        <Mail size={14} color={colors.textSecondary} />
        <Text style={[styles.whatsapp, { color: colors.textSecondary }]}>
          {item.whatsapp}
        </Text>
      </View>

      <Text style={[styles.messageText, { color: colors.text }]}>
        {item.question}
      </Text>

      <View style={styles.messageFooter}>
        <Calendar size={14} color={colors.textSecondary} />
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MessageCircleOff
        size={64}
        color={colors.textSecondary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        No Questions Found
      </Text>
      <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
        Quiz Questions from users will appear here.
      </Text>
    </View>
  );

  const renderSkeletonCards = () => (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  );

  const totalQuestions = messages.length;

  return (
    <SafeAreaWrapper>
      <TopNavigation title="Quiz Help Questions" />
      {loading ? (
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={[styles.statItem, styles.skeletonStat]}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={[styles.statItem, styles.skeletonStat]}
          />
          <LinearGradient
            colors={[colors.skeleton, colors.skeletonHighlight]}
            style={[styles.statItem, styles.skeletonStat]}
          />
        </View>
      ) : (
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {totalQuestions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Questions
            </Text>
          </View>
        </View>
      )}
      {loading ? (
        <View style={styles.listContainer}>{renderSkeletonCards()}</View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  skeletonStat: {
    height: 40,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  listContainer: {
    padding: 20,
  },
  messageCard: {
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
  whatsapp: {
    fontSize: 14,
    marginLeft: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 6,
  },
  skeletonLine: {
    borderRadius: 4,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

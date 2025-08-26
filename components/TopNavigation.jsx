import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  Info,
  Bell,
  MessageCircle,
  Settings,
  Moon,
  Sun,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  subscribeToNotices,
  subscribeToReadNotices,
} from '../services/dataService'; // Import new functions

export function TopNavigation({ title, showBackButton = false }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { isAdmin, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [notices, setNotices] = useState([]);
  const [readNoticeIds, setReadNoticeIds] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to real-time notices and read notices
  useEffect(() => {
    // Subscribe to all notices
    const unsubscribeNotices = subscribeToNotices((newNotices) => {
      setNotices(newNotices);
    });

    // Subscribe to the user's read notices
    const userId = user?.uid;
    const unsubscribeReadNotices = subscribeToReadNotices(
      userId,
      (newReadIds) => {
        setReadNoticeIds(newReadIds);
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeNotices();
      unsubscribeReadNotices();
    };
  }, [user]);

  // Calculate unread count whenever notices or read notices change
  useEffect(() => {
    const readSet = new Set(readNoticeIds);
    const count = notices.filter((notice) => !readSet.has(notice.id)).length;
    setUnreadCount(count);
  }, [notices, readNoticeIds]);

  const menuItems = [
    {
      icon: <Info size={20} color={colors.text} />,
      title: 'About',
      onPress: () => {
        setShowMenu(false);
        router.push('/profile/about');
      },
    },
    {
      icon: <MessageCircle size={20} color={colors.text} />,
      title: 'Contact',
      onPress: () => {
        setShowMenu(false);
        router.push('/profile/contact');
      },
    },
    {
      icon: isDark ? (
        <Sun size={20} color={colors.text} />
      ) : (
        <Moon size={20} color={colors.text} />
      ),
      title: isDark ? 'Light Mode' : 'Dark Mode',
      onPress: () => {
        setShowMenu(false);
        toggleTheme();
      },
    },
  ];

  if (isAdmin) {
    menuItems.unshift({
      icon: <Settings size={20} color={colors.secondary} />,
      title: 'Admin',
      onPress: () => {
        setShowMenu(false);
        router.push('/profile/admin');
      },
    });
  }

  // Handle tap on the notifications bell
  const handleNotifications = () => {
    // Navigate to a new screen to view notices instead of an alert
    router.push('/profile/notices');
  };

  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.leftSection}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          <LanguageSwitcher />

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotifications}
          >
            <Bell size={20} color={colors.text} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.badgeText, { color: 'red' }]}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowMenu(true)}
          >
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.menu, { backgroundColor: colors.surface }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: colors.border }]}
                onPress={item.onPress}
              >
                {item.icon}
                <Text style={[styles.menuText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMenu(false)}
            >
              <Text style={[styles.closeText, { color: colors.textSecondary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 100,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  menu: {
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

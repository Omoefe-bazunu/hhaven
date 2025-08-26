import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import {
  User,
  Globe,
  Music,
  MessageCircle,
  Info,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../components/ui/SafeAreaWrapper';
import { TopNavigation } from '../../../components/TopNavigation';
import { Button } from '../../../components/ui/Button';
import { LANGUAGES } from '../../../constants/languages';
import { db } from '../../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { translations, currentLanguage } = useLanguage();
  const { colors } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLanguage);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && user.email) {
        try {
          const docRef = doc(db, 'admins', user.email);
          const docSnap = await getDoc(docRef);
          setIsAdmin(docSnap.exists());
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
    };
    checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const menuItems = [
    {
      icon: <Bell size={20} color={colors.primary} />,
      title: translations.notices,
      onPress: () => router.push('/profile/notices'),
    },
    {
      icon: <MessageCircle size={20} color={colors.primary} />,
      title: translations.contact,
      onPress: () => router.push('/profile/contact'),
    },
    {
      icon: <Info size={20} color={colors.primary} />,
      title: translations.about,
      onPress: () => router.push('/profile/about'),
    },
  ];

  // Conditionally add the admin link if the user is an admin
  if (isAdmin) {
    menuItems.unshift({
      icon: <Music size={20} color={colors.primary} />,
      title: translations.admin,
      onPress: () => router.push('/profile/admin'),
    });
  }

  return (
    <SafeAreaWrapper>
      <TopNavigation title={translations.profile} />

      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            <User size={48} color={colors.primary} />
          </View>
          <Text style={[styles.userEmail, { color: colors.text }]}>
            {user?.email}
          </Text>
        </View>

        <View style={[styles.languageCard, { backgroundColor: colors.card }]}>
          <View style={styles.languageHeader}>
            <Globe size={20} color={colors.primary} />
            <Text style={[styles.languageTitle, { color: colors.text }]}>
              Current Language
            </Text>
          </View>
          <View style={styles.languageInfo}>
            <Text style={styles.languageFlag}>{currentLang?.flag}</Text>
            <Text
              style={[styles.languageName, { color: colors.textSecondary }]}
            >
              {currentLang?.name}
            </Text>
          </View>
        </View>

        <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
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
        </View>

        <Button
          title={translations.logout}
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          textStyle={[styles.logoutText, { color: colors.error }]}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
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
  avatarContainer: {
    backgroundColor: '#EBF4FF',
    borderRadius: 50,
    padding: 20,
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  languageCard: {
    borderRadius: 12,
    padding: 16,
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
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
  },
  menuSection: {
    borderRadius: 12,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {},
});

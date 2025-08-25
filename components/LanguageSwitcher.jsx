import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Globe } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { LANGUAGES } from '../constants/languages';

export function LanguageSwitcher() {
  const [isVisible, setIsVisible] = useState(false);
  const { currentLanguage, setLanguage } = useLanguage();
  const { colors } = useTheme();

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLanguage);

  const handleLanguageSelect = async (languageCode) => {
    await setLanguage(languageCode);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.surface }]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.8}
      >
        <Globe size={20} color={colors.primary} />
        <Text style={styles.buttonText}>{currentLang?.flag}</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              Select Language
            </Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    item.code === currentLanguage && {
                      backgroundColor: colors.primary + '20',
                    },
                  ]}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      {
                        color:
                          item.code === currentLanguage
                            ? colors.primary
                            : colors.text,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 4,
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    maxHeight: '70%',
    width: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

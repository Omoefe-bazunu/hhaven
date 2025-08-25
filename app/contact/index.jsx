import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const CATEGORIES = [
  { id: 'complaint', label: 'Complaint' },
  { id: 'suggestion', label: 'Suggestion' },
  { id: 'request', label: 'Request' },
];

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { translations } = useLanguage();

  const handleSubmit = async () => {
    if (!name || !email || !message || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Mock submission - in real app, this would save to Firebase
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Success', 'Your message has been sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
      setCategory('');
    }, 1000);
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
        <Text style={styles.title}>{translations.contact}</Text>
        <LanguageSwitcher />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          {translations.contactDesc ||
            "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
        </Text>

        <View style={styles.form}>
          <Input
            label={translations.name}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Input
            label={translations.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category</Text>
            <View style={styles.categoryOptions}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    category === cat.id && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.id && styles.selectedCategoryText,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label={translations.message}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder="Enter your message"
            style={styles.messageInput}
          />

          <Button
            title={isSubmitting ? 'Sending...' : translations.submit}
            onPress={handleSubmit}
            disabled={isSubmitting}
            size="large"
            style={styles.submitButton}
          />
        </View>
      </View>
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
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: '#EBF4FF',
    borderColor: '#1E3A8A',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  messageInput: {
    textAlignVertical: 'top',
    height: 100,
  },
  submitButton: {
    marginTop: 16,
  },
});

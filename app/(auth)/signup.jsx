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
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { translations } = useLanguage();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(
        'Error',
        translations.fillAllFields || 'Please fill in all fields'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Error',
        translations.passwordsDontMatch || 'Passwords do not match'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Error',
        translations.passwordTooShort ||
          'Password must be at least 6 characters'
      );
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(email.trim(), password);
      if (success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert(
          'Error',
          translations.signupFailed || 'Failed to create account'
        );
      }
    } catch (error) {
      console.error('Signup failed:', error);
      Alert.alert('Signup Error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LanguageSwitcher />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🏠</Text>
          <Text style={styles.appName}>Haven</Text>
        </View>

        <Text style={styles.title}>{translations.signupTitle}</Text>

        <View style={styles.form}>
          <Input
            label={translations.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder={translations.enterEmail || 'Enter your email'}
          />

          <Input
            label={translations.password}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder={translations.enterPassword || 'Enter your password'}
          />

          <Input
            label={translations.confirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder={
              translations.confirmPasswordPlaceholder || 'Confirm your password'
            }
          />

          <Button
            title={isLoading ? translations.loading : translations.signup}
            onPress={handleSignup}
            disabled={isLoading}
            size="large"
            style={styles.signupButton}
          />
        </View>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/(auth)/login')}
          disabled={isLoading}
        >
          <Text style={styles.loginText}>
            {translations.alreadyHaveAccount}{' '}
            <Text style={styles.linkText}>{translations.login}</Text>
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-end',
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  signupButton: {
    marginTop: 16,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  linkText: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
});

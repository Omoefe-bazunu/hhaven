import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SafeAreaWrapper } from '../components/ui/SafeAreaWrapper';

export default function RootLayout() {
  useFrameworkReady();

  const setOnboardingSeen = async () => {
    try {
      const AsyncStorage = (
        await import('@react-native-async-storage/async-storage')
      ).default;
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (error) {
      console.error('Error setting onboarding seen:', error);
    }
  };

  useEffect(() => {
    setOnboardingSeen();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SafeAreaWrapper>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="contact" />
              <Stack.Screen name="about" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaWrapper>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

import { Stack } from 'expo-router';

// Defines the nested layout for the Songs tab
export default function SongsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide default header for all screens in Songs tab
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Songs' }} />{' '}
      {/* Main Songs screen */}
      <Stack.Screen
        name="hymns"
        options={{ title: 'Hymns', href: null }}
      />{' '}
      {/* Hymns list screen */}
      <Stack.Screen
        name="music"
        options={{ title: 'Music', href: null }}
      />{' '}
      {/* Music list screen */}
      <Stack.Screen
        name="hymns/[id]"
        options={{ title: 'Hymn Details', href: null }}
      />{' '}
      {/* Hymn detail screen */}
      <Stack.Screen
        name="music/[id]"
        options={{ title: 'Music Details', href: null }}
      />{' '}
      {/* Music detail screen */}
    </Stack>
  );
}

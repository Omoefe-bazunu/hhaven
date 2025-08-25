import { Stack } from 'expo-router';

export default function AnimationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Admin" options={{ headerShown: false }} />
    </Stack>
  );
}

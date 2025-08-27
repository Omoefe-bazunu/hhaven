import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="quizupload" />
    </Stack>
  );
}

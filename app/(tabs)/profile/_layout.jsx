import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="Admin" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="About" options={{ headerShown: false }} />
      <Stack.Screen name="Contact" options={{ headerShown: false }} />
      <Stack.Screen name="Notices" options={{ headerShown: false }} /> */}
    </Stack>
  );
}

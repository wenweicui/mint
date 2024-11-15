import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="settings"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="settings/language"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="settings/theme"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="security"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="security/password"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="security/biometric"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="help"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="feedback"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="vip"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="accounts"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="family"
        options={{ headerShown: false }}
      />
    </Stack>
  );
} 
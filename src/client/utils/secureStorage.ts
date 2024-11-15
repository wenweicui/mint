import * as SecureStore from 'expo-secure-store';

export async function saveSecurely(key: string, value: any) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to secure storage:', error);
  }
}

export async function getSecurely(key: string) {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error reading from secure storage:', error);
    return null;
  }
} 
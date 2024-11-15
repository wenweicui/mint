import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';

const THEMES = [
  { id: 'light', label: 'Light', icon: 'sunny-outline' },
  { id: 'dark', label: 'Dark', icon: 'moon-outline' },
  { id: 'system', label: 'System', icon: 'settings-outline' },
];

const COLOR_SCHEMES = [
  { id: 'yellow', color: '#FFE135' },
  { id: 'blue', color: '#2563EB' },
  { id: 'green', color: '#10B981' },
  { id: 'purple', color: '#8B5CF6' },
  { id: 'pink', color: '#EC4899' },
];

export default function ThemeScreen() {
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [selectedColor, setSelectedColor] = useState('yellow');

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Theme" />

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
        <View style={styles.themeOptions}>
          {THEMES.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeOption,
                selectedTheme === theme.id && styles.themeOptionSelected,
              ]}
              onPress={() => setSelectedTheme(theme.id)}
            >
              {/* <Ionicons name={theme.icon} size={24} color="#000" /> */}
              <ThemedText style={styles.themeLabel}>{theme.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Accent Color</ThemedText>
        <View style={styles.colorOptions}>
          {COLOR_SCHEMES.map((scheme) => (
            <TouchableOpacity
              key={scheme.id}
              style={[
                styles.colorOption,
                { backgroundColor: scheme.color },
                selectedColor === scheme.id && styles.colorOptionSelected,
              ]}
              onPress={() => setSelectedColor(scheme.id)}
            >
              {selectedColor === scheme.id && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  themeOptionSelected: {
    backgroundColor: '#FFE135',
  },
  themeLabel: {
    fontSize: 14,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: '#000',
  },
});
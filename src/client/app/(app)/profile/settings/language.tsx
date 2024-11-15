import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { MenuSection } from '@/components/profile/MenuSection';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Language" />

      <MenuSection
        items={LANGUAGES.map((lang) => ({
          icon: 'globe-outline',
          label: lang.label,
          rightElement: selectedLanguage === lang.code && (
            <Ionicons name="checkmark" size={24} color="#000" />
          ),
          onPress: () => setSelectedLanguage(lang.code),
        }))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
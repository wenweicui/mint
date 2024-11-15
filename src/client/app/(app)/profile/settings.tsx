import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MenuSection } from '@/components/profile/MenuSection';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Settings" />

      <MenuSection
        title="General"
        items={[
          {
            icon: 'language-outline',
            label: 'Language',
            onPress: () => router.push('/profile/settings/language'),
          },
          {
            icon: 'color-palette-outline',
            label: 'Theme',
            onPress: () => router.push('/profile/settings/theme'),
          },
          {
            icon: 'notifications-outline',
            label: 'Notifications',
            onPress: () => router.push('/profile/settings/notifications'),
          },
        ]}
      />

      <MenuSection
        title="Budget"
        items={[
          {
            icon: 'calendar-outline',
            label: 'Budget Period',
            onPress: () => router.push('/profile/settings/budget-period'),
          },
          {
            icon: 'wallet-outline',
            label: 'Default Account',
            onPress: () => router.push('/profile/settings/default-account'),
          },
          {
            icon: 'grid-outline',
            label: 'Categories',
            onPress: () => router.push('/profile/settings/categories'),
          },
        ]}
      />

      <MenuSection
        title="Data"
        items={[
          {
            icon: 'cloud-upload-outline',
            label: 'Backup & Sync',
            onPress: () => router.push('/profile/settings/backup'),
          },
          {
            icon: 'download-outline',
            label: 'Export Data',
            onPress: () => router.push('/profile/settings/export'),
          },
          {
            icon: 'trash-outline',
            label: 'Clear Data',
            onPress: () => router.push('/profile/settings/clear-data'),
          },
        ]}
      />

      <MenuSection
        title="About"
        items={[
          {
            icon: 'information-circle-outline',
            label: 'Version',
            badge: '1.0.0',
            onPress: () => {},
          },
          {
            icon: 'document-text-outline',
            label: 'Terms of Service',
            onPress: () => router.push('/profile/settings/terms'),
          },
          {
            icon: 'shield-outline',
            label: 'Privacy Policy',
            onPress: () => router.push('/profile/settings/privacy'),
          },
        ]}
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
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MenuSection } from '@/components/profile/MenuSection';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';

export default function SecurityScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Security Center" />

      <View style={styles.riskBanner}>
        <View style={styles.riskIcon}>
          <Ionicons name="warning" size={24} color="#EF4444" />
        </View>
        <View style={styles.riskInfo}>
          <ThemedText style={styles.riskTitle}>High Risk</ThemedText>
          <ThemedText style={styles.riskDescription}>
            Please complete the security verification
          </ThemedText>
        </View>
      </View>

      <MenuSection
        title="Account Security"
        items={[
          {
            icon: 'lock-closed-outline',
            label: 'Password',
            onPress: () => router.push('/profile/security/password'),
          },
          {
            icon: 'finger-print-outline',
            label: 'Biometric Authentication',
            onPress: () => router.push('/profile/security/biometric'),
          },
          {
            icon: 'phone-portrait-outline',
            label: 'Device Management',
            onPress: () => router.push('/profile/security/devices'),
          },
        ]}
      />

      <MenuSection
        title="Privacy"
        items={[
          {
            icon: 'eye-outline',
            label: 'Privacy Mode',
            onPress: () => router.push('/profile/security/privacy-mode'),
          },
          {
            icon: 'key-outline',
            label: 'App Lock',
            onPress: () => router.push('/profile/security/app-lock'),
          },
          {
            icon: 'shield-checkmark-outline',
            label: 'Data Protection',
            onPress: () => router.push('/profile/security/data-protection'),
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
  riskBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  riskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskInfo: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 
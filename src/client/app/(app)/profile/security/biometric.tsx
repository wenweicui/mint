import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Switch, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { MenuSection } from '@/components/profile/MenuSection';
import { ThemedText } from '@/components/ThemedText';

export default function BiometricScreen() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();
    setIsAvailable(available);
  };

  const handleToggle = async () => {
    if (!isEnabled) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
        });
        if (result.success) {
          setIsEnabled(true);
          Alert.alert('Success', 'Biometric authentication enabled');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to enable biometric authentication');
      }
    } else {
      setIsEnabled(false);
      Alert.alert('Success', 'Biometric authentication disabled');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Biometric Authentication" />

      <View style={styles.content}>
        {!isAvailable ? (
          <View style={styles.warning}>
            <ThemedText style={styles.warningText}>
              Biometric authentication is not available on this device
            </ThemedText>
          </View>
        ) : (
          <MenuSection
            items={[
              {
                icon: 'finger-print',
                label: 'Use Biometric Login',
                rightElement: (
                  <Switch
                    value={isEnabled}
                    onValueChange={handleToggle}
                    trackColor={{ false: '#ddd', true: '#FFE135' }}
                  />
                ),
                onPress: () => {},
              },
            ]}
          />
        )}

        <View style={styles.info}>
          <ThemedText style={styles.infoTitle}>About Biometric Login</ThemedText>
          <ThemedText style={styles.infoText}>
            Biometric authentication provides an additional layer of security for your account.
            When enabled, you can use your fingerprint or face recognition to access the app.
          </ThemedText>
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
  content: {
    padding: 16,
  },
  warning: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#EF4444',
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 
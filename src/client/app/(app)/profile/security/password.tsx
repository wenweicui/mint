import { useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';

export default function PasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    // Handle password change
    Alert.alert('Success', 'Password updated successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Change Password" />
      
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Current Password</ThemedText>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>New Password</ThemedText>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Confirm Password</ThemedText>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleChangePassword}
        >
          <ThemedText style={styles.buttonText}>Update Password</ThemedText>
        </TouchableOpacity>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
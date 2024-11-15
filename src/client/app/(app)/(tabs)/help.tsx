import { ScrollView, StyleSheet, View, TextInput } from 'react-native';
import { useState } from 'react';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { MenuSection } from '@/components/profile/MenuSection';
import { ThemedText } from '@/components/ThemedText';

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Help Center" />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search help articles"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <MenuSection
        title="Popular Topics"
        items={[
          {
            icon: 'card-outline',
            label: 'Adding Transactions',
            onPress: () => {},
          },
          {
            icon: 'pie-chart-outline',
            label: 'Budget Management',
            onPress: () => {},
          },
          {
            icon: 'sync-outline',
            label: 'Data Sync',
            onPress: () => {},
          },
        ]}
      />

      <MenuSection
        title="Contact Support"
        items={[
          {
            icon: 'chatbubble-outline',
            label: 'Chat with Us',
            badge: '24/7',
            onPress: () => {},
          },
          {
            icon: 'mail-outline',
            label: 'Email Support',
            onPress: () => {},
          },
          {
            icon: 'document-text-outline',
            label: 'FAQs',
            onPress: () => {},
          },
        ]}
      />

      <View style={styles.supportInfo}>
        <ThemedText style={styles.supportTitle}>Support Hours</ThemedText>
        <ThemedText style={styles.supportText}>
          24/7 Chat Support Available
        </ThemedText>
        <ThemedText style={styles.supportText}>
          Email Response: Within 24 hours
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  supportInfo: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 
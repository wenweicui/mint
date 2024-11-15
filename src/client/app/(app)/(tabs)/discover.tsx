import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { MonthlySummaryCard } from '@/components/discover/MonthlySummaryCard';
import { BudgetCard } from '@/components/discover/BudgetCard';
import { AssetsCard } from '@/components/discover/AssetsCard';
import { QuickActions } from '@/components/discover/QuickActions';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>Discover</ThemedText>
      </View>

      <MonthlySummaryCard />
      <BudgetCard />
      <AssetsCard />
      <QuickActions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE135',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
}); 
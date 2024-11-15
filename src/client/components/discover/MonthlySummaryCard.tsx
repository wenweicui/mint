import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export function MonthlySummaryCard() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Monthly Statement</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.month}>November</ThemedText>
        <View style={styles.row}>
          <View style={styles.column}>
            <ThemedText style={styles.label}>Income</ThemedText>
            <ThemedText style={styles.amount}>14,748.00</ThemedText>
          </View>
          <View style={styles.column}>
            <ThemedText style={styles.label}>Expenses</ThemedText>
            <ThemedText style={styles.amount}>13,774.11</ThemedText>
          </View>
          <View style={styles.column}>
            <ThemedText style={styles.label}>Balance</ThemedText>
            <ThemedText style={styles.amount}>973.89</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    gap: 12,
  },
  month: {
    fontSize: 20,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 
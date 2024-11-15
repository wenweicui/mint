import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export function AssetsCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Asset Manager</ThemedText>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.column}>
            <ThemedText style={styles.label}>Net Worth</ThemedText>
            <ThemedText style={styles.amount}>0.00</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.column}>
            <ThemedText style={styles.label}>Assets</ThemedText>
            <ThemedText style={styles.amount}>0.00</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.column}>
            <ThemedText style={styles.label}>Liabilities</ThemedText>
            <ThemedText style={styles.amount}>0.00</ThemedText>
          </View>
        </View>
      </View>
    </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
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
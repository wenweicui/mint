import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
// import { CircularProgress } from '@/components/ui/CircularProgress';

export function BudgetCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>November Budget</ThemedText>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Set Budget</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* <CircularProgress 
          percentage={0} 
          size={80} 
          strokeWidth={8}
          color="#FFE135"
        /> */}
        <View style={styles.details}>
          <Row label="Remaining Budget:" value="0.00" />
          <Row label="Monthly Budget:" value="0.00" />
          <Row label="Monthly Expenses:" value="0.00" />
        </View>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
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
  button: {
    backgroundColor: '#FFE135',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  details: {
    flex: 1,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 
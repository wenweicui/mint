import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TrendIndicator } from './TrendIndicator';

interface SummaryCardProps {
  title: string;
  amount: number;
  trend: number;
  trendType?: 'positive-up' | 'positive-down';
  color?: string;
}

export function SummaryCard({
  title,
  amount,
  trend,
  trendType = 'positive-up',
  color = '#2563EB'
}: SummaryCardProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <TrendIndicator value={trend} type={trendType} size="small" />
      </View>
      
      <ThemedText style={[styles.amount, { color }]}>
        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 
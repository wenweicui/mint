import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Transaction } from '@/types';

interface TransactionListItemProps {
  transaction: Transaction;
}

export function TransactionListItem({ transaction }: TransactionListItemProps) {
  const initial = transaction.merchantName?.[0] || 'T';
  const isExpense = transaction.amount < 0;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.avatar}>
        <ThemedText style={styles.initial}>{initial}</ThemedText>
      </View>
      
      <View style={styles.content}>
        <ThemedText style={styles.merchant}>
          {transaction.merchantName}
        </ThemedText>
        <ThemedText style={styles.description}>
          {transaction.description}
        </ThemedText>
      </View>
      
      <View style={styles.rightContent}>
        <ThemedText style={[
          styles.amount,
          isExpense ? styles.expense : styles.income
        ]}>
          {isExpense ? '-' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </ThemedText>
        <ThemedText style={styles.status}>
          {transaction.pending ? 'Pending' : 'Completed'}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  initial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  content: {
    flex: 1,
  },
  merchant: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expense: {
    color: '#EF4444',
  },
  income: {
    color: '#10B981',
  },
  status: {
    fontSize: 12,
    color: '#666',
  },
});

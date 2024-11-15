import { Image, StyleSheet, Platform, View, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TransactionListItem } from '@/components/transactions/TransactionListItem';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate summary
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount);
      }
      if (transaction.pending) {
        acc.pending += Math.abs(transaction.amount);
      }
      return acc;
    },
    { income: 0, expenses: 0, pending: 0 }
  );

  const currentMonth = format(new Date(), 'MMMM yyyy');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTransactions();
    } finally {
      setRefreshing(false);
    }
  }, [fetchTransactions]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#2563EB', dark: '#1E40AF' }}
      headerMinHeight={insets.top + 60}
      headerMaxHeight={280}
      headerContent={
        <ThemedView style={styles.summaryCard}>
          <ThemedText style={styles.monthText}>{currentMonth}</ThemedText>
          
          <View style={styles.amountRow}>
            <View style={styles.amountColumn}>
              <ThemedText style={styles.amountLabel}>Income</ThemedText>
              <ThemedText style={styles.amountValue}>
                ${summary.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </ThemedText>
            </View>
            
            <View style={styles.amountColumn}>
              <ThemedText style={styles.amountLabel}>Expenses</ThemedText>
              <ThemedText style={styles.amountValue}>
                ${summary.expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </ThemedText>
            </View>
          </View>

          <View style={styles.pendingRow}>
            <ThemedText style={styles.pendingLabel}>Pending</ThemedText>
            <ThemedText style={styles.pendingValue}>
              ${summary.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </ThemedText>
          </View>
        </ThemedView>
      }
      contentStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#2563EB"
          colors={['#2563EB']}
        />
      }
      onScroll={(offset) => {
        // Handle scroll offset if needed
        console.log('Scroll offset:', offset);
      }}
    >
      <ThemedView style={styles.container}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recent Transactions</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        {isLoading ? (
          <ThemedText>Loading transactions...</ThemedText>
        ) : (
          transactions.slice(0, 5).map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  monthText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#fff',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountColumn: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  pendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  pendingLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  pendingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'white', // Or use themed color
    paddingHorizontal: 16,
    paddingTop: 24,
    marginTop: 280, // Same as headerMaxHeight
  },
});
import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTransactionStore } from '@/store/useTransactionStore';

export const TransactionList = () => {
  const { transactions, isLoading, error, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (isLoading) {
    return <Text>Loading transactions...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.description}</Text>
          <Text>{item.amount}</Text>
        </View>
      )}
    />
  );
}; 
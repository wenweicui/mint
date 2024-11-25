import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/mock_data.dart';
import '../providers/transaction_provider.dart';
import '../providers/account_provider.dart';

final mockDataProvider = Provider<MockDataInitializer>((ref) {
  return MockDataInitializer(ref);
});

class MockDataInitializer {
  final Ref _ref;

  MockDataInitializer(this._ref);

  Future<void> initializeMockData() async {
    // First, add all mock accounts
    final mockAccounts = MockData.getMockAccounts();
    for (final account in mockAccounts) {
      await _ref.read(accountsProvider.notifier).addAccount(account);
    }

    // Then add all transactions
    final mockTransactions = MockData.getMockTransactions();
    for (final transaction in mockTransactions) {
      await _ref
          .read(transactionsProvider.notifier)
          .addTransaction(transaction);
    }
  }

  Future<void> clearMockData() async {
    // Clear all transactions first (due to foreign key constraints)
    await _ref.read(transactionsProvider.notifier).clearAllTransactions();
    // Then clear all accounts
    await _ref.read(accountsProvider.notifier).clearAllAccounts();
  }
}

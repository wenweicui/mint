import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:mintmate/config/routes.dart';
import 'package:mintmate/models/account.dart';
import 'package:mintmate/models/time_range.dart';
import 'package:mintmate/models/transaction.dart';
import 'package:mintmate/providers/account_provider.dart';
import 'package:mintmate/providers/transaction_provider.dart';
import 'package:mintmate/providers/selected_range_provider.dart';
import 'package:mintmate/widgets/add_transaction_modal.dart';
import '../../widgets/bottom_navigation.dart';
import 'summary_widget.dart';
import 'balance_graph_widget.dart';
import '../../widgets/animated_fab.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final accounts = ref.watch(accountsProvider);
    final transactions = ref.watch(transactionsProvider);
    final selectedRange = ref.watch(selectedRangeProvider);

    return Scaffold(
      // appBar: AppBar(
      //   title: const SizedBox(height: 16),
      // ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.read(accountsProvider.notifier).loadAccounts();
          ref.read(transactionsProvider.notifier).loadTransactions();
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SizedBox(height: 50),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: _buildTotalAssets(
                  accounts, transactions, selectedRange, context),
            ),
            const SizedBox(height: 10),
            const BalanceGraphWidget(),
            SummaryWidget(accounts: accounts),
          ],
        ),
      ),
      floatingActionButton: AnimatedFAB(
        onPressed: () => _showAddTransactionModal(context),
        child: const Icon(Icons.add),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      bottomNavigationBar: BottomNavigation(
        currentIndex: 0,
        onTap: (index) {
          if (index == 1) {
            Navigator.pushNamed(context, AppRoutes.transactions);
          } else if (index == 2) {
            Navigator.pushNamed(context, AppRoutes.settings);
          }
        },
      ),
    );
  }

  Widget _buildTotalAssets(
      List<Account> accounts,
      List<FinancialTransaction> transactions,
      TimeRange selectedRange,
      BuildContext context) {
    final currencyFormatter = NumberFormat.currency(symbol: '\$');
    final currentBalance =
        accounts.fold<double>(0.0, (sum, account) => sum + account.balance);

    // Get the date range for selected period
    final dateRange = selectedRange.getDateRange();

    // Calculate balance change only for the selected period
    final periodTransactions = transactions
        .where((t) =>
            t.date.isAfter(dateRange.start) && t.date.isBefore(dateRange.end))
        .toList();

    // Calculate net change (income - expenses) for the period
    final balanceChange =
        periodTransactions.fold<double>(0.0, (sum, transaction) {
      return sum +
          switch (transaction.type) {
            TransactionType.income => transaction.amount,
            TransactionType.expense => -transaction.amount,
            TransactionType.transfer =>
              0.0, // Transfers don't affect total balance
          };
    });

    // Calculate percentage change
    // Get transactions right before the period start to know previous balance
    final previousTransactions =
        transactions.where((t) => t.date.isBefore(dateRange.start)).toList();

    final previousBalance =
        previousTransactions.fold<double>(0.0, (sum, transaction) {
      return sum +
          switch (transaction.type) {
            TransactionType.income => transaction.amount,
            TransactionType.expense => -transaction.amount,
            TransactionType.transfer => 0.0,
          };
    });

    // Calculate percentage change, handling edge cases
    final percentageChange = previousBalance != 0
        ? (balanceChange / previousBalance * 100)
        : balanceChange > 0
            ? 100 // If starting from 0, treat any positive change as 100%
            : 0; // If starting from 0 and no change or negative, show 0%

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Total Assets',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: Colors.grey,
              ),
        ),
        Text(
          currencyFormatter.format(currentBalance),
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            Text(
              '${balanceChange >= 0 ? "+" : ""}${currencyFormatter.format(balanceChange)}',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: percentageChange >= 0
                    ? Colors.green.withOpacity(0.1)
                    : Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                '${percentageChange >= 0 ? "+" : ""}${percentageChange.toStringAsFixed(1)}%',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: percentageChange >= 0 ? Colors.green : Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _showAddTransactionModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) => const AddTransactionModal(),
    );
  }
}

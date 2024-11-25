import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mintmate/widgets/add_transaction_modal.dart';
import '../../providers/transaction_provider.dart';
import '../../models/transaction.dart';
import '../../widgets/bottom_navigation.dart';
import 'transaction_list_widget.dart';
import 'month_selector_widget.dart';
import '../../widgets/animated_fab.dart';

class TransactionScreen extends ConsumerStatefulWidget {
  const TransactionScreen({super.key});

  @override
  ConsumerState<TransactionScreen> createState() => _TransactionScreenState();
}

class _TransactionScreenState extends ConsumerState<TransactionScreen> {
  DateTime _selectedDate = DateTime.now();
  TransactionType? _filterType;

  @override
  Widget build(BuildContext context) {
    final transactions = ref.watch(transactionsProvider);
    final filteredTransactions = _filterTransactions(transactions);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Transactions'),
        actions: [
          PopupMenuButton<TransactionType?>(
            icon: const Icon(Icons.filter_list),
            onSelected: (TransactionType? value) {
              setState(() {
                _filterType = value;
              });
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(
                value: null,
                child: Text('All'),
              ),
              const PopupMenuItem(
                value: TransactionType.income,
                child: Text('Income'),
              ),
              const PopupMenuItem(
                value: TransactionType.expense,
                child: Text('Expense'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          MonthSelectorWidget(
            selectedDate: _selectedDate,
            onMonthSelected: (date) {
              setState(() {
                _selectedDate = date;
              });
            },
          ),
          Expanded(
            child: TransactionListWidget(
              transactions: filteredTransactions,
              onDelete: _deleteTransaction,
            ),
          ),
        ],
      ),
      floatingActionButton: AnimatedFAB(
        onPressed: () => _showAddTransactionModal(context),
        child: const Icon(Icons.add),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      bottomNavigationBar: BottomNavigation(
        currentIndex: 1,
        onTap: (index) {
          if (index == 0) {
            Navigator.pushReplacementNamed(context, '/');
          } else if (index == 2) {
            Navigator.pushReplacementNamed(context, '/settings');
          }
        },
      ),
    );
  }

  List<FinancialTransaction> _filterTransactions(
      List<FinancialTransaction> transactions) {
    return transactions.where((transaction) {
      // Filter by month and year
      bool dateMatch = transaction.date.year == _selectedDate.year &&
          transaction.date.month == _selectedDate.month;

      // Filter by transaction type if filter is applied
      bool typeMatch = _filterType == null || transaction.type == _filterType;

      return dateMatch && typeMatch;
    }).toList()
      ..sort((a, b) => b.date.compareTo(a.date)); // Sort by date descending
  }

  void _deleteTransaction(FinancialTransaction transaction) async {
    // Show confirmation dialog
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Transaction'),
        content:
            const Text('Are you sure you want to delete this transaction?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      ref.read(transactionsProvider.notifier).deleteTransaction(transaction.id);
    }
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

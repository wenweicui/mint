import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mintmate/config/routes.dart';
import 'package:mintmate/screens/home/home_screen.dart';
import 'package:mintmate/screens/settings/settings_screen.dart';
import 'package:mintmate/screens/statistics/statistics_screen.dart';
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
      body: Column(
        children: [
          const SizedBox(height: 50),
          MonthSelectorWidget(
            selectedDate: _selectedDate,
            onMonthSelected: (date) {
              setState(() {
                _selectedDate = date;
              });
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                _buildFilterButton(null, 'All'),
                const SizedBox(width: 8),
                _buildFilterButton(TransactionType.expense, 'Expenses'),
                const SizedBox(width: 8),
                _buildFilterButton(TransactionType.income, 'Income'),
              ],
            ),
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
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomNavigation(
        currentIndex: 1,
        onTap: (index) {
          if (index == 0) {
            Navigator.pushReplacement(
              context,
              PageRouteBuilder(
                pageBuilder: (context, animation1, animation2) =>
                    const HomeScreen(),
                transitionDuration: Duration.zero,
                reverseTransitionDuration: Duration.zero,
              ),
            );
          } else if (index == 3) {
            Navigator.pushReplacement(
              context,
              PageRouteBuilder(
                pageBuilder: (context, animation1, animation2) =>
                    const SettingsScreen(),
                transitionDuration: Duration.zero,
                reverseTransitionDuration: Duration.zero,
              ),
            );
          } else if (index == 2) {
            Navigator.pushReplacement(
              context,
              PageRouteBuilder(
                pageBuilder: (context, animation1, animation2) =>
                    const StatisticsScreen(),
                transitionDuration: Duration.zero,
                reverseTransitionDuration: Duration.zero,
              ),
            );
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

  Widget _buildFilterButton(TransactionType? type, String label) {
    final isSelected = _filterType == type;
    final color = type == TransactionType.income
        ? Colors.red[400]
        : type == TransactionType.expense
            ? Colors.grey[800]
            : Colors.grey[900];

    return Expanded(
      child: ElevatedButton(
        onPressed: () {
          setState(() {
            _filterType = type;
          });
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: isSelected ? color : Colors.grey[200],
          foregroundColor: isSelected ? Colors.white : Colors.black87,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
        child: Text(label),
      ),
    );
  }
}

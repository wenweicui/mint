import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mintmate/screens/home/home_screen.dart';
import 'package:mintmate/screens/settings/settings_screen.dart';
import 'package:mintmate/screens/statistics/statistics_screen.dart';
import 'package:mintmate/widgets/add_transaction_modal.dart';
import '../../providers/transaction_provider.dart';
import '../../models/transaction.dart';
import '../../widgets/bottom_navigation.dart';
import 'transaction_list_widget.dart';
import '../../widgets/animated_fab.dart';
import '../../widgets/compact_month_selector.dart';

class TransactionScreen extends ConsumerStatefulWidget {
  const TransactionScreen({super.key});

  @override
  ConsumerState<TransactionScreen> createState() => _TransactionScreenState();
}

class _TransactionScreenState extends ConsumerState<TransactionScreen> {
  DateTime _selectedDate = DateTime.now();
  TransactionType? _filterType;
  Map<String, dynamic> _advancedFilters = {};

  @override
  Widget build(BuildContext context) {
    final transactions = ref.watch(transactionsProvider);
    final filteredTransactions = _filterTransactions(transactions);

    return Scaffold(
      appBar: AppBar(
        centerTitle: false,
        title: CompactMonthSelector(
          selectedDate: _selectedDate,
          onMonthSelected: (date) {
            setState(() {
              _selectedDate = date;
            });
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showAdvancedFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
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
              selectedDate: _selectedDate,
              onMonthChanged: (DateTime newDate) {
                setState(() {
                  _selectedDate = newDate;
                });
              },
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
      bool dateMatch = transaction.date.year == _selectedDate.year &&
          transaction.date.month == _selectedDate.month;
      bool typeMatch = _filterType == null || transaction.type == _filterType;
      bool advancedMatch = _matchesAdvancedFilters(transaction);

      return dateMatch && typeMatch && advancedMatch;
    }).toList()
      ..sort((a, b) => b.date.compareTo(a.date));
  }

  bool _matchesAdvancedFilters(FinancialTransaction transaction) {
    if (_advancedFilters.isEmpty) return true;

    if (_advancedFilters.containsKey('category')) {
      if (transaction.category != _advancedFilters['category']) return false;
    }

    if (_advancedFilters.containsKey('tags')) {
      List<String> filterTags = _advancedFilters['tags'];
      if (transaction.tags == null || transaction.tags!.isEmpty) {
        return false;
      }
      List<String> transactionTags = transaction.tags!.split(',');
      if (!filterTags.every((tag) => transactionTags.contains(tag))) {
        return false;
      }
    }

    if (_advancedFilters.containsKey('minAmount')) {
      if (transaction.amount < _advancedFilters['minAmount']) return false;
    }

    if (_advancedFilters.containsKey('maxAmount')) {
      if (transaction.amount > _advancedFilters['maxAmount']) return false;
    }

    return true;
  }

  void _showAdvancedFilterDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Advanced Filters'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildCategoryFilter(),
                _buildTagsFilter(),
                _buildAmountRangeFilter(),
              ],
            ),
          ),
          actions: [
            TextButton(
              child: const Text('Clear Filters'),
              onPressed: () {
                setState(() {
                  _advancedFilters.clear();
                });
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Apply'),
              onPressed: () {
                setState(() {
                  // Apply the filters
                });
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildCategoryFilter() {
    // Get unique categories from transactions
    final transactions = ref.watch(transactionsProvider);
    final categories = transactions.map((t) => t.category).toSet().toList()
      ..sort();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Category',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _advancedFilters['category'],
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          ),
          hint: const Text('Select category'),
          items: [
            const DropdownMenuItem(
              value: null,
              child: Text('All categories'),
            ),
            ...categories.map((category) => DropdownMenuItem(
                  value: category,
                  child: Text(category),
                )),
          ],
          onChanged: (value) {
            setState(() {
              if (value == null) {
                _advancedFilters.remove('category');
              } else {
                _advancedFilters['category'] = value;
              }
            });
          },
        ),
      ],
    );
  }

  Widget _buildTagsFilter() {
    final transactions = ref.watch(transactionsProvider);
    final allTags = transactions
        .where((t) => t.tags != null && t.tags!.isNotEmpty)
        .expand((t) => t.tags!.split(','))
        .toSet()
        .toList()
      ..sort();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Tags',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: allTags.map((tag) {
            final isSelected =
                (_advancedFilters['tags'] as List<String>?)?.contains(tag) ??
                    false;
            return FilterChip(
              label: Text(tag),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  final List<String> selectedTags =
                      List.from(_advancedFilters['tags'] ?? []);
                  if (selected) {
                    selectedTags.add(tag);
                  } else {
                    selectedTags.remove(tag);
                  }
                  if (selectedTags.isEmpty) {
                    _advancedFilters.remove('tags');
                  } else {
                    _advancedFilters['tags'] = selectedTags;
                  }
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildAmountRangeFilter() {
    final transactions = ref.watch(transactionsProvider);
    final maxAmount = transactions.fold<double>(
        0, (max, t) => t.amount > max ? t.amount : max);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Amount Range',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextField(
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Min Amount',
                  prefixText: '\$',
                  border: OutlineInputBorder(),
                ),
                controller: TextEditingController(
                  text: _advancedFilters['minAmount']?.toString() ?? '',
                ),
                onChanged: (value) {
                  setState(() {
                    if (value.isEmpty) {
                      _advancedFilters.remove('minAmount');
                    } else {
                      _advancedFilters['minAmount'] =
                          double.tryParse(value) ?? 0;
                    }
                  });
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextField(
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Max Amount',
                  prefixText: '\$',
                  border: OutlineInputBorder(),
                ),
                controller: TextEditingController(
                  text: _advancedFilters['maxAmount']?.toString() ?? '',
                ),
                onChanged: (value) {
                  setState(() {
                    if (value.isEmpty) {
                      _advancedFilters.remove('maxAmount');
                    } else {
                      _advancedFilters['maxAmount'] =
                          double.tryParse(value) ?? 0;
                    }
                  });
                },
              ),
            ),
          ],
        ),
      ],
    );
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

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import '../models/transaction.dart';
import '../providers/transaction_provider.dart';
import '../providers/account_provider.dart';

class AddTransactionModal extends ConsumerStatefulWidget {
  const AddTransactionModal({super.key});

  @override
  ConsumerState<AddTransactionModal> createState() =>
      _AddTransactionModalState();
}

class _AddTransactionModalState extends ConsumerState<AddTransactionModal> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();

  TransactionType _type = TransactionType.expense;
  String? _selectedCategory;
  String? _selectedAccountId;
  DateTime _selectedDate = DateTime.now();

  // Split categories by transaction type
  final Map<TransactionType, List<String>> _categoriesByType = {
    TransactionType.expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Bills & Utilities',
      'Entertainment',
      'Health',
      'Travel',
      'Education',
      'Housing',
      'Insurance',
      'Personal Care',
      'Gifts & Donations',
      'Business',
      'Other Expenses'
    ],
    TransactionType.income: [
      'Salary',
      'Bonus',
      'Investment Returns',
      'Part-time Work',
      'Freelance',
      'Rental Income',
      'Interest',
      'Dividends',
      'Tax Refund',
      'Gift',
      'Other Income'
    ],
  };

  @override
  void initState() {
    super.initState();
    _initializeDefaultAccount();
  }

  Future<void> _initializeDefaultAccount() async {
    final accounts = ref.read(accountsProvider);
    if (accounts.isNotEmpty) {
      setState(() {
        _selectedAccountId = accounts.first.id;
      });
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  // Add this method to handle category reset when transaction type changes
  void _handleTransactionTypeChange(TransactionType newType) {
    setState(() {
      _type = newType;
      // Reset category when type changes
      _selectedCategory = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final accounts = ref.watch(accountsProvider);

    // If there are no accounts, show an error or create default
    if (accounts.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    // If no account is selected, select the first one
    if (_selectedAccountId == null && accounts.isNotEmpty) {
      _selectedAccountId = accounts.first.id;
    }

    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 16,
        right: 16,
        top: 16,
      ),
      child: Form(
        key: _formKey,
        child: ListView(
          shrinkWrap: true,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Add Transaction',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Updated Transaction Type Selector
            SegmentedButton<TransactionType>(
              segments: const [
                ButtonSegment(
                  value: TransactionType.expense,
                  label: Text('Expense'),
                  icon: Icon(Icons.remove),
                ),
                ButtonSegment(
                  value: TransactionType.income,
                  label: Text('Income'),
                  icon: Icon(Icons.add),
                ),
              ],
              selected: {_type},
              onSelectionChanged: (Set<TransactionType> selected) {
                _handleTransactionTypeChange(selected.first);
              },
            ),
            const SizedBox(height: 16),
            // Amount Field
            TextFormField(
              controller: _amountController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: 'Amount',
                prefixText: '\$',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter an amount';
                }
                if (double.tryParse(value) == null) {
                  return 'Please enter a valid number';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            // Account Selector
            DropdownButtonFormField<String>(
              value: _selectedAccountId ?? accounts.first.id,
              decoration: const InputDecoration(
                labelText: 'Account',
                border: OutlineInputBorder(),
              ),
              items: accounts.map((account) {
                return DropdownMenuItem(
                  value: account.id,
                  child: Text(account.name),
                );
              }).toList(),
              onChanged: (String? value) {
                setState(() {
                  _selectedAccountId = value;
                });
              },
              validator: (value) {
                if (value == null) {
                  return 'Please select an account';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            // Updated Category Selector
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: InputDecoration(
                labelText: _type == TransactionType.expense
                    ? 'Expense Category'
                    : 'Income Category',
                border: const OutlineInputBorder(),
              ),
              items: _categoriesByType[_type]!.map((category) {
                return DropdownMenuItem(
                  value: category,
                  child: Text(category),
                );
              }).toList(),
              onChanged: (String? value) {
                setState(() {
                  _selectedCategory = value;
                });
              },
              validator: (value) {
                if (value == null) {
                  return _type == TransactionType.expense
                      ? 'Please select an expense category'
                      : 'Please select an income category';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            // Date Picker
            InkWell(
              onTap: _selectDate,
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Date',
                  border: OutlineInputBorder(),
                ),
                child: Text(
                  DateFormat('MMM dd, yyyy').format(_selectedDate),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Description Field
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 24),
            // Save Button
            ElevatedButton(
              onPressed: _saveTransaction,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Save Transaction'),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _saveTransaction() {
    if (_formKey.currentState!.validate()) {
      final transaction = FinancialTransaction(
        id: const Uuid().v4(),
        amount: double.parse(_amountController.text),
        category: _selectedCategory!,
        date: _selectedDate,
        description: _descriptionController.text,
        type: _type,
        accountId: _selectedAccountId!,
      );

      ref.read(transactionsProvider.notifier).addTransaction(transaction);

      // Update account balance
      final amount = double.parse(_amountController.text);
      ref.read(accountsProvider.notifier).updateAccountBalance(
            _selectedAccountId!,
            _type == TransactionType.income ? amount : -amount,
          );

      Navigator.pop(context);
    }
  }
}

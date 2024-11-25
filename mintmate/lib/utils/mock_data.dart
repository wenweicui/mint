import 'package:uuid/uuid.dart';
import '../models/transaction.dart';
import '../models/account.dart';
import 'dart:math';

class MockData {
  static final _uuid = const Uuid();
  static final DateTime now = DateTime.now();

  static List<Account> getMockAccounts() {
    // First generate transactions
    final transactions = getMockTransactions();

    // Calculate balances based on transactions
    Map<String, double> balances = {
      'checking-account': 0.0,
      'savings-account': 0.0,
      'credit-card': 0.0,
    };

    // Process all transactions to calculate actual balances
    for (var transaction in transactions) {
      switch (transaction.type) {
        case TransactionType.income:
          balances[transaction.accountId] =
              (balances[transaction.accountId] ?? 0) + transaction.amount;
        case TransactionType.expense:
          balances[transaction.accountId] =
              (balances[transaction.accountId] ?? 0) - transaction.amount;
        case TransactionType.transfer:
          // Deduct from source account
          if (transaction.fromAccountId != null) {
            balances[transaction.fromAccountId!] =
                (balances[transaction.fromAccountId!] ?? 0) -
                    transaction.amount;
          }
          // Add to destination account
          balances[transaction.accountId] =
              (balances[transaction.accountId] ?? 0) + transaction.amount;
      }
    }

    return [
      Account(
        id: 'checking-account',
        name: 'Checking Account',
        type: AccountType.checking,
        balance: balances['checking-account']!,
        currency: 'USD',
      ),
      Account(
        id: 'savings-account',
        name: 'Savings Account',
        type: AccountType.savings,
        balance: balances['savings-account']!,
        currency: 'USD',
      ),
      Account(
        id: 'credit-card',
        name: 'Credit Card',
        type: AccountType.creditCard,
        balance: balances['credit-card']!,
        currency: 'USD',
      ),
    ];
  }

  // To avoid circular dependency, create a private method for transactions
  static List<FinancialTransaction> _generateTransactions(
      List<String> accountIds) {
    final random = Random();
    List<FinancialTransaction> transactions = [];

    // Generate daily random transactions for the past 90 days
    for (var i = 0; i < 90; i++) {
      final date = now.subtract(Duration(days: i));

      // Add monthly salary on the 1st
      if (date.day == 1) {
        transactions.add(_createTransaction(
          amount: 4500.00,
          type: TransactionType.income,
          category: 'Salary',
          date: date,
          description: 'Monthly Salary',
          accountId: accountIds[0], // Checking account
        ));

        // Add monthly savings transfer
        transactions.add(_createTransaction(
          amount: 1000.00,
          type: TransactionType.transfer,
          category: 'Transfer',
          date: date.add(const Duration(days: 2)),
          description: 'Monthly Savings',
          accountId: accountIds[1], // To savings
          fromAccountId: accountIds[0], // From checking
        ));
      }

      // Random number of transactions per day (0-4)
      final transactionsPerDay = random.nextInt(5);

      for (var j = 0; j < transactionsPerDay; j++) {
        final isExpense = random.nextDouble() < 0.8; // 80% chance of expense

        // Select random account based on transaction type
        final accountId = isExpense
            ? random.nextDouble() < 0.7
                ? accountIds[0] // 70% checking
                : accountIds[2] // 30% credit card
            : random.nextDouble() < 0.8
                ? accountIds[0] // 80% checking
                : accountIds[1]; // 20% savings

        final amount = isExpense
            ? 5 + random.nextDouble() * 95 // Expenses between $5-$100
            : 200 + random.nextDouble() * 800; // Income between $200-$1000

        final category = isExpense
            ? _randomExpenseCategory(random)
            : _randomIncomeCategory(random);

        transactions.add(_createTransaction(
          amount: double.parse(amount.toStringAsFixed(2)),
          type: isExpense ? TransactionType.expense : TransactionType.income,
          category: category,
          date: DateTime(
            date.year,
            date.month,
            date.day,
            random.nextInt(24), // Random hour
            random.nextInt(60), // Random minute
          ),
          description: _getRandomDescription(category),
          accountId: accountId,
        ));
      }

      // Credit card payment on the 15th
      if (date.day == 15) {
        final creditCardBalance = transactions
            .where((t) =>
                t.accountId == accountIds[2] && t.date.month == date.month)
            .fold(
                0.0,
                (sum, t) =>
                    sum + (t.type == TransactionType.expense ? t.amount : 0));

        if (creditCardBalance > 0) {
          transactions.add(_createTransaction(
            amount: creditCardBalance,
            type: TransactionType.transfer,
            category: 'Credit Card Payment',
            date: date,
            description: 'Monthly Credit Card Payment',
            accountId: accountIds[2], // To credit card
            fromAccountId: accountIds[0], // From checking
          ));
        }
      }
    }

    // Add some initial balance to accounts
    transactions.add(_createTransaction(
      amount: 10000.00,
      type: TransactionType.income,
      category: 'Initial Balance',
      date: now.subtract(const Duration(days: 90)),
      description: 'Initial Balance',
      accountId: accountIds[0], // Checking
    ));

    transactions.add(_createTransaction(
      amount: 25000.00,
      type: TransactionType.income,
      category: 'Initial Balance',
      date: now.subtract(const Duration(days: 90)),
      description: 'Initial Balance',
      accountId: accountIds[1], // Savings
    ));

    return transactions;
  }

  static List<FinancialTransaction> getMockTransactions() {
    final accountIds = ['checking-account', 'savings-account', 'credit-card'];
    return _generateTransactions(accountIds);
  }

  static String _randomExpenseCategory(Random random) {
    final categories = [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Bills & Utilities',
      'Entertainment',
      'Healthcare',
      'Groceries',
      'Travel',
      'Education',
    ];
    return categories[random.nextInt(categories.length)];
  }

  static String _randomIncomeCategory(Random random) {
    final categories = [
      'Freelance',
      'Investment Returns',
      'Side Projects',
      'Consulting',
      'Rental Income',
    ];
    return categories[random.nextInt(categories.length)];
  }

  static String _getRandomDescription(String category) {
    final random = Random();
    final descriptions = switch (category) {
      'Food & Dining' => [
          'Restaurant meal',
          'Coffee shop',
          'Food delivery',
          'Lunch break',
        ],
      'Transportation' => [
          'Bus fare',
          'Taxi ride',
          'Fuel',
          'Train ticket',
        ],
      'Shopping' => [
          'Clothing purchase',
          'Electronics',
          'Home goods',
          'Online shopping',
        ],
      'Bills & Utilities' => [
          'Electricity bill',
          'Water bill',
          'Internet service',
          'Phone bill',
        ],
      _ => [
          'General transaction',
          'Miscellaneous payment',
          'Regular payment',
          'Service fee',
        ],
    };
    return descriptions[random.nextInt(descriptions.length)];
  }

  static FinancialTransaction _createTransaction({
    required double amount,
    required TransactionType type,
    required String category,
    required DateTime date,
    required String description,
    required String accountId,
    String? fromAccountId,
  }) {
    return FinancialTransaction(
      id: _uuid.v4(),
      amount: amount,
      type: type,
      category: category,
      date: date,
      description: description,
      accountId: accountId,
      fromAccountId: fromAccountId,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:mintmate/models/transaction.dart';

class CategoryIcons {
  static const Map<String, IconData> categoryIcons = {
    // Income categories
    'Salary': Icons.work,
    'Investment': Icons.trending_up,
    'Bonus': Icons.star,
    'Gift': Icons.card_giftcard,
    'Interest': Icons.account_balance,

    // Expense categories
    'Food & Dining': Icons.restaurant,
    'Groceries': Icons.shopping_cart,
    'Transportation': Icons.directions_car,
    'Shopping': Icons.shopping_bag,
    'Entertainment': Icons.movie,
    'Bills & Utilities': Icons.receipt_long,
    'Health': Icons.medical_services,
    'Education': Icons.school,
    'Travel': Icons.flight,
    'Housing': Icons.home,
    'Insurance': Icons.security,
    'Personal Care': Icons.spa,
    'Fitness': Icons.fitness_center,
    'Electronics': Icons.devices,
    'Clothing': Icons.checkroom,
    'Gifts & Donations': Icons.volunteer_activism,
    'Business': Icons.business,
    'Taxes': Icons.account_balance,
    'Other': Icons.more_horiz,
  };

  static IconData getIcon(String category) {
    return categoryIcons[category] ?? Icons.category;
  }

  static Color getIconColor(TransactionType type) {
    return type == TransactionType.income ? Colors.green : Colors.red;
  }

  static Color getIconBackgroundColor(TransactionType type) {
    return type == TransactionType.income
        ? Colors.green.withOpacity(0.1)
        : Colors.red.withOpacity(0.1);
  }
}

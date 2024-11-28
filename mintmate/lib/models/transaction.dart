import 'package:uuid/uuid.dart';

enum TransactionType { income, expense, transfer }

class FinancialTransaction {
  final String id;
  final double amount;
  final TransactionType type;
  final String category;
  final DateTime date;
  final String description;
  final String accountId;
  final String? fromAccountId;
  final String? tags;

  FinancialTransaction({
    required this.id,
    required this.amount,
    required this.type,
    required this.category,
    required this.date,
    required this.description,
    required this.accountId,
    this.fromAccountId,
    this.tags,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'amount': amount,
      'type': type.toString(),
      'category': category,
      'date': date.toIso8601String(),
      'description': description,
      'accountId': accountId,
      'fromAccountId': fromAccountId,
      'tags': tags,
    };
  }

  factory FinancialTransaction.fromMap(Map<String, dynamic> map) {
    return FinancialTransaction(
      id: map['id'],
      amount: map['amount'],
      type:
          TransactionType.values.firstWhere((e) => e.toString() == map['type']),
      category: map['category'],
      date: DateTime.parse(map['date']),
      description: map['description'],
      accountId: map['accountId'],
      fromAccountId: map['fromAccountId'],
      tags: map['tags'],
    );
  }
}

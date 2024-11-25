import 'package:uuid/uuid.dart';

enum TransactionType { income, expense, transfer }

class FinancialTransaction {
  final String id;
  final double amount;
  final String category;
  final DateTime date;
  final String description;
  final TransactionType type;
  final String accountId;
  final String? fromAccountId;

  FinancialTransaction({
    String? id,
    required this.amount,
    required this.category,
    required this.date,
    required this.description,
    required this.type,
    required this.accountId,
    this.fromAccountId,
  }) : id = id ?? const Uuid().v4();

  FinancialTransaction copyWith({
    String? id,
    double? amount,
    TransactionType? type,
    String? category,
    DateTime? date,
    String? description,
    String? accountId,
    String? fromAccountId,
  }) {
    return FinancialTransaction(
      id: id ?? this.id,
      amount: amount ?? this.amount,
      type: type ?? this.type,
      category: category ?? this.category,
      date: date ?? this.date,
      description: description ?? this.description,
      accountId: accountId ?? this.accountId,
      fromAccountId: fromAccountId ?? this.fromAccountId,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'amount': amount,
      'category': category,
      'date': date.toIso8601String(),
      'description': description,
      'type': type.toString(),
      'accountId': accountId,
      'fromAccountId': fromAccountId,
    };
  }

  factory FinancialTransaction.fromMap(Map<String, dynamic> map) {
    return FinancialTransaction(
      id: map['id'],
      amount: map['amount'],
      category: map['category'],
      date: DateTime.parse(map['date']),
      description: map['description'],
      type: TransactionType.values.firstWhere(
        (e) => e.toString() == map['type'],
      ),
      accountId: map['accountId'],
      fromAccountId: map['fromAccountId'],
    );
  }
}

import 'package:uuid/uuid.dart';

enum AccountType { checking, savings, investment, creditCard }

class Account {
  final String id;
  final String name;
  final AccountType type;
  final double balance;
  final String currency;

  Account({
    String? id,
    required this.name,
    required this.type,
    required this.balance,
    required this.currency,
  }) : id = id ?? const Uuid().v4();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'type': type.toString(),
      'balance': balance,
      'currency': currency,
    };
  }

  factory Account.fromMap(Map<String, dynamic> map) {
    return Account(
      id: map['id'],
      name: map['name'],
      type: AccountType.values.firstWhere(
        (e) => e.toString() == map['type'],
      ),
      balance: map['balance'],
      currency: map['currency'],
    );
  }
}

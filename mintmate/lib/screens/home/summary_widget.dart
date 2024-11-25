import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/account.dart';

class SummaryWidget extends StatelessWidget {
  final List<Account> accounts;

  const SummaryWidget({
    super.key,
    required this.accounts,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Account Summary',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ...accounts.map((account) => AccountSummaryItem(account: account)),
            const Divider(),
            TotalBalanceRow(accounts: accounts),
          ],
        ),
      ),
    );
  }
}

class AccountSummaryItem extends StatelessWidget {
  final Account account;
  final currencyFormatter = NumberFormat.currency(symbol: '\$');

  AccountSummaryItem({
    super.key,
    required this.account,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(
            _getIconForAccountType(account.type),
            color: _getColorForAccountType(account.type),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  account.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  account.type.toString().split('.').last.toUpperCase(),
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          Text(
            currencyFormatter.format(account.balance),
            style: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  IconData _getIconForAccountType(AccountType type) {
    switch (type) {
      case AccountType.checking:
        return Icons.account_balance_wallet;
      case AccountType.savings:
        return Icons.savings;
      case AccountType.investment:
        return Icons.trending_up;
      case AccountType.creditCard:
        return Icons.credit_card;
    }
  }

  Color _getColorForAccountType(AccountType type) {
    switch (type) {
      case AccountType.checking:
        return Colors.blue;
      case AccountType.savings:
        return Colors.green;
      case AccountType.investment:
        return Colors.purple;
      case AccountType.creditCard:
        return Colors.red;
    }
  }
}

class TotalBalanceRow extends StatelessWidget {
  final List<Account> accounts;
  final currencyFormatter = NumberFormat.currency(symbol: '\$');

  TotalBalanceRow({
    super.key,
    required this.accounts,
  });

  double get totalBalance {
    return accounts.fold(0, (sum, account) => sum + account.balance);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'Total Assets',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            currencyFormatter.format(totalBalance),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.green,
            ),
          ),
        ],
      ),
    );
  }
}

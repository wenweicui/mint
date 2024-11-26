import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/transaction.dart';

class TransactionListWidget extends StatelessWidget {
  final List<FinancialTransaction> transactions;
  final Function(FinancialTransaction) onDelete;
  final currencyFormatter = NumberFormat.currency(symbol: '\$');

  TransactionListWidget({
    super.key,
    required this.transactions,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    if (transactions.isEmpty) {
      return const Center(
        child: Text(
          'No transactions for this period',
          style: TextStyle(fontSize: 16),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(4),
      itemCount: transactions.length,
      itemBuilder: (context, index) {
        final transaction = transactions[index];
        final previousDate = index > 0 ? transactions[index - 1].date : null;

        // Show date header if it's the first item or different from previous date
        final showDateHeader = previousDate == null ||
            !DateUtils.isSameDay(transaction.date, previousDate);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (showDateHeader)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: Text(
                  DateFormat('EEEE, MMMM d').format(transaction.date),
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
            Dismissible(
              key: Key(transaction.id),
              direction: DismissDirection.endToStart,
              background: Container(
                color: Colors.red,
                alignment: Alignment.centerRight,
                padding: const EdgeInsets.only(right: 16),
                child: const Icon(
                  Icons.delete,
                  color: Colors.white,
                ),
              ),
              onDismissed: (_) => onDelete(transaction),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: transaction.type == TransactionType.income
                      ? Colors.green.withOpacity(0.2)
                      : Colors.red.withOpacity(0.2),
                  child: Icon(
                    transaction.type == TransactionType.income
                        ? Icons.add
                        : Icons.remove,
                    color: transaction.type == TransactionType.income
                        ? Colors.green
                        : Colors.red,
                  ),
                ),
                title: Text(transaction.description),
                subtitle: Text(transaction.category),
                trailing: Text(
                  currencyFormatter.format(transaction.amount),
                  style: TextStyle(
                    color: transaction.type == TransactionType.income
                        ? Colors.green
                        : Colors.red,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

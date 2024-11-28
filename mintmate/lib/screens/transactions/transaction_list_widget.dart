import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/transaction.dart';
import '../../utils/category_icons.dart';

class TransactionListWidget extends StatefulWidget {
  final List<FinancialTransaction> transactions;
  final Function(FinancialTransaction) onDelete;
  final DateTime selectedDate;
  final Function(DateTime) onMonthChanged;

  const TransactionListWidget({
    super.key,
    required this.transactions,
    required this.onDelete,
    required this.selectedDate,
    required this.onMonthChanged,
  });

  @override
  State<TransactionListWidget> createState() => _TransactionListWidgetState();
}

class _TransactionListWidgetState extends State<TransactionListWidget> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoadingMore = false;
  final currencyFormatter = NumberFormat.currency(symbol: '\$');

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_scrollListener);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_scrollListener);
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollListener() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 100) {
      _loadPreviousMonth();
    }
  }

  Future<void> _loadPreviousMonth() async {
    if (!_isLoadingMore) {
      setState(() {
        _isLoadingMore = true;
      });

      // Calculate previous month
      final previousMonth = DateTime(
        widget.selectedDate.year,
        widget.selectedDate.month - 1,
        1,
      );

      // Notify parent to change month
      widget.onMonthChanged(previousMonth);

      setState(() {
        _isLoadingMore = false;
      });
    }
  }

  String _getFormattedDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final transactionDate = DateTime(date.year, date.month, date.day);

    if (transactionDate == today) {
      return 'Today';
    } else if (transactionDate == yesterday) {
      return 'Yesterday';
    }
    return DateFormat('EEEE, MMMM d').format(date);
  }

  @override
  Widget build(BuildContext context) {
    if (widget.transactions.isEmpty) {
      return const Center(
        child: Text(
          'No transactions for this period',
          style: TextStyle(fontSize: 16),
        ),
      );
    }

    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(4),
      itemCount: widget.transactions.length + 1, // +1 for loading indicator
      itemBuilder: (context, index) {
        if (index == widget.transactions.length) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: Center(
              child: _isLoadingMore
                  ? const CircularProgressIndicator()
                  : const Text('Pull to load more'),
            ),
          );
        }

        final transaction = widget.transactions[index];
        final previousDate =
            index > 0 ? widget.transactions[index - 1].date : null;

        final showDateHeader = previousDate == null ||
            !DateUtils.isSameDay(transaction.date, previousDate);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (showDateHeader)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: Text(
                  _getFormattedDate(transaction.date),
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
              onDismissed: (_) => widget.onDelete(transaction),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor:
                      CategoryIcons.getIconBackgroundColor(transaction.type),
                  child: Icon(
                    CategoryIcons.getIcon(transaction.category),
                    color: CategoryIcons.getIconColor(transaction.type),
                  ),
                ),
                title: Text(transaction.description),
                subtitle: Row(
                  children: [
                    Icon(
                      transaction.type == TransactionType.income
                          ? Icons.arrow_downward
                          : Icons.arrow_upward,
                      size: 14,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Text(transaction.category),
                  ],
                ),
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

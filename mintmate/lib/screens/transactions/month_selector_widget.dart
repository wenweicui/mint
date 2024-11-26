import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class MonthSelectorWidget extends StatelessWidget {
  final DateTime selectedDate;
  final Function(DateTime) onMonthSelected;

  const MonthSelectorWidget({
    super.key,
    required this.selectedDate,
    required this.onMonthSelected,
  });

  @override
  Widget build(BuildContext context) {
    // Calculate if we're in the current month
    final now = DateTime.now();
    final isCurrentMonth =
        selectedDate.year == now.year && selectedDate.month == now.month;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      color: Theme.of(context).primaryColor.withOpacity(0.1),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: () => _changeMonth(context, -1),
          ),
          GestureDetector(
            onTap: () => _showMonthPicker(context),
            child: Text(
              DateFormat('MMMM yyyy').format(selectedDate),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            // Disable the button if we're in the current month
            onPressed: isCurrentMonth ? null : () => _changeMonth(context, 1),
          ),
        ],
      ),
    );
  }

  void _changeMonth(BuildContext context, int monthDelta) {
    final newDate = DateTime(
      selectedDate.year,
      selectedDate.month + monthDelta,
      1,
    );
    onMonthSelected(newDate);
  }

  void _showMonthPicker(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      initialDatePickerMode: DatePickerMode.year,
    );

    if (picked != null) {
      onMonthSelected(DateTime(picked.year, picked.month, 1));
    }
  }
}

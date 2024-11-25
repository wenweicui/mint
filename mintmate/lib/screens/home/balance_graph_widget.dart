import 'dart:math';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/transaction_provider.dart';
import '../../models/transaction.dart';
import '../../models/time_range.dart';
import '../../providers/selected_range_provider.dart';

class BalanceGraphWidget extends ConsumerWidget {
  const BalanceGraphWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedRange = ref.watch(selectedRangeProvider);
    final transactions = ref.watch(transactionsProvider);
    final balanceData = _calculateBalances(transactions, selectedRange);

    return SizedBox(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTotalAmounts(balanceData),
            const SizedBox(height: 16),
            SizedBox(
              height: 100,
              child: _buildChart(balanceData, selectedRange),
            ),
            const SizedBox(height: 16),
            _buildSegmentedButtons(ref, selectedRange),
          ],
        ),
      ),
    );
  }

  Widget _buildSegmentedButtons(WidgetRef ref, TimeRange selectedRange) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 8),
        SizedBox(
          width: double.maxFinite,
          child: SegmentedButton<TimeRange>(
            segments: TimeRange.values
                .map((range) => ButtonSegment(
                      value: range,
                      label: Text(range.label,
                          style: const TextStyle(fontSize: 12)),
                    ))
                .toList(),
            selected: {selectedRange},
            onSelectionChanged: (Set<TimeRange> selected) {
              ref.read(selectedRangeProvider.notifier).setRange(selected.first);
            },
            showSelectedIcon: false,
            style: const ButtonStyle(
              visualDensity: VisualDensity.compact,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTotalAmounts(BalanceData data) {
    final totalIncome = data.income.reduce((a, b) => a + b);
    final totalSpending = data.spending.reduce((a, b) => a + b);

    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        _buildAmountDisplay('Income', totalIncome, Colors.blue.shade300),
        const SizedBox(width: 24),
        _buildAmountDisplay('Spending', totalSpending, Colors.blue.shade700),
      ],
    );
  }

  Widget _buildAmountDisplay(String label, double amount, Color color) {
    final formatter = NumberFormat.currency(symbol: '\$');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        Text(
          formatter.format(amount),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildChart(BalanceData data, TimeRange selectedRange) {
    return LineChart(
      LineChartData(
        gridData: const FlGridData(show: false),
        titlesData: _getTitlesData(selectedRange),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          _createLineData(data.income, Colors.blue.shade300),
          _createLineData(data.spending, Colors.blue.shade700),
        ],
        lineTouchData: LineTouchData(
          touchTooltipData: LineTouchTooltipData(
            tooltipBgColor: Colors.blueGrey.shade900,
            getTooltipItems: (touchedSpots) {
              return touchedSpots.map((spot) {
                return LineTooltipItem(
                  '\$${spot.y.toStringAsFixed(2)}',
                  TextStyle(
                    color: spot.bar.color,
                    fontWeight: FontWeight.bold,
                  ),
                );
              }).toList();
            },
          ),
        ),
      ),
    );
  }

  LineChartBarData _createLineData(List<double> data, Color color) {
    return LineChartBarData(
      spots: data.asMap().entries.map((e) {
        return FlSpot(e.key.toDouble(), e.value);
      }).toList(),
      isCurved: true,
      color: color,
      barWidth: 3,
      dotData: const FlDotData(show: false),
      belowBarData: BarAreaData(
        show: true,
        color: color.withOpacity(0.1),
      ),
    );
  }

  FlTitlesData _getTitlesData(TimeRange selectedRange) {
    return FlTitlesData(
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 22,
          interval: 1,
          getTitlesWidget: (value, meta) {
            if (value != value.roundToDouble()) {
              return const SizedBox.shrink();
            }

            if (selectedRange == TimeRange.month) {
              final day = value.toInt() + 1;
              if (day % 5 != 0 && day != 1) {
                return const SizedBox.shrink();
              }
            }

            return Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text(
                _getAxisLabel(value.toInt(), selectedRange),
                style: const TextStyle(fontSize: 12),
              ),
            );
          },
        ),
      ),
      leftTitles: const AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
      rightTitles: const AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
      topTitles: const AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
    );
  }

  String _getAxisLabel(int index, TimeRange selectedRange) {
    final startDate = _getStartDate(selectedRange);
    return switch (selectedRange) {
      TimeRange.week =>
        DateFormat('E').format(startDate.add(Duration(days: index))),
      TimeRange.month =>
        DateFormat('d').format(startDate.add(Duration(days: index))),
      TimeRange.quarter => DateFormat('MMM')
          .format(DateTime(startDate.year, startDate.month + index)),
      TimeRange.year => DateFormat('MMM')
          .format(DateTime(startDate.year, startDate.month + index)),
    };
  }

  static BalanceData _calculateBalances(
      List<FinancialTransaction> transactions, TimeRange selectedRange) {
    final dateRange = selectedRange.getDateRange();
    final filteredTransactions = transactions
        .where((t) =>
            t.date.isAfter(dateRange.start.subtract(const Duration(days: 1))) &&
            t.date.isBefore(dateRange.end.add(const Duration(days: 1))))
        .toList();

    // Sort transactions by date
    filteredTransactions.sort((a, b) => a.date.compareTo(b.date));

    final Map<int, double> incomeByPeriod = {};
    final Map<int, double> spendingByPeriod = {};

    double cumulativeIncome = 0;
    double cumulativeSpending = 0;

    // Initialize all periods with 0
    final periods = selectedRange.getPeriodCount();

    // Initialize all periods with starting values
    for (int i = 0; i < periods; i++) {
      incomeByPeriod[i] = 0;
      spendingByPeriod[i] = 0;
    }

    // Calculate cumulative values
    for (var transaction in filteredTransactions) {
      final periodKey = _getPeriodKey(transaction.date, selectedRange);

      if (transaction.type == TransactionType.income) {
        cumulativeIncome += transaction.amount;
      } else if (transaction.type == TransactionType.expense) {
        cumulativeSpending += transaction.amount;
      }

      // Update all subsequent periods with the current cumulative values
      for (int i = periodKey; i < periods; i++) {
        incomeByPeriod[i] = cumulativeIncome;
        spendingByPeriod[i] = cumulativeSpending;
      }
    }

    return BalanceData(
      income: _normalizeData(incomeByPeriod, selectedRange),
      spending: _normalizeData(spendingByPeriod, selectedRange),
    );
  }

  static DateTime _getStartDate(TimeRange selectedRange) {
    final now = DateTime.now();
    return switch (selectedRange) {
      TimeRange.week => now.subtract(const Duration(days: 6)),
      TimeRange.month => DateTime(now.year, now.month, 1),
      TimeRange.quarter => DateTime(now.year, now.month - 2, 1),
      TimeRange.year => DateTime(now.year, 1, 1),
    };
  }

  static int _getPeriodKey(DateTime date, TimeRange selectedRange) {
    final startDate = _getStartDate(selectedRange);
    return switch (selectedRange) {
      TimeRange.week => date.difference(startDate).inDays,
      TimeRange.month => date.difference(startDate).inDays,
      TimeRange.quarter => date.month - startDate.month,
      TimeRange.year => date.month - startDate.month,
    };
  }

  static List<double> _normalizeData(
      Map<int, double> data, TimeRange selectedRange) {
    final now = DateTime.now();
    final startDate = _getStartDate(selectedRange);

    final int periods = switch (selectedRange) {
      TimeRange.week => 7,
      TimeRange.month => min(31, now.day),
      TimeRange.quarter => min(3, now.month - startDate.month + 1),
      TimeRange.year => now.month,
    };

    return List.generate(periods, (index) => data[index] ?? 0.0);
  }
}

class BalanceData {
  final List<double> income;
  final List<double> spending;

  BalanceData({required this.income, required this.spending});
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../models/time_range.dart';

class TrendChart extends ConsumerStatefulWidget {
  const TrendChart({super.key});

  @override
  ConsumerState<TrendChart> createState() => _TrendChartState();
}

class _TrendChartState extends ConsumerState<TrendChart> {
  TimeRange _selectedRange = TimeRange.month;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Income & Spending Trend',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SegmentedButton<TimeRange>(
                  segments: const [
                    ButtonSegment(value: TimeRange.week, label: Text('Week')),
                    ButtonSegment(value: TimeRange.month, label: Text('Month')),
                    ButtonSegment(value: TimeRange.year, label: Text('Year')),
                  ],
                  selected: {_selectedRange},
                  onSelectionChanged: (Set<TimeRange> selected) {
                    setState(() {
                      _selectedRange = selected.first;
                    });
                  },
                  style: const ButtonStyle(
                    visualDensity: VisualDensity.compact,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            // const SizedBox(
            //   height: 200,
            //   child: LineChart(
            //       // ... Your existing line chart configuration
            //       ),
            // ),
          ],
        ),
      ),
    );
  }
}

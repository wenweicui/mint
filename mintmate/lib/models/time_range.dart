import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

enum TimeRange {
  week,
  month,
  quarter,
  year;

  String get label => switch (this) {
        TimeRange.week => 'Week',
        TimeRange.month => 'Month',
        TimeRange.quarter => 'Quarter',
        TimeRange.year => 'Year',
      };

  DateTimeRange getDateRange() {
    final now = DateTime.now();
    final start = switch (this) {
      TimeRange.week => now.subtract(const Duration(days: 6)),
      TimeRange.month => DateTime(now.year, now.month, 1),
      TimeRange.quarter => DateTime(now.year, now.month - 2, 1),
      TimeRange.year => DateTime(now.year, 1, 1),
    };
    return DateTimeRange(start: start, end: now);
  }

  int getPeriodCount() {
    final now = DateTime.now();
    final range = getDateRange();
    return switch (this) {
      TimeRange.week => 7,
      TimeRange.month => now.difference(range.start).inDays + 1,
      TimeRange.quarter => 3,
      TimeRange.year => now.month,
    };
  }

  String formatDate(DateTime date) {
    return switch (this) {
      TimeRange.week => DateFormat('E').format(date),
      TimeRange.month => DateFormat('d').format(date),
      TimeRange.quarter => DateFormat('MMM').format(date),
      TimeRange.year => DateFormat('MMM').format(date),
    };
  }
}

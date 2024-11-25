import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/time_range.dart';

class SelectedRangeNotifier extends StateNotifier<TimeRange> {
  SelectedRangeNotifier() : super(TimeRange.month);

  void setRange(TimeRange range) {
    state = range;
  }

  DateTimeRange getSelectedDateRange() {
    return state.getDateRange();
  }

  int getSelectedPeriodCount() {
    return state.getPeriodCount();
  }

  String formatDate(DateTime date) {
    return state.formatDate(date);
  }
}

final selectedRangeProvider =
    StateNotifierProvider<SelectedRangeNotifier, TimeRange>((ref) {
  return SelectedRangeNotifier();
});

// Convenience providers for derived data
final selectedDateRangeProvider = Provider<DateTimeRange>((ref) {
  final selectedRange = ref.watch(selectedRangeProvider);
  return selectedRange.getDateRange();
});

final selectedPeriodCountProvider = Provider<int>((ref) {
  final selectedRange = ref.watch(selectedRangeProvider);
  return selectedRange.getPeriodCount();
});

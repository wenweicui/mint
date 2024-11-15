import { useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { LineChart, PieChart } from 'react-native-chart-kit';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CategoryRankingList } from '@/components/reports/CategoryRankingList';
import { ChartPeriodPicker } from '@/components/reports/ChartPeriodPicker';
import { useReports } from '@/hooks/useReports';
import { SummaryCard } from '@/components/reports/SummaryCard';
import { ChartCard } from '@/components/reports/ChartCard';
import { PeriodType } from '@/types/reports';

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isLoading, error, reportData, generateReport } = useReports();
  const [refreshing, setRefreshing] = useState(false);
  const loadReport = useCallback(async () => {      
    await generateReport(periodType as PeriodType, selectedDate);
  }, [periodType, selectedDate, generateReport]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadReport();
    } finally {
      setRefreshing(false);
    }
  }, [loadReport]);

  const periodLabel = periodType === 'monthly'
    ? format(selectedDate, 'MMMM yyyy')
    : format(selectedDate, 'yyyy');

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Financial Reports</ThemedText>
        
        <SegmentedControl
          values={['Monthly', 'Annual']}
          selectedIndex={periodType === 'monthly' ? 0 : 1}
          onChange={(event) => {
            setPeriodType(
              event.nativeEvent.selectedSegmentIndex === 0 ? 'monthly' : 'yearly'
            );
          }}
          style={styles.segmentedControl}
        />

        <ChartPeriodPicker
          periodType={periodType}
          selectedPeriod={selectedDate}
          onPeriodChange={setSelectedDate}
        />
      </ThemedView>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <SummaryCard
          title="Income"
          amount={reportData?.summary.totalIncome ?? 0}
          trend={reportData?.summary.incomeTrend ?? 0}
          color="#10B981"
        />
        <SummaryCard
          title="Expenses"
          amount={reportData?.summary.totalExpenses ?? 0}
          trend={reportData?.summary.expensesTrend ?? 0}
          trendType="positive-down"
          color="#EF4444"
        />
      </View>

      {/* Charts */}
      <ChartCard
        title="Income vs Expenses"
        subtitle={periodLabel}
        loading={isLoading}
        error={error?.message}
        style={styles.chartContainer}
      >
        <LineChart
          data={reportData?.lineChartData ?? { labels: [], datasets: [] }}
          width={Number(styles.chart.width)}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={styles.chart}
        />
      </ChartCard>

      <ChartCard
        title="Expense Categories"
        subtitle={periodLabel}
        loading={isLoading}
        error={error?.message}
        style={styles.chartContainer}
      >
        <PieChart
          data={reportData?.pieChartData ?? []}
          width={Number(styles.chart.width)}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </ChartCard>

      {/* Category Rankings */}
      <ThemedView style={styles.categoriesContainer}>
        <ThemedText style={styles.sectionTitle}>Top Categories</ThemedText>
        <CategoryRankingList
          categories={reportData?.categoryRankings ?? []}
          isLoading={isLoading}
          error={error?.message as string}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  segmentedControl: {
    marginVertical: 8,
  },
  chartContainer: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    width: '100%',
    borderRadius: 16,
  },
  summaryContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriesContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});

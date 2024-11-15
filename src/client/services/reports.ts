import { Transaction } from '@/types';
import { 
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  subMonths,
  subYears,
  format,
  eachDayOfInterval,
  eachMonthOfInterval
} from 'date-fns';
import { 
  PeriodType,
  LineChartData,
  PieChartData,
  CategoryRanking,
  PeriodSummary,
  ReportData,
  MerchantFrequency
} from '@/types/reports';

const COLORS = [
  '#2563EB', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
];

class ReportsService {
  private static instance: ReportsService;

  private constructor() {}

  public static getInstance(): ReportsService {
    if (!ReportsService.instance) {
      ReportsService.instance = new ReportsService();
    }
    return ReportsService.instance;
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  public async generateReport(
    transactions: Transaction[],
    periodType: PeriodType,
    date: Date
  ): Promise<ReportData> {
    const startDate = periodType === 'monthly' ? startOfMonth(date) : startOfYear(date);
    const endDate = periodType === 'monthly' ? endOfMonth(date) : endOfYear(date);
    const periodTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: startDate, end: endDate })
    );

    return {
      lineChartData: this.generateLineChartData(transactions, startDate, endDate, periodType),
      pieChartData: this.generatePieChartData(periodTransactions),
      categoryRankings: this.generateCategoryRankings(periodTransactions),
      summary: this.generatePeriodSummary(transactions, startDate, endDate, periodType),
      periodType,
      startDate,
      endDate
    };
  }

  private generateLineChartData(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    periodType: PeriodType
  ): LineChartData {
    const intervals = periodType === 'monthly' 
      ? eachDayOfInterval({ start: startDate, end: endDate })
      : eachMonthOfInterval({ start: startDate, end: endDate });

    const labels = intervals.map(date => 
      periodType === 'monthly' ? format(date, 'd') : format(date, 'MMM')
    );

    const data = intervals.map(date => {
      const dailyTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return periodType === 'monthly'
          ? format(tDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          : format(tDate, 'yyyy-MM') === format(date, 'yyyy-MM');
      });

      return dailyTransactions.reduce((sum, t) => 
        t.type === 'expense' ? sum - t.amount : sum + t.amount, 0
      );
    });

    return {
      labels,
      datasets: [{
        data,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2
      }]
    };
  }

  private generatePieChartData(transactions: Transaction[]): PieChartData[] {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        t.category.forEach(cat => {
          acc[cat] = (acc[cat] || 0) + t.amount;
        });
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expensesByCategory)
      .map(([category, amount], index) => ({
        name: category,
        amount,
        color: COLORS[index % COLORS.length],
        legendFontColor: '#666',
        legendFontSize: 12,
      }));
  }

  private generatePeriodSummary(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    periodType: PeriodType
  ): PeriodSummary {
    const currentPeriodTxs = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: startDate, end: endDate })
    );

    const previousStartDate = periodType === 'monthly' 
      ? subMonths(startDate, 1)
      : subYears(startDate, 1);
    const previousEndDate = periodType === 'monthly'
      ? endOfMonth(previousStartDate)
      : endOfYear(previousStartDate);
    const previousPeriodTxs = transactions.filter(t =>
      isWithinInterval(new Date(t.date), { start: previousStartDate, end: previousEndDate })
    );

    const totalIncome = currentPeriodTxs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentPeriodTxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousIncome = previousPeriodTxs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousExpenses = previousPeriodTxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const largestExpense = currentPeriodTxs
      .filter(t => t.type === 'expense')
      .reduce((max, t) => t.amount > max.amount ? t : max, currentPeriodTxs[0] || {
        id: '',
        type: 'expense',
        amount: 0,
        category: [],
        date: new Date(),
        userId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const merchantFrequency = currentPeriodTxs.reduce((acc, t) => {
      if (!t.merchantName) return acc;
      if (!acc[t.merchantName]) {
        acc[t.merchantName] = { count: 0, totalAmount: 0 };
      }
      acc[t.merchantName].count++;
      acc[t.merchantName].totalAmount += t.amount;
      return acc;
    }, {} as Record<string, { count: number; totalAmount: number }>);

    const mostFrequentMerchant = Object.entries(merchantFrequency)
      .reduce((max, [name, data]) => 
        data.count > max.count ? { name, ...data } : max,
        { name: '', count: 0, totalAmount: 0 }
      );

    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      incomeTrend: this.calculateTrend(totalIncome, previousIncome),
      expensesTrend: this.calculateTrend(totalExpenses, previousExpenses),
      savingsTrend: this.calculateTrend(
        totalIncome - totalExpenses,
        previousIncome - previousExpenses
      ),
      averageDailyExpense: totalExpenses / eachDayOfInterval({ start: startDate, end: endDate }).length,
      largestExpense,
      mostFrequentMerchant
    };
  }

  private generateCategoryRankings(transactions: Transaction[]): CategoryRanking[] {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        t.category.forEach(cat => {
          if (!acc[cat]) {
            acc[cat] = {
              category: cat,
              totalAmount: 0,
              transactionCount: 0,
              averageAmount: 0,
              percentage: 0,
              rank: 0,
            };
          }
          acc[cat].totalAmount += t.amount;
          acc[cat].transactionCount++;
        });
        return acc;
      }, {} as Record<string, CategoryRanking>);

    return Object.values(categoryTotals)
      .map(ranking => ({
        ...ranking,
        averageAmount: ranking.totalAmount / ranking.transactionCount,
        percentage: 0,
        rank: 0,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }
}

export default ReportsService.getInstance(); 
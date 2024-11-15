import { Transaction } from '.';

export type PeriodType = 'monthly' | 'yearly';

export type ChartType = 'line' | 'pie';

export interface ChartDataPoint {
  value: number;
  label: string;
}

export interface LineChartDataset {
  data: number[];
  color: (opacity?: number) => string;
  strokeWidth: number;
}

export interface LineChartData {
  labels: string[];
  datasets: LineChartDataset[];
}

export interface PieChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface CategoryRanking {
  category: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  percentage: number;
  rank: number;
}

export interface MerchantFrequency {
  name: string;
  count: number;
  totalAmount: number;
}

export interface PeriodSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  incomeTrend: number;
  expensesTrend: number;
  savingsTrend: number;
  averageDailyExpense: number;
  largestExpense: Partial<Transaction>;
  mostFrequentMerchant: MerchantFrequency;
}

export interface ReportData {
  lineChartData: LineChartData;
  pieChartData: PieChartData[];
  categoryRankings: CategoryRanking[];
  summary: PeriodSummary;
  periodType: PeriodType;
  startDate: Date;
  endDate: Date;
}
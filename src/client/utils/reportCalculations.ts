import { Transaction } from '@/types';
import { PeriodType } from '@/types/reports';
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  isWithinInterval,
} from 'date-fns';

interface ChartData {
  lineChartData: {
    labels: string[];
    datasets: [
      {
        data: number[];
        color?: (opacity: number) => string;
        strokeWidth?: number;
      }
    ];
  };
  pieChartData: Array<{
    name: string;
    value: number;
    color: string;
    legendFontColor: string;
  }>;
  totalIncome: number;
  totalExpenses: number;
  incomeTrend: number; // percentage change from previous period
  expensesTrend: number; // percentage change from previous period
}

interface CategoryRanking {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

// Color palette for pie chart
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

export function calculateMonthlyData(transactions: Transaction[], selectedDate: Date): ChartData {
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);
  const previousStartDate = startOfMonth(new Date(startDate.getFullYear(), startDate.getMonth() - 1));
  const previousEndDate = endOfMonth(new Date(startDate.getFullYear(), startDate.getMonth() - 1));

  // Get daily intervals for the month
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Initialize daily totals
  const dailyTotals = days.map(() => 0);
  let totalIncome = 0;
  let totalExpenses = 0;
  let previousTotalExpenses = 0;

  // Calculate current month totals
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    if (isWithinInterval(transactionDate, { start: startDate, end: endDate })) {
      const dayIndex = transactionDate.getDate() - 1;
      const amount = Math.abs(transaction.amount);
      
      if (transaction.amount > 0) {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        dailyTotals[dayIndex] += amount;
      }
    }
    // Calculate previous month expenses for trend
    else if (isWithinInterval(transactionDate, { start: previousStartDate, end: previousEndDate })) {
      if (transaction.amount < 0) {
        previousTotalExpenses += Math.abs(transaction.amount);
      }
    }
  });

  // Calculate trends
  const expensesTrend = previousTotalExpenses === 0 
    ? 100 
    : ((totalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100;

  return {
    lineChartData: {
      labels: days.map(day => format(day, 'd')),
      datasets: [
        {
          data: dailyTotals,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    },
    pieChartData: [
      {
        name: 'Income',
        value: totalIncome,
        color: '#10B981',
        legendFontColor: '#666666',
      },
      {
        name: 'Expenses',
        value: totalExpenses,
        color: '#EF4444',
        legendFontColor: '#666666',
      },
    ],
    totalIncome,
    totalExpenses,
    incomeTrend: 0, // Implement if needed
    expensesTrend,
  };
}

export function calculateAnnualData(transactions: Transaction[], selectedDate: Date): ChartData {
  const startDate = startOfYear(selectedDate);
  const endDate = endOfYear(selectedDate);
  const previousStartDate = startOfYear(new Date(startDate.getFullYear() - 1));
  const previousEndDate = endOfYear(new Date(startDate.getFullYear() - 1));

  // Get monthly intervals
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  // Initialize monthly totals
  const monthlyTotals = months.map(() => 0);
  let totalIncome = 0;
  let totalExpenses = 0;
  let previousTotalExpenses = 0;

  // Calculate current year totals
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    if (isWithinInterval(transactionDate, { start: startDate, end: endDate })) {
      const monthIndex = transactionDate.getMonth();
      const amount = Math.abs(transaction.amount);
      
      if (transaction.amount > 0) {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        monthlyTotals[monthIndex] += amount;
      }
    }
    // Calculate previous year expenses for trend
    else if (isWithinInterval(transactionDate, { start: previousStartDate, end: previousEndDate })) {
      if (transaction.amount < 0) {
        previousTotalExpenses += Math.abs(transaction.amount);
      }
    }
  });

  // Calculate trends
  const expensesTrend = previousTotalExpenses === 0 
    ? 100 
    : ((totalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100;

  return {
    lineChartData: {
      labels: months.map(month => format(month, 'MMM')),
      datasets: [
        {
          data: monthlyTotals,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    },
    pieChartData: [
      {
        name: 'Income',
        value: totalIncome,
        color: '#10B981',
        legendFontColor: '#666666',
      },
      {
        name: 'Expenses',
        value: totalExpenses,
        color: '#EF4444',
        legendFontColor: '#666666',
      },
    ],
    totalIncome,
    totalExpenses,
    incomeTrend: 0, // Implement if needed
    expensesTrend,
  };
}

export function calculateCategoryRankings(
  transactions: Transaction[],
  periodType: PeriodType,
  selectedDate: Date
): CategoryRanking[] {
  const startDate = periodType === 'monthly' 
    ? startOfMonth(selectedDate) 
    : startOfYear(selectedDate);
  const endDate = periodType === 'monthly' 
    ? endOfMonth(selectedDate) 
    : endOfYear(selectedDate);

  // Initialize category map
  const categoryMap = new Map<string, { amount: number; count: number }>();
  let totalExpenses = 0;

  // Calculate totals by category
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    if (
      isWithinInterval(transactionDate, { start: startDate, end: endDate }) &&
      transaction.amount < 0 // Only consider expenses
    ) {
      const amount = Math.abs(transaction.amount);
      totalExpenses += amount;

      transaction.category.forEach(cat => {
        const existing = categoryMap.get(cat) || { amount: 0, count: 0 };
        categoryMap.set(cat, {
          amount: existing.amount + amount,
          count: existing.count + 1,
        });
      });
    }
  });

  // Convert to array and calculate percentages
  const rankings = Array.from(categoryMap.entries())
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      count,
      percentage: (amount / totalExpenses) * 100,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10); // Get top 10 categories

  return rankings;
}

// Helper function to get a color for a category
export function getCategoryColor(index: number): string {
  return COLORS[index % COLORS.length];
}

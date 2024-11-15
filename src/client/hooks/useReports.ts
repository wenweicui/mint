import { useState, useCallback } from 'react';
import { useTransactionStore } from '@/store/useTransactionStore';
import reportsService from '@/services/reports';
import { ReportData, PeriodType } from '@/types/reports';

export function useReports() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const transactions = useTransactionStore(state => state.transactions);

  const generateReport = useCallback(async (
    periodType: PeriodType,
    date: Date
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await reportsService.generateReport(
        transactions,
        periodType,
        date
      );
      setReportData(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate report');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  const clearReport = useCallback(() => {
    setReportData(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    reportData,
    generateReport,
    clearReport,
  };
}
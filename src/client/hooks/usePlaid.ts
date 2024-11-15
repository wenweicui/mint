import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useTransactionStore } from '@/store/useTransactionStore';

export const usePlaid = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

  const generateLinkToken = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.post<{ link_token: string }>('/plaid/create-link-token');
      setLinkToken(response.data.link_token);
    } catch (error) {
      console.error('Failed to generate link token:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSuccess = useCallback(async (publicToken: string) => {
    try {
      await api.post('/plaid/exchange-public-token', { public_token: publicToken });
      // Refresh transactions
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to exchange public token:', error);
    }
  }, [fetchTransactions]);

  return {
    linkToken,
    loading,
    generateLinkToken,
    handleSuccess,
  };
}; 
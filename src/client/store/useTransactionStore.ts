import { create } from 'zustand';
import { Transaction, ApiError } from '@/types';
import { api } from '@/services/api';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: ApiError | null;
  selectedTransaction: Transaction | null;
  fetchTransactions: (params?: { 
    startDate?: string; 
    endDate?: string;
    category?: string;
  }) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  selectTransaction: (transaction: Transaction | null) => void;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  selectedTransaction: null,

  fetchTransactions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Transaction[]>('/transactions', { 
        params 
      });
      set({ transactions: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: {
          message: error.message || 'Failed to fetch transactions',
          code: error.code
        }, 
        isLoading: false 
      });
    }
  },

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<Transaction>('/transactions', transaction);
      set((state) => ({
        transactions: [...state.transactions, data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: {
          message: error.message || 'Failed to add transaction',
          code: error.code
        }, 
        isLoading: false 
      });
    }
  },

  updateTransaction: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<Transaction>(`/transactions/${id}`, data);
      set((state) => ({
        transactions: state.transactions.map((t) => 
          t.id === id ? response.data : t
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: {
          message: error.message || 'Failed to update transaction',
          code: error.code
        }, 
        isLoading: false 
      });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: {
          message: error.message || 'Failed to delete transaction',
          code: error.code
        }, 
        isLoading: false 
      });
    }
  },

  selectTransaction: (transaction) => {
    set({ selectedTransaction: transaction });
  },

  clearError: () => set({ error: null })
}));

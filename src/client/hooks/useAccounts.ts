import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '@/api/accounts';

export function useAccounts() {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getAccounts,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  const createAccount = useMutation({
    mutationFn: accountApi.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
    },
  });

  return {
    accounts,
    isLoading,
    createAccount,
  };
} 
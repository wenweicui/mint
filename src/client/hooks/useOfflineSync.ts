import { useNetInfo } from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useOfflineSync() {
  const netInfo = useNetInfo();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (netInfo.isConnected) {
      // Sync pending transactions
      queryClient.invalidateQueries(['accounts']);
      queryClient.invalidateQueries(['transactions']);
    }
  }, [netInfo.isConnected]);
} 
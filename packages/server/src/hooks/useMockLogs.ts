import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createMockarioApi } from './api';
import type { RequestLog } from '../types';

export interface UseMockLogsReturn {
  logs: RequestLog[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
  clear: () => Promise<void>;
}

export function useMockLogs(baseUrl: string): UseMockLogsReturn {
  const [api] = useState(() => createMockarioApi(baseUrl));
  const queryClient = useQueryClient();

  const logsQuery = useQuery({
    queryKey: ['mockario', 'logs'],
    queryFn: () => api.getLogs(),
    staleTime: 5000,
    refetchInterval: 10000,
  });

  const clearMutation = useMutation({
    mutationFn: () => api.clearLogs(),
    onSuccess: () => {
      queryClient.setQueryData(['mockario', 'logs'], []);
    },
  });

  return {
    logs: logsQuery.data ?? [],
    isLoading: logsQuery.isLoading,
    isFetching: logsQuery.isFetching,
    error: logsQuery.error,
    refetch: logsQuery.refetch,
    clear: clearMutation.mutateAsync,
  };
}

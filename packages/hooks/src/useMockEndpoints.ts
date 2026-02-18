import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createMocklyApi } from './api';
import type { MockEndpoint, CreateEndpointDto } from './types';

export interface UseMockEndpointsOptions {
  baseUrl: string;
}

export interface UseMockEndpointsReturn {
  endpoints: MockEndpoint[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
  create: (dto: CreateEndpointDto) => Promise<MockEndpoint>;
  update: (id: string, dto: Partial<CreateEndpointDto>) => Promise<MockEndpoint>;
  remove: (id: string) => Promise<void>;
}

export function useMockEndpoints(baseUrl: string): UseMockEndpointsReturn {
  const [api] = useState(() => createMocklyApi(baseUrl));
  const queryClient = useQueryClient();

  const endpointsQuery = useQuery({
    queryKey: ['mockly', 'endpoints'],
    queryFn: () => api.getEndpoints(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateEndpointDto) => api.createEndpoint(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockly', 'endpoints'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateEndpointDto> }) =>
      api.updateEndpoint(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockly', 'endpoints'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteEndpoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockly', 'endpoints'] });
    },
  });

  return {
    endpoints: endpointsQuery.data ?? [],
    isLoading: endpointsQuery.isLoading,
    isFetching: endpointsQuery.isFetching,
    error: endpointsQuery.error,
    refetch: endpointsQuery.refetch,
    create: createMutation.mutateAsync,
    update: (id: string, dto: Partial<CreateEndpointDto>) =>
      updateMutation.mutateAsync({ id, dto }),
    remove: deleteMutation.mutateAsync,
  };
}

export function useMockEndpoint(baseUrl: string, id: string) {
  const [api] = useState(() => createMocklyApi(baseUrl));

  return useQuery({
    queryKey: ['mockly', 'endpoint', id],
    queryFn: () => api.getEndpoint(id),
    enabled: !!id,
  });
}

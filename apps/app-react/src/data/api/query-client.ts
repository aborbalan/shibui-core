import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minutos de cache en background
      staleTime: 5 * 60 * 1000,
      // No reintentar en errores de cliente (4xx)
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Reintento único en errores de servidor
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});
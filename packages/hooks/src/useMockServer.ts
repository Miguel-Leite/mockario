import { useEffect, useState } from 'react';
import { createMockarioApi } from './api';

export interface UseMockServerReturn {
  isConnected: boolean;
  isChecking: boolean;
  serverUrl: string;
  port: number;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMockServer(baseUrl: string): UseMockServerReturn {
  const [api] = useState(() => createMockarioApi(baseUrl));
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const connected = await api.testConnection();
      setIsConnected(connected);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err : new Error('Connection failed'));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [baseUrl]);

  const port = parseInt(baseUrl.split(':').pop() || '3001', 10);

  return {
    isConnected,
    isChecking,
    serverUrl: baseUrl,
    port,
    error,
    refetch: checkConnection,
  };
}

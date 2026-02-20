import { Header } from '@/components/Header';
import { HttpClient } from '@/components/HttpClient';
import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export function HttpClientPage() {
  const [serverConnected, setServerConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.get('/endpoints');
        setServerConnected(true);
      } catch {
        setServerConnected(false);
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header serverConnected={serverConnected} />
      <main className="container mx-auto px-4 py-6 h-[calc(100vh-64px)]">
        <h2 className="text-xl font-semibold mb-4">HTTP Client</h2>
        <div className="h-[calc(100%-2rem)]">
          <HttpClient />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

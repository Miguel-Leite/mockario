import { useState, useEffect, useRef, useCallback } from 'react';
import { Wifi, WifiOff, Send, Trash2, RefreshCw, Copy, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { wsEndpointsApi } from '@/services/api';
import { toastError, toastSuccess } from '@/lib/toast';
import type { MockWsEndpoint } from '@/types';

interface Message {
  id: string;
  type: 'sent' | 'received';
  data: string;
  timestamp: string;
}

export function WsTester() {
  const [endpoints, setEndpoints] = useState<MockWsEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<MockWsEndpoint | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchEndpoints = useCallback(async () => {
    try {
      const data = await wsEndpointsApi.getAll();
      setEndpoints(data);
      if (data.length > 0 && !selectedEndpoint) {
        setSelectedEndpoint(data[0]);
      }
    } catch (err) {
      toastError('Failed to load endpoints');
    } finally {
      setLoading(false);
    }
  }, [selectedEndpoint]);

  useEffect(() => {
    fetchEndpoints();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connect = useCallback(() => {
    if (!selectedEndpoint) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//localhost:3001${selectedEndpoint.path}`;
    
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setConnected(true);
      toastSuccess('Connected to WebSocket');
      addMessage({
        id: Date.now().toString(),
        type: 'received',
        data: '✅ Connected to ' + selectedEndpoint.path,
        timestamp: new Date().toISOString(),
      });
    };

    socket.onmessage = (event) => {
      addMessage({
        id: Date.now().toString(),
        type: 'received',
        data: event.data,
        timestamp: new Date().toISOString(),
      });
    };

    socket.onerror = () => {
      toastError('WebSocket error');
    };

    socket.onclose = () => {
      setConnected(false);
      addMessage({
        id: Date.now().toString(),
        type: 'received',
        data: '❌ Disconnected',
        timestamp: new Date().toISOString(),
      });
    };

    setWs(socket);
  }, [selectedEndpoint]);

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
      setConnected(false);
    }
  }, [ws]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = () => {
    if (!ws || !connected) {
      toastError('Not connected');
      return;
    }

    try {
      const data = messageInput.trim() || '{}';
      ws.send(data);
      addMessage({
        id: Date.now().toString(),
        type: 'sent',
        data: messageInput,
        timestamp: new Date().toISOString(),
      });
      setMessageInput('');
    } catch (err) {
      toastError('Failed to send message');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const copyUrl = () => {
    if (selectedEndpoint) {
      const url = `ws://localhost:3001${selectedEndpoint.path}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-600/10">
              <Wifi className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-100">WebSocket Tester</h1>
              <p className="text-sm text-neutral-400">Test your WebSocket connections</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchEndpoints}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Endpoint Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900">
              <h3 className="font-medium text-neutral-100 mb-3">Select Endpoint</h3>
              {loading ? (
                <p className="text-neutral-400 text-sm">Loading...</p>
              ) : endpoints.length === 0 ? (
                <p className="text-neutral-400 text-sm">No WebSocket endpoints found</p>
              ) : (
                <div className="space-y-2">
                  {endpoints.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => {
                        if (connected) disconnect();
                        setSelectedEndpoint(ep);
                        setMessages([]);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedEndpoint?.id === ep.id
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <p className="font-medium text-neutral-100 text-sm">{ep.path}</p>
                      <p className="text-xs text-neutral-400">{ep.eventType}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedEndpoint && (
              <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900">
                <h3 className="font-medium text-neutral-100 mb-3">Connection</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-neutral-300">
                      {connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-neutral-400 bg-neutral-800 p-2 rounded overflow-x-auto">
                      ws://localhost:3001{selectedEndpoint.path}
                    </code>
                    <Button variant="ghost" size="icon" onClick={copyUrl}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  {connected ? (
                    <Button variant="destructive" className="w-full" onClick={disconnect}>
                      <WifiOff className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={connect}>
                      <Wifi className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Messages */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 h-[500px] flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-neutral-800">
                <h3 className="font-medium text-neutral-100">Messages</h3>
                <Button variant="ghost" size="sm" onClick={clearMessages}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-neutral-500 py-8">
                    <Wifi className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Connect and start sending messages</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === 'sent'
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                            : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">
                          {msg.type === 'sent' ? 'You' : 'Server'}
                        </p>
                        <pre className="text-sm whitespace-pre-wrap break-all font-mono">
                          {msg.data}
                        </pre>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-neutral-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='{"message": "Hello!"}'
                    disabled={!connected}
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-50"
                  />
                  <Button onClick={sendMessage} disabled={!connected}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Send, Plus, Trash2, Loader2, Info, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { httpClientRequest, endpointsApi } from '@/services/api';
import type { MockEndpoint, HttpMethod as HttpMethodType } from '@/types';

type HttpMethod = HttpMethodType | 'PATCH' | 'OPTIONS' | 'HEAD';

interface Header {
  key: string;
  value: string;
}

interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
}

type AuthType = 'none' | 'bearer' | 'basic' | 'apiKey';

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-blue-400',
  POST: 'text-green-400',
  PUT: 'text-yellow-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
  OPTIONS: 'text-purple-400',
  HEAD: 'text-neutral-400',
};

function generateFromKeys(keys: string[]): object {
  const knownFields: Record<string, () => unknown> = {
    name: () => 'John Doe',
    email: () => 'john@example.com',
    phone: () => '123-456-7890',
    uuid: () => '550e8400-e29b-41d4-a716-446655440000',
    address: () => '123 Main St',
    city: () => 'New York',
    country: () => 'United States',
    url: () => 'https://example.com',
    avatar: () => 'https://i.pravatar.cc/150',
    company: () => 'Acme Inc',
    description: () => 'Lorem ipsum',
    age: () => 25,
    isActive: () => true,
    createdAt: () => new Date().toISOString(),
    string: () => 'sample',
    number: () => 1,
    boolean: () => true,
    date: () => new Date().toISOString(),
  };

  const parseKeyWithType = (key: string) => {
    const match = key.match(/^(\w+):(\w+)$/);
    return match ? { name: match[1], type: match[2] } : { name: key, type: 'string' };
  };

  const obj: Record<string, unknown> = {};
  keys.forEach(key => {
    const { name, type } = parseKeyWithType(key);
    const generator = knownFields[type.toLowerCase()];
    obj[name] = generator ? generator() : 'sample';
  });
  return obj;
}

export function HttpClient() {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [selectedEndpointId, setSelectedEndpointId] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('http://localhost:3001/api/users');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' }
  ]);
  const [body, setBody] = useState('{\n  \n}');
  const [requestBodyHint, setRequestBodyHint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('body');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [authType, setAuthType] = useState<AuthType>('none');
  const [authToken, setAuthToken] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authApiKeyName, setAuthApiKeyName] = useState('X-API-Key');
  const [authApiKey, setAuthApiKey] = useState('');

  useEffect(() => {
    endpointsApi.getAll().then(setEndpoints).catch(console.error);
  }, []);

  const selectedEndpoint = endpoints.find(e => e.id === selectedEndpointId);

  useEffect(() => {
    if (selectedEndpoint) {
      setMethod(selectedEndpoint.method);
      
      let baseUrl = 'http://localhost:3001';
      if (selectedEndpoint.path.startsWith('/_auth/')) {
        baseUrl += selectedEndpoint.path.replace('/_auth/', '/api/auth/');
      } else {
        baseUrl += selectedEndpoint.path;
      }
      setUrl(baseUrl);
      
      if (selectedEndpoint.requestBody) {
        const rb = selectedEndpoint.requestBody;
        if (rb.source === 'keys' && rb.keys) {
          const generated = generateFromKeys(rb.keys);
          setBody(JSON.stringify(generated, null, 2));
          setRequestBodyHint(`Body fields: ${rb.keys.join(', ')}`);
        } else if (rb.source === 'example' && rb.example) {
          setBody(JSON.stringify(rb.example, null, 2));
          setRequestBodyHint('Body from example');
        } else if (rb.source === 'schema' && rb.schemaRef) {
          setRequestBodyHint(`Body from schema: ${rb.schemaRef.tableId}`);
        } else {
          setRequestBodyHint(null);
        }
      } else {
        setRequestBodyHint(null);
      }
    }
  }, [selectedEndpoint]);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const applyAuth = () => {
    const newHeaders = headers.filter(h => 
      !['Authorization', 'authorization', authApiKeyName.toLowerCase()].includes(h.key.toLowerCase())
    );
    
    if (authType === 'bearer' && authToken.trim()) {
      newHeaders.push({ key: 'Authorization', value: `Bearer ${authToken.trim()}` });
    } else if (authType === 'basic' && authUsername.trim()) {
      const encoded = btoa(`${authUsername}:${authPassword}`);
      newHeaders.push({ key: 'Authorization', value: `Basic ${encoded}` });
    } else if (authType === 'apiKey' && authApiKey.trim()) {
      newHeaders.push({ key: authApiKeyName, value: authApiKey.trim() });
    }
    
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headerObj: Record<string, string> = {};
      headers.forEach(h => {
        if (h.key.trim()) {
          headerObj[h.key] = h.value;
        }
      });

      let bodyObj: object | undefined;
      if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          bodyObj = JSON.parse(body);
        } catch {
          bodyObj = { raw: body };
        }
      }

      const res = await httpClientRequest({
        method,
        url,
        headers: headerObj,
        body: bodyObj,
      });

      setResponse(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <select
          value={selectedEndpointId}
          onChange={(e) => setSelectedEndpointId(e.target.value)}
          className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-600 min-w-[200px]"
        >
          <option value="">Select endpoint...</option>
          {endpoints.map(ep => (
            <option key={ep.id} value={ep.id}>
              {ep.method} {ep.path}
            </option>
          ))}
        </select>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-600"
        >
          {(Object.keys(methodColors) as HttpMethod[]).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter request URL"
          className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-600"
        />
        <Button onClick={sendRequest} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </Button>
      </div>

      {requestBodyHint && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-primary-900/20 border border-primary-800/50 rounded-lg text-sm">
          <Info className="h-4 w-4 text-primary-400" />
          <span className="text-primary-300">{requestBodyHint}</span>
        </div>
      )}

      <div className="flex gap-1 mb-3 border-b border-neutral-800">
        {(['params', 'headers', 'body', 'auth'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm capitalize transition-colors ${
              activeTab === tab
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 mb-4 overflow-auto">
        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(['none', 'bearer', 'basic', 'apiKey'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAuthType(type)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    authType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {type === 'none' ? 'None' : type === 'bearer' ? 'Bearer' : type === 'basic' ? 'Basic' : 'API Key'}
                </button>
              ))}
            </div>

            {authType === 'bearer' && (
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block">Token</label>
                <input
                  type="text"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            )}

            {authType === 'basic' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">Username</label>
                  <input
                    type="text"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="username"
                    className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="password"
                    className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
            )}

            {authType === 'apiKey' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">Header Name</label>
                  <input
                    type="text"
                    value={authApiKeyName}
                    onChange={(e) => setAuthApiKeyName(e.target.value)}
                    placeholder="X-API-Key"
                    className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">API Key</label>
                  <input
                    type="text"
                    value={authApiKey}
                    onChange={(e) => setAuthApiKey(e.target.value)}
                    placeholder="your-api-key"
                    className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
            )}

            {authType !== 'none' && (
              <Button variant="outline" size="sm" onClick={applyAuth} className="gap-2">
                <Lock className="h-4 w-4" />
                Apply to Headers
              </Button>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
                <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addHeader} className="gap-1">
              <Plus className="h-3 w-3" />
              Add Header
            </Button>
          </div>
        )}

        {activeTab === 'body' && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-full min-h-[150px] px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-600 resize-none"
          />
        )}
      </div>

      <div className="flex-1 min-h-0 border-t border-neutral-800 pt-4">
        <div className="text-sm text-neutral-500 mb-2">Response</div>
        
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {response && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-3 text-sm">
              <span className={getStatusColor(response.status)}>
                {response.status} {response.statusText}
              </span>
              <span className="text-neutral-500">{response.duration}ms</span>
            </div>
            <pre className="flex-1 overflow-auto p-4 bg-neutral-900 border border-neutral-800 rounded-lg text-sm font-mono text-neutral-300 whitespace-pre-wrap">
              {typeof response.data === 'string' 
                ? response.data 
                : JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}

        {!response && !error && !loading && (
          <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
            Send a request to see the response
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Shield, RefreshCw, Layers, FileJson } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CreateEndpointDto, HttpMethod, MockEndpoint, Schema, RequestBody, RequestBodySource } from '@/types';
import { SchemaSelector } from './SchemaSelector';
import { schemasApi } from '@/services/api';
import { generateFromKeysWithTypes } from '@/lib/faker';

interface EndpointFormProps {
  onSubmit: (dto: CreateEndpointDto) => void;
  endpoint?: MockEndpoint;
  trigger?: React.ReactNode;
}

function generateFromKeys(keys: string[], isArray: boolean, count: number = 1): object | object[] {
  const results = generateFromKeysWithTypes(keys, count);
  return isArray ? results : results[0];
}

export function EndpointForm({ onSubmit, endpoint, trigger }: EndpointFormProps) {
  const [open, setOpen] = useState(false);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  
  const [path, setPath] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [delay, setDelay] = useState('');
  const [count, setCount] = useState('1');
  const [schemaId, setSchemaId] = useState('');
  const [tableId, setTableId] = useState('');
  const [responseKeys, setResponseKeys] = useState<string[]>([]);
  const [responseKeysInput, setResponseKeysInput] = useState('');
  const [isArray, setIsArray] = useState(false);
  const [error, setError] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const [useCustomKeys, setUseCustomKeys] = useState(false);
  const [hasRequestBody, setHasRequestBody] = useState(false);
  const [requestBodySource, setRequestBodySource] = useState<RequestBodySource>('keys');
  const [requestBodySchemaId, setRequestBodySchemaId] = useState('');
  const [requestBodyTableId, setRequestBodyTableId] = useState('');
  const [requestBodyKeys, setRequestBodyKeys] = useState('');
  const [requestBodyExample, setRequestBodyExample] = useState('');

  const isEditing = !!endpoint;

  useEffect(() => {
    schemasApi.getAll()
      .then(setSchemas)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (open && endpoint) {
      setPath(endpoint.path || '');
      setMethod(endpoint.method || 'GET');
      setDelay(endpoint.delay?.toString() || '');
      setCount(endpoint.storedData ? String(endpoint.storedData.length) : '1');
      setSchemaId(endpoint.schemaRef?.schemaId || '');
      setTableId(endpoint.schemaRef?.tableId || '');
      setResponseKeys(endpoint.responseKeys || []);
      setResponseKeysInput(endpoint.responseKeys ? endpoint.responseKeys.join(', ') : '');
      setIsArray(endpoint.storedData ? Array.isArray(endpoint.storedData) : false);
      setAuthRequired(endpoint.authRequired || false);
      setUseCustomKeys(!endpoint.schemaRef && !!endpoint.responseKeys);
      
      if (endpoint.requestBody) {
        setHasRequestBody(true);
        setRequestBodySource(endpoint.requestBody.source);
        setRequestBodySchemaId(endpoint.requestBody.schemaRef?.schemaId || '');
        setRequestBodyTableId(endpoint.requestBody.schemaRef?.tableId || '');
        setRequestBodyKeys(endpoint.requestBody.keys?.join(', ') || '');
        setRequestBodyExample(endpoint.requestBody.example ? JSON.stringify(endpoint.requestBody.example, null, 2) : '');
      } else {
        setHasRequestBody(false);
        setRequestBodySource('keys');
        setRequestBodySchemaId('');
        setRequestBodyTableId('');
        setRequestBodyKeys('');
        setRequestBodyExample('');
      }
    } else if (open) {
      setPath('');
      setMethod('GET');
      setDelay('');
      setCount('1');
      setSchemaId('');
      setTableId('');
      setResponseKeys([]);
      setResponseKeysInput('');
      setIsArray(false);
      setAuthRequired(false);
      setUseCustomKeys(false);
      setHasRequestBody(false);
      setRequestBodySource('keys');
      setRequestBodySchemaId('');
      setRequestBodyTableId('');
      setRequestBodyKeys('');
      setRequestBodyExample('');
    }
  }, [open, endpoint]);

  const hasSchemas = schemas.length > 0;

  const handleSchemaSelect = async (newSchemaId: string, newTableId: string) => {
    setSchemaId(newSchemaId);
    setTableId(newTableId);
    setUseCustomKeys(false);
  };

  const handleCustomKeysChange = (value: string) => {
    setResponseKeysInput(value);
    const keys = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    setResponseKeys(keys);
  };

  const handleSubmit = async () => {
    setError('');

    if (!path.trim()) {
      setError('Path is required');
      return;
    }

    if (!path.startsWith('/')) {
      setError('Path must start with /');
      return;
    }

    const hasDataSource = schemaId && tableId || responseKeys.length > 0 || useCustomKeys;
    if (!isEditing && !hasDataSource) {
      setError('Please select a schema and table, or enter custom response keys');
      return;
    }

    let response: object;
    let finalSchemaRef = undefined;
    let finalResponseKeys = undefined;

    if (useCustomKeys || responseKeys.length > 0) {
      const numCount = parseInt(count) || 1;
      response = generateFromKeys(responseKeys, isArray, numCount);
      finalResponseKeys = responseKeys;
    } else if (schemaId && tableId) {
      try {
        const numCount = parseInt(count) || 1;
        const data = await schemasApi.generateFromTable(schemaId, tableId, numCount);
        response = isArray ? data : data[0];
        finalSchemaRef = { schemaId, tableId };
      } catch (err) {
        setError('Failed to generate response from schema');
        return;
      }
    } else if (isEditing && endpoint) {
      response = endpoint.response;
      finalSchemaRef = endpoint.schemaRef;
      finalResponseKeys = endpoint.responseKeys;
    } else {
      response = {};
    }

    const dto: CreateEndpointDto = {
      path: path.trim(),
      method,
      response,
      responseType: 'json',
      delay: delay ? parseInt(delay) : undefined,
      ...(finalSchemaRef ? { schemaRef: finalSchemaRef } : {}),
      ...(finalResponseKeys ? { responseKeys: finalResponseKeys } : {}),
      ...(isArray ? { storedData: Array.isArray(response) ? response : [response] } : {}),
      authRequired,
    };

    if (hasRequestBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
      let requestBody: RequestBody | undefined;
      
      if (requestBodySource === 'schema' && requestBodySchemaId && requestBodyTableId) {
        requestBody = {
          source: 'schema',
          schemaRef: { schemaId: requestBodySchemaId, tableId: requestBodyTableId }
        };
      } else if (requestBodySource === 'keys' && requestBodyKeys.trim()) {
        requestBody = {
          source: 'keys',
          keys: requestBodyKeys.split(',').map(k => k.trim()).filter(k => k.length > 0)
        };
      } else if (requestBodySource === 'example' && requestBodyExample.trim()) {
        try {
          requestBody = {
            source: 'example',
            example: JSON.parse(requestBodyExample)
          };
        } catch {
          setError('Invalid JSON in request body example');
          return;
        }
      }
      
      if (requestBody) {
        dto.requestBody = requestBody;
      }
    }

    onSubmit(dto);
    if (!isEditing) {
      handleClose();
    }
  };

  const handleClose = () => {
    setPath('');
    setMethod('GET');
    setDelay('');
    setCount('1');
    setSchemaId('');
    setTableId('');
    setResponseKeys([]);
    setResponseKeysInput('');
    setIsArray(false);
    setError('');
    setAuthRequired(false);
    setUseCustomKeys(false);
    setHasRequestBody(false);
    setRequestBodySource('keys');
    setRequestBodySchemaId('');
    setRequestBodyTableId('');
    setRequestBodyKeys('');
    setRequestBodyExample('');
    setOpen(false);
  };

  const handleToggleCustomMode = () => {
    setUseCustomKeys(true);
    setSchemaId('');
    setTableId('');
  };

  const dialogContent = (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Endpoint' : 'Create New Endpoint'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="col-span-1 h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/api/users"
            className="col-span-3 h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-neutral-300 font-medium">Data Source</label>
            {!useCustomKeys && (
              <button
                type="button"
                onClick={handleToggleCustomMode}
                className="text-xs text-primary-400 hover:text-primary-300"
              >
                Use custom keys instead
              </button>
            )}
          </div>

          {!useCustomKeys && hasSchemas && (
            <div className="flex items-center gap-2">
              <SchemaSelector
                onSelect={handleSchemaSelect}
                selectedSchemaId={schemaId}
                selectedTableId={tableId}
              />
              {schemaId && tableId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (schemaId && tableId) {
                      try {
                        const numCount = parseInt(count) || 1;
                        await schemasApi.generateFromTable(schemaId, tableId, numCount);
                      } catch (err) {
                        console.error('Failed to generate:', err);
                      }
                    }
                  }}
                  title="Generate from schema"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {useCustomKeys && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block">
                  Response Keys (comma separated)
                </label>
                <input
                  type="text"
                  value={responseKeysInput}
                  onChange={(e) => handleCustomKeysChange(e.target.value)}
                  placeholder="name:string, email:email, age:number"
                  className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Use format key:type (e.g., name:string, email:email, age:number). Known types: string, number, boolean, date, email, phone, uuid, url, address, city, country, avatar, company
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsArray(!isArray)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
                    isArray 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span className="text-sm">Array</span>
                </button>
                {isArray && (
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    placeholder="Count"
                    min="1"
                    max="100"
                    className="h-8 w-20 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
                    title="Number of records"
                  />
                )}
              </div>
            </div>
          )}

          {!useCustomKeys && hasSchemas && method === 'GET' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsArray(!isArray)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
                  isArray 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span className="text-sm">Array</span>
              </button>
              {isArray && (
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="Count"
                  min="1"
                  max="100"
                  className="h-8 w-20 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
                  title="Number of records"
                />
              )}
            </div>
          )}
        </div>

        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-300 font-medium">Request Body</span>
              </div>
              <button
                type="button"
                onClick={() => setHasRequestBody(!hasRequestBody)}
                className={`w-12 h-6 rounded-full transition-colors ${hasRequestBody ? 'bg-primary-600' : 'bg-neutral-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${hasRequestBody ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {hasRequestBody && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(['keys', 'schema', 'example'] as const).map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setRequestBodySource(source)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        requestBodySource === source
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {source === 'keys' ? 'Keys' : source === 'schema' ? 'Schema' : 'Example'}
                    </button>
                  ))}
                </div>

                {requestBodySource === 'schema' && (
                  <div>
                    <SchemaSelector
                      onSelect={(sid, tid) => { setRequestBodySchemaId(sid); setRequestBodyTableId(tid); }}
                      selectedSchemaId={requestBodySchemaId}
                      selectedTableId={requestBodyTableId}
                    />
                  </div>
                )}

                {requestBodySource === 'keys' && (
                  <div>
                    <label className="text-xs text-neutral-400 mb-1.5 block">
                      Body Keys (comma separated)
                    </label>
                    <input
                      type="text"
                      value={requestBodyKeys}
                      onChange={(e) => setRequestBodyKeys(e.target.value)}
                      placeholder="username:string, password:string"
                      className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                )}

                {requestBodySource === 'example' && (
                  <div>
                    <label className="text-xs text-neutral-400 mb-1.5 block">
                      JSON Example
                    </label>
                    <textarea
                      value={requestBodyExample}
                      onChange={(e) => setRequestBodyExample(e.target.value)}
                      placeholder='{"name": "John", "email": "john@example.com"}'
                      className="w-full h-24 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 font-mono resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between py-3 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Requires Authentication</span>
          </div>
          <button
            type="button"
            onClick={() => setAuthRequired(!authRequired)}
            className={`w-12 h-6 rounded-full transition-colors ${authRequired ? 'bg-primary-600' : 'bg-neutral-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${authRequired ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Delay (ms) - Optional</label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            placeholder="0"
            min="0"
            max="30000"
            className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={isEditing ? () => {} : handleClose}>
            {isEditing ? 'Close' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Endpoint
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}

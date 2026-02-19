import { useState, useRef } from 'react';
import { Plus, Code, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CreateEndpointDto, HttpMethod, MockEndpoint, ResponseType } from '@/types';
import { FakerTemplates } from './FakerTemplates';
import { SchemaSelector } from './SchemaSelector';
import { schemasApi } from '@/services/api';

interface EndpointFormProps {
  onSubmit: (dto: CreateEndpointDto) => void;
  endpoint?: MockEndpoint;
  trigger?: React.ReactNode;
}

const defaultJson = `{
  "name": "",
  "email": "",
  "price": 0,
  "active": false
}`;

const defaultTs = `{
  name: string;
  email: string;
  price: number;
  active: boolean;
}`;

const defaultPayloadJson = `{
  "name": "",
  "email": ""
}`;

const defaultPayloadTs = `{
  name: string;
  email: string;
}`;

function inferJsonStructure(jsonString: string): object {
  try {
    const parsed = JSON.parse(jsonString);
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(parsed)) {
      const type = typeof value;
      if (type === 'string') {
        result[key] = value === '' ? 'string' : value;
      } else if (type === 'number') {
        result[key] = value;
      } else if (type === 'boolean') {
        result[key] = value;
      } else if (type === 'object') {
        if (Array.isArray(value)) {
          result[key] = [];
        } else {
          result[key] = {};
        }
      }
    }
    
    return result;
  } catch {
    return {};
  }
}

function parseTsStructure(tsString: string): Record<string, string> {
  const result: Record<string, string> = {};
  const matches = tsString.matchAll(/(\w+)\s*:\s*(\w+)/g);
  for (const match of matches) {
    result[match[1]] = match[2];
  }
  return result;
}

function generateFromTsStructure(tsString: string): object {
  const fields = parseTsStructure(tsString);
  const result: Record<string, any> = {};
  
  for (const [key, type] of Object.entries(fields)) {
    switch (type.toLowerCase()) {
      case 'string':
        result[key] = '{{faker.name}}';
        break;
      case 'number':
        result[key] = '{{faker.number}}';
        break;
      case 'boolean':
        result[key] = '{{faker.boolean}}';
        break;
      case 'date':
        result[key] = '{{faker.date}}';
        break;
      case 'email':
        result[key] = '{{faker.email}}';
        break;
      case 'uuid':
        result[key] = '{{faker.uuid}}';
        break;
      case 'array':
        result[key] = [];
        break;
      case 'object':
        result[key] = {};
        break;
      default:
        result[key] = '{{faker.word}}';
    }
  }
  
  return result;
}

export function EndpointForm({ onSubmit, endpoint, trigger }: EndpointFormProps) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(endpoint?.path || '');
  const [method, setMethod] = useState<HttpMethod>(endpoint?.method || 'GET');
  const [response, setResponse] = useState(endpoint ? JSON.stringify(endpoint.response, null, 2) : defaultJson);
  const [responseType, setResponseType] = useState<ResponseType>(endpoint?.responseType || 'json');
  const [delay, setDelay] = useState(endpoint?.delay?.toString() || '');
  const [count, setCount] = useState(endpoint?.storedData ? String(endpoint.storedData.length) : '1');
  const [schemaId, setSchemaId] = useState(endpoint?.schemaRef?.schemaId || '');
  const [tableId, setTableId] = useState(endpoint?.schemaRef?.tableId || '');
  const [showPayload, setShowPayload] = useState(false);
  const [payload, setPayload] = useState(endpoint?.payloadJson ? JSON.stringify(endpoint.payloadJson, null, 2) : defaultPayloadJson);
  const [payloadType, setPayloadType] = useState<ResponseType>(endpoint?.payloadType || 'json');
  const [payloadSchemaId, setPayloadSchemaId] = useState(endpoint?.payloadSchemaRef?.schemaId || '');
  const [payloadTableId, setPayloadTableId] = useState(endpoint?.payloadSchemaRef?.tableId || '');
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState('');
  
  const responseTextareaRef = useRef<HTMLTextAreaElement>(null);
  const payloadTextareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = !!endpoint;

  const handleSubmit = () => {
    setError('');
    
    if (!path.trim()) {
      setError('Path is required');
      return;
    }

    if (!path.startsWith('/')) {
      setError('Path must start with /');
      return;
    }

    let parsedResponse;
    if (responseType === 'json') {
      try {
        JSON.parse(response);
        parsedResponse = inferJsonStructure(response);
      } catch {
        setError('Invalid JSON response');
        return;
      }
    } else {
      const fields = parseTsStructure(response);
      if (Object.keys(fields).length === 0) {
        setError('Invalid TS structure. Use format: { field: type; }');
        return;
      }
      parsedResponse = generateFromTsStructure(response);
    }

    let parsedPayload = undefined;
    if (showPayload) {
      if (payloadType === 'json') {
        try {
          parsedPayload = inferJsonStructure(payload);
        } catch {
          setError('Invalid JSON payload');
          return;
        }
      } else {
        const fields = parseTsStructure(payload);
        if (Object.keys(fields).length === 0) {
          setError('Invalid TS structure for payload');
          return;
        }
        parsedPayload = generateFromTsStructure(payload);
      }
    }

    const dto: CreateEndpointDto = {
      path: path.trim(),
      method,
      response: parsedResponse,
      responseType,
      delay: delay ? parseInt(delay) : undefined,
      ...(schemaId && tableId ? { schemaRef: { schemaId, tableId } } : {}),
      ...(parsedPayload ? { payloadJson: parsedPayload } : {}),
      ...(payloadSchemaId && payloadTableId ? { payloadSchemaRef: { schemaId: payloadSchemaId, tableId: payloadTableId } } : {}),
      ...(showPayload ? { payloadType } : {}),
    };

    onSubmit(dto);
    if (!isEditing) {
      handleClose();
    }
  };

  const handleClose = () => {
    setPath('');
    setMethod('GET');
    setResponse(defaultJson);
    setResponseType('json');
    setDelay('');
    setCount('1');
    setSchemaId('');
    setTableId('');
    setShowPayload(false);
    setPayload(defaultPayloadJson);
    setPayloadType('json');
    setPayloadSchemaId('');
    setPayloadTableId('');
    setPreview('');
    setError('');
    setOpen(false);
  };

  const handleInsertFakerAtCursor = (template: string) => {
    const textarea = responseTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    if (responseType === 'json') {
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      const valueMatch = before.match(/"([^"]+)"\s*:\s*"?$/);
      if (valueMatch) {
        const newText = before + `"${valueMatch[1]}": "${template}"` + after;
        setResponse(newText);
      } else {
        const insertPos = text.indexOf(':', start);
        if (insertPos !== -1) {
          const keyEnd = text.indexOf('"', insertPos + 1);
          const valueStart = text.indexOf('"', keyEnd + 1);
          if (valueStart !== -1) {
            const beforeVal = text.substring(0, valueStart + 1);
            const afterVal = text.substring(text.indexOf('"', valueStart + 1));
            setResponse(beforeVal + template + afterVal);
          }
        }
      }
    } else {
      const fields = parseTsStructure(response);
      const cursorWordMatch = text.substring(0, start).match(/(\w+)\s*:\s*$/);
      if (cursorWordMatch) {
        const fieldName = cursorWordMatch[1];
        const fieldType = fields[fieldName];
        
        const typeMap: Record<string, string> = {
          string: '{{faker.name}}',
          number: '{{faker.number}}',
          boolean: '{{faker.boolean}}',
          date: '{{faker.date}}',
          email: '{{faker.email}}',
          uuid: '{{faker.uuid}}',
        };
        
        const newValue = typeMap[fieldType] || '{{faker.word}}';
        
        const before = text.substring(0, start);
        const after = text.substring(end);
        setResponse(before + `${fieldName}: ${newValue};` + after);
      } else {
        const selectedText = text.substring(start, end);
        if (selectedText) {
          setResponse(text.substring(0, start) + template + text.substring(end));
        }
      }
    }
  };

  const handleGeneratePreview = async () => {
    if (responseType === 'json') {
      try {
        JSON.parse(response);
        setPreview(JSON.stringify(inferJsonStructure(response), null, 2));
      } catch {
        setPreview('Invalid JSON');
      }
    } else {
      const generated = generateFromTsStructure(response);
      setPreview(JSON.stringify(generated, null, 2));
    }
  };

  const handleSchemaSelect = async (newSchemaId: string, newTableId: string) => {
    setSchemaId(newSchemaId);
    setTableId(newTableId);

    if (newSchemaId && newTableId) {
      try {
        const numCount = parseInt(count) || 1;
        const data = await schemasApi.generateFromTable(newSchemaId, newTableId, numCount);
        setResponse(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error('Failed to generate from schema:', err);
      }
    }
  };

  const handlePayloadSchemaSelect = async (newSchemaId: string, newTableId: string) => {
    setPayloadSchemaId(newSchemaId);
    setPayloadTableId(newTableId);

    if (newSchemaId && newTableId) {
      try {
        const data = await schemasApi.generateFromTable(newSchemaId, newTableId, 1);
        setPayload(JSON.stringify(data[0], null, 2));
      } catch (err) {
        console.error('Failed to generate from schema:', err);
      }
    }
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Response</label>
              <select
                value={responseType}
                onChange={(e) => {
                  setResponseType(e.target.value as ResponseType);
                  setResponse(e.target.value === 'ts' ? defaultTs : defaultJson);
                }}
                className="h-6 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
              >
                <option value="json">JSON</option>
                <option value="ts">TS/Faker</option>
              </select>
              {method === 'GET' && (
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="Count"
                  min="1"
                  max="100"
                  className="h-6 w-16 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
                  title="Number of records to generate"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <SchemaSelector
                onSelect={handleSchemaSelect}
                selectedSchemaId={schemaId}
                selectedTableId={tableId}
              />
            </div>
          </div>

          <textarea
            ref={responseTextareaRef}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={responseType === 'ts' ? 6 : 10}
            placeholder={responseType === 'ts' 
              ? `{name: string; email: string; price: number}` 
              : `{"name": "", "email": "", "price": 0}`}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 font-mono placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
          />

          <div className="mt-2 flex items-center gap-2">
            <FakerTemplates onInsert={handleInsertFakerAtCursor} />
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={handleGeneratePreview}
            >
              <Play className="h-3 w-3" />
              Preview
            </Button>
            {preview && (
              <span className="text-xs text-neutral-500 ml-2">
                Click Preview to see result
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-4">
          <button
            type="button"
            onClick={() => setShowPayload(!showPayload)}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
          >
            <Code className="h-4 w-4" />
            Payload Validation (Optional)
            {showPayload ? ' ▲' : ' ▼'}
          </button>
          
          {showPayload && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Type:</span>
                <select
                  value={payloadType}
                  onChange={(e) => {
                    setPayloadType(e.target.value as ResponseType);
                    setPayload(e.target.value === 'ts' ? defaultPayloadTs : defaultPayloadJson);
                  }}
                  className="h-7 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
                >
                  <option value="json">JSON</option>
                  <option value="ts">TS</option>
                </select>
                
                {payloadType === 'json' && (
                  <SchemaSelector
                    onSelect={handlePayloadSchemaSelect}
                    selectedSchemaId={payloadSchemaId}
                    selectedTableId={payloadTableId}
                  />
                )}
              </div>
              
              <textarea
                ref={payloadTextareaRef}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={4}
                placeholder={payloadType === 'ts' 
                  ? `{name: string; email: string}` 
                  : `{"name": "", "email": ""}`}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 font-mono placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
              />
            </div>
          )}
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

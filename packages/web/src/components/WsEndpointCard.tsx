import { Wifi, Pencil, Trash2, Play } from 'lucide-react';
import { Button } from './ui/button';
import type { MockWsEndpoint } from '@/types';

interface WsEndpointCardProps {
  endpoint: MockWsEndpoint;
  onEdit: (endpoint: MockWsEndpoint) => void;
  onDelete: (id: string) => void;
  onTest?: (endpoint: MockWsEndpoint) => void;
}

export function WsEndpointCard({ endpoint, onEdit, onDelete, onTest }: WsEndpointCardProps) {
  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'message':
        return 'bg-blue-500/20 text-blue-400';
      case 'connection':
        return 'bg-green-500/20 text-green-400';
      case 'disconnect':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  return (
    <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-green-600/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-600/10">
            <Wifi className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-100">{endpoint.path}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 text-xs rounded-full ${getEventTypeColor(endpoint.eventType)}`}>
                {endpoint.eventType}
              </span>
              {endpoint.delay && endpoint.delay > 0 && (
                <span className="text-xs text-neutral-400">
                  {endpoint.delay}ms delay
                </span>
              )}
              {endpoint.authRequired && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
                  Auth
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onTest && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTest(endpoint)}
              title="Test"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(endpoint)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(endpoint.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </div>
      {endpoint.response && (
        <div className="mt-3 p-2 rounded bg-neutral-800 text-xs font-mono text-neutral-400 overflow-hidden">
          <pre>{JSON.stringify(endpoint.response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

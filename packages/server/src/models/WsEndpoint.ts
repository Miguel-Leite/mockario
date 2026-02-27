import { MockWsEndpoint, CreateWsEndpointDto, UpdateWsEndpointDto } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';

export class WsEndpointModel {
  private endpoints: Map<string, MockWsEndpoint> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = storage.getWsEndpoints();
    
    stored.forEach(ep => {
      this.endpoints.set(ep.id, ep);
    });
  }

  create(dto: CreateWsEndpointDto): MockWsEndpoint {
    const id = uuidv4();
    const endpoint: MockWsEndpoint = {
      id,
      path: dto.path.startsWith('/ws/') ? dto.path : `/ws/${dto.path.replace(/^\//, '')}`,
      eventType: dto.eventType || 'message',
      response: dto.response,
      responseType: dto.responseType,
      delay: dto.delay || 0,
      authRequired: dto.authRequired || false,
      createdAt: new Date().toISOString(),
    };
    this.endpoints.set(id, endpoint);
    storage.addWsEndpoint(endpoint);
    return endpoint;
  }

  addEndpoint(endpoint: MockWsEndpoint): MockWsEndpoint {
    this.endpoints.set(endpoint.id, endpoint);
    return endpoint;
  }

  findAll(): MockWsEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  findById(id: string): MockWsEndpoint | undefined {
    return this.endpoints.get(id);
  }

  findByPath(path: string): MockWsEndpoint | undefined {
    return Array.from(this.endpoints.values()).find(
      (ep) => ep.path === path
    );
  }

  update(id: string, dto: UpdateWsEndpointDto): MockWsEndpoint | null {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) return null;

    const updated: MockWsEndpoint = {
      ...endpoint,
      path: dto.path ? (dto.path.startsWith('/ws/') ? dto.path : `/ws/${dto.path.replace(/^\//, '')}`) : endpoint.path,
      eventType: dto.eventType || endpoint.eventType,
      response: dto.response !== undefined ? dto.response : endpoint.response,
      responseType: dto.responseType !== undefined ? dto.responseType : endpoint.responseType,
      delay: dto.delay !== undefined ? dto.delay : endpoint.delay,
      authRequired: dto.authRequired !== undefined ? dto.authRequired : endpoint.authRequired,
    };
    this.endpoints.set(id, updated);
    storage.updateWsEndpoint(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    const deleted = this.endpoints.delete(id);
    if (deleted) {
      storage.deleteWsEndpoint(id);
    }
    return deleted;
  }

  clear(): void {
    this.endpoints.clear();
    storage.clearWsEndpoints();
  }
}

export const wsEndpointModel = new WsEndpointModel();

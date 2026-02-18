import { MockEndpoint, CreateEndpointDto, UpdateEndpointDto } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class EndpointModel {
  private endpoints: Map<string, MockEndpoint> = new Map();

  create(dto: CreateEndpointDto): MockEndpoint {
    const id = uuidv4();
    const endpoint: MockEndpoint = {
      id,
      path: dto.path.startsWith('/') ? dto.path : `/${dto.path}`,
      method: dto.method,
      response: dto.response,
      delay: dto.delay || 0,
      createdAt: new Date(),
    };
    this.endpoints.set(id, endpoint);
    return endpoint;
  }

  findAll(): MockEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  findById(id: string): MockEndpoint | undefined {
    return this.endpoints.get(id);
  }

  findByPath(path: string, method: string): MockEndpoint | undefined {
    return Array.from(this.endpoints.values()).find(
      (ep) => ep.path === path && ep.method === method
    );
  }

  update(id: string, dto: UpdateEndpointDto): MockEndpoint | null {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) return null;

    const updated: MockEndpoint = {
      ...endpoint,
      path: dto.path ? (dto.path.startsWith('/') ? dto.path : `/${dto.path}`) : endpoint.path,
      method: dto.method || endpoint.method,
      response: dto.response || endpoint.response,
      delay: dto.delay !== undefined ? dto.delay : endpoint.delay,
    };
    this.endpoints.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.endpoints.delete(id);
  }

  clear(): void {
    this.endpoints.clear();
  }
}

export const endpointModel = new EndpointModel();

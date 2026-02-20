import axios, { AxiosInstance } from 'axios';
import type { MockEndpoint, CreateEndpointDto, RequestLog } from '../types';

export interface MockarioHooksConfig {
  baseUrl: string;
}

export class MockarioApi {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getEndpoints(): Promise<MockEndpoint[]> {
    const response = await this.client.get<MockEndpoint[]>('/endpoints');
    return response.data;
  }

  async getEndpoint(id: string): Promise<MockEndpoint> {
    const response = await this.client.get<MockEndpoint>(`/endpoints/${id}`);
    return response.data;
  }

  async createEndpoint(dto: CreateEndpointDto): Promise<MockEndpoint> {
    const response = await this.client.post<MockEndpoint>('/endpoints', dto);
    return response.data;
  }

  async updateEndpoint(id: string, dto: Partial<CreateEndpointDto>): Promise<MockEndpoint> {
    const response = await this.client.put<MockEndpoint>(`/endpoints/${id}`, dto);
    return response.data;
  }

  async deleteEndpoint(id: string): Promise<void> {
    await this.client.delete(`/endpoints/${id}`);
  }

  async getLogs(): Promise<RequestLog[]> {
    const response = await this.client.get<RequestLog[]>('/logs');
    return response.data;
  }

  async clearLogs(): Promise<void> {
    await this.client.delete('/logs');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/endpoints');
      return true;
    } catch {
      return false;
    }
  }
}

export function createMockarioApi(baseUrl: string): MockarioApi {
  return new MockarioApi(baseUrl);
}

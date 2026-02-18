import { endpointModel } from '../src/models/Endpoint';
import { CreateEndpointDto } from '../src/types';

describe('EndpointModel', () => {
  beforeEach(() => {
    endpointModel.clear();
  });

  describe('create', () => {
    it('should create an endpoint', () => {
      const dto: CreateEndpointDto = {
        path: '/api/users',
        method: 'GET',
        response: { name: 'John' },
      };

      const endpoint = endpointModel.create(dto);

      expect(endpoint.id).toBeDefined();
      expect(endpoint.path).toBe('/api/users');
      expect(endpoint.method).toBe('GET');
      expect(endpoint.response).toEqual({ name: 'John' });
      expect(endpoint.createdAt).toBeInstanceOf(Date);
    });

    it('should add leading slash if missing', () => {
      const dto: CreateEndpointDto = {
        path: 'api/users',
        method: 'GET',
        response: {},
      };

      const endpoint = endpointModel.create(dto);
      expect(endpoint.path).toBe('/api/users');
    });

    it('should allow delay', () => {
      const dto: CreateEndpointDto = {
        path: '/api/test',
        method: 'POST',
        response: {},
        delay: 1000,
      };

      const endpoint = endpointModel.create(dto);
      expect(endpoint.delay).toBe(1000);
    });
  });

  describe('findAll', () => {
    it('should return all endpoints', () => {
      endpointModel.create({ path: '/api/users', method: 'GET', response: {} });
      endpointModel.create({ path: '/api/posts', method: 'GET', response: {} });

      const endpoints = endpointModel.findAll();
      expect(endpoints).toHaveLength(2);
    });

    it('should return empty array when no endpoints', () => {
      const endpoints = endpointModel.findAll();
      expect(endpoints).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should find endpoint by id', () => {
      const created = endpointModel.create({
        path: '/api/users',
        method: 'GET',
        response: {},
      });

      const found = endpointModel.findById(created.id);
      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = endpointModel.findById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('findByPath', () => {
    it('should find endpoint by path and method', () => {
      endpointModel.create({
        path: '/api/users',
        method: 'GET',
        response: {},
      });

      const found = endpointModel.findByPath('/api/users', 'GET');
      expect(found).toBeDefined();
      expect(found?.path).toBe('/api/users');
    });

    it('should return undefined for non-existent path', () => {
      const found = endpointModel.findByPath('/api/non-existent', 'GET');
      expect(found).toBeUndefined();
    });

    it('should return undefined for wrong method', () => {
      endpointModel.create({
        path: '/api/users',
        method: 'GET',
        response: {},
      });

      const found = endpointModel.findByPath('/api/users', 'POST');
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update an endpoint', () => {
      const created = endpointModel.create({
        path: '/api/users',
        method: 'GET',
        response: { name: 'John' },
      });

      const updated = endpointModel.update(created.id, {
        response: { name: 'Jane' },
      });

      expect(updated?.response).toEqual({ name: 'Jane' });
    });

    it('should return null for non-existent endpoint', () => {
      const updated = endpointModel.update('non-existent-id', {
        response: {},
      });
      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an endpoint', () => {
      const created = endpointModel.create({
        path: '/api/users',
        method: 'GET',
        response: {},
      });

      const deleted = endpointModel.delete(created.id);
      expect(deleted).toBe(true);

      const found = endpointModel.findById(created.id);
      expect(found).toBeUndefined();
    });

    it('should return false for non-existent endpoint', () => {
      const deleted = endpointModel.delete('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all endpoints', () => {
      endpointModel.create({ path: '/api/users', method: 'GET', response: {} });
      endpointModel.create({ path: '/api/posts', method: 'GET', response: {} });

      endpointModel.clear();

      const endpoints = endpointModel.findAll();
      expect(endpoints).toHaveLength(0);
    });
  });
});

import request from 'supertest';
import express, { Application } from 'express';
import { endpointModel } from '../src/models/Endpoint';
import mockRoutes from '../src/routes/mockRoutes';

describe('Mock Routes', () => {
  let app: Application;

  beforeEach(() => {
    endpointModel.clear();
    app = express();
    app.use(express.json());
    app.use('/api', mockRoutes);
  });

  describe('POST /api/endpoints', () => {
    it('should create an endpoint', async () => {
      const response = await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/users',
          method: 'GET',
          response: { name: 'John', age: 30 },
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.path).toBe('/api/users');
      expect(response.body.method).toBe('GET');
    });

    it('should return 400 when missing fields', async () => {
      const response = await request(app)
        .post('/api/endpoints')
        .send({ path: '/api/users' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 409 when endpoint exists', async () => {
      await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/users',
          method: 'GET',
          response: {},
        });

      const response = await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/users',
          method: 'GET',
          response: {},
        });

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/endpoints', () => {
    it('should return all endpoints', async () => {
      await request(app)
        .post('/api/endpoints')
        .send({ path: '/api/users', method: 'GET', response: {} });
      await request(app)
        .post('/api/endpoints')
        .send({ path: '/api/posts', method: 'GET', response: {} });

      const response = await request(app).get('/api/endpoints');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no endpoints', async () => {
      const response = await request(app).get('/api/endpoints');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/endpoints/:id', () => {
    it('should return endpoint by id', async () => {
      const created = await request(app)
        .post('/api/endpoints')
        .send({ path: '/api/users', method: 'GET', response: {} });

      const response = await request(app).get(`/api/endpoints/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.path).toBe('/api/users');
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app).get('/api/endpoints/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/endpoints/:id', () => {
    it('should update an endpoint', async () => {
      const created = await request(app)
        .post('/api/endpoints')
        .send({ path: '/api/users', method: 'GET', response: { name: 'John' } });

      const response = await request(app)
        .put(`/api/endpoints/${created.body.id}`)
        .send({ response: { name: 'Jane' } });

      expect(response.status).toBe(200);
      expect(response.body.response).toEqual({ name: 'Jane' });
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .put('/api/endpoints/non-existent')
        .send({ response: {} });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/endpoints/:id', () => {
    it('should delete an endpoint', async () => {
      const created = await request(app)
        .post('/api/endpoints')
        .send({ path: '/api/users', method: 'GET', response: {} });

      const response = await request(app).delete(`/api/endpoints/${created.body.id}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app).get(`/api/endpoints/${created.body.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app).delete('/api/endpoints/non-existent');

      expect(response.status).toBe(404);
    });
  });
});

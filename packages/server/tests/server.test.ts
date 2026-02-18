import request from 'supertest';
import express from 'express';
import { endpointModel } from '../src/models/Endpoint';
import mockRoutes from '../src/routes/mockRoutes';

describe('Mock Server Integration', () => {
  let app: express.Application;

  beforeEach(() => {
    endpointModel.clear();
    app = express();
    app.use(express.json());
    app.use('/api', mockRoutes);
    
    app.all('*', async (req, res) => {
      const endpoint = endpointModel.findByPath(req.path, req.method);
      if (!endpoint) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      if (endpoint.delay && endpoint.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, endpoint.delay));
      }
      res.json(endpoint.response);
    });
  });

  describe('Mock Endpoint Response', () => {
    it('should respond with configured JSON', async () => {
      await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/users',
          method: 'GET',
          response: { users: [{ name: 'John' }] },
        });

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ users: [{ name: 'John' }] });
    });

    it('should respond with 404 for non-existent endpoint', async () => {
      const response = await request(app).get('/api/non-existent');
      expect(response.status).toBe(404);
    });

    it('should support POST method', async () => {
      await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/users',
          method: 'POST',
          response: { success: true },
        });

      const response = await request(app).post('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should support PUT method', async () => {
      await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/users/1',
          method: 'PUT',
          response: { id: 1, updated: true },
        });

      const response = await request(app).put('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, updated: true });
    });

    it('should support DELETE method', async () => {
      await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/users/1',
          method: 'DELETE',
          response: { deleted: true },
        });

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ deleted: true });
    });
  });

  describe('Delay', () => {
    it('should delay response when configured', async () => {
      const start = Date.now();
      
      await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/delay',
          method: 'GET',
          response: { delayed: true },
          delay: 100,
        });

      const response = await request(app).get('/api/delay');
      const elapsed = Date.now() - start;

      expect(response.status).toBe(200);
      expect(elapsed).toBeGreaterThanOrEqual(90);
    });

    it('should respond immediately when no delay', async () => {
      await request(app)
        .post('/api/endpoints')
        .send({
          path: '/api/nodelay',
          method: 'GET',
          response: { fast: true },
        });

      const start = Date.now();
      const response = await request(app).get('/api/nodelay');
      const elapsed = Date.now() - start;

      expect(response.status).toBe(200);
      expect(elapsed).toBeLessThan(50);
    });
  });
});

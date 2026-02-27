import { Router, Request, Response } from 'express';
import { wsEndpointModel } from '../models/WsEndpoint';
import { CreateWsEndpointDto, UpdateWsEndpointDto } from '../types';

const router = Router();

router.post('/ws-endpoints', (req: Request, res: Response) => {
  try {
    const { path, eventType, response, responseType, delay, authRequired } = req.body;

    if (!path) {
      return res.status(400).json({
        error: 'Path is required',
      });
    }

    const dto: CreateWsEndpointDto = {
      path,
      eventType,
      response,
      responseType,
      delay,
      authRequired,
    };

    const endpoint = wsEndpointModel.create(dto);
    res.status(201).json(endpoint);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/ws-endpoints', (_req: Request, res: Response) => {
  const endpoints = wsEndpointModel.findAll();
  res.json(endpoints);
});

router.get('/ws-endpoints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const endpoint = wsEndpointModel.findById(id);

  if (!endpoint) {
    return res.status(404).json({ error: 'WebSocket endpoint not found' });
  }

  res.json(endpoint);
});

router.put('/ws-endpoints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { path, eventType, response, responseType, delay, authRequired } = req.body;

  const dto: UpdateWsEndpointDto = {};
  if (path) dto.path = path;
  if (eventType) dto.eventType = eventType;
  if (response !== undefined) dto.response = response;
  if (responseType) dto.responseType = responseType;
  if (delay !== undefined) dto.delay = delay;
  if (authRequired !== undefined) dto.authRequired = authRequired;

  const endpoint = wsEndpointModel.update(id, dto);

  if (!endpoint) {
    return res.status(404).json({ error: 'WebSocket endpoint not found' });
  }

  res.json(endpoint);
});

router.delete('/ws-endpoints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = wsEndpointModel.delete(id);

  if (!deleted) {
    return res.status(404).json({ error: 'WebSocket endpoint not found' });
  }

  res.status(204).send();
});

router.delete('/ws-endpoints', (_req: Request, res: Response) => {
  wsEndpointModel.clear();
  res.json({ message: 'All WebSocket endpoints cleared' });
});

export default router;

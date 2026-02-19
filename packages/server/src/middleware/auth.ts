import { Request, Response, NextFunction } from 'express';
import { authModel } from '../models/Auth';
import { endpointModel } from '../models/Endpoint';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!authModel.isEnabled()) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const path = req.path;
  const method = req.method;

  const endpoint = endpointModel.findByPath(path, method);
  if (!endpoint || !endpoint.authRequired) {
    return next();
  }

  const authType = authModel.getAuthType();

  if (authType === 'basic') {
    const basicAuth = authHeader?.startsWith('Basic ');
    if (basicAuth && authHeader) {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString().split(':');
      const username = credentials[0];
      const password = credentials[1];
      
      const user = authModel.validateCredentials(username, password);
      if (user) {
        req.user = { id: user.id, username: user.username };
        return next();
      }
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="Protected"');
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (authType === 'apiKey') {
    const apiKey = authModel.getApiKey();
    if (apiKey && authHeader === `Bearer ${apiKey}`) {
      return next();
    }
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  if (authType === 'bearer' || authType === 'jwt') {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'Token required' });
      return;
    }

    try {
      const jwtSecret = authModel.getJwtSecret();
      if (!jwtSecret) {
        res.status(500).json({ error: 'JWT not configured' });
        return;
      }

      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      req.user = { id: payload.sub, username: payload.username };
      next();
      return;
    } catch {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  }

  next();
}

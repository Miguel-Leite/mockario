import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { endpointModel } from './models/Endpoint';
import mockRoutes from './routes/mockRoutes';
import { MockServerConfig, RequestLog, HttpMethod } from './types';

export class MockServer {
  private app: Application;
  private server: any;
  private port: number;
  private logs: RequestLog[] = [];

  constructor(config: MockServerConfig = {}) {
    this.app = express();
    this.port = config.port || 3001;

    this.app.use(cors());
    this.app.use(express.json());

    this.setupLogging();
    this.setupMockRoutes();
    this.setupMockHandler();
  }

  private setupLogging(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const log: RequestLog = {
          id: uuidv4(),
          endpointId: '',
          path: req.path,
          method: req.method,
          status: res.statusCode,
          timestamp: new Date(),
          responseTime: Date.now() - start,
        };

        const endpoint = endpointModel.findByPath(req.path, req.method as HttpMethod);
        if (endpoint) {
          log.endpointId = endpoint.id;
        }

        this.logs.push(log);
        console.log(`[${log.timestamp.toISOString()}] ${log.method} ${log.path} - ${log.status} (${log.responseTime}ms)`);
      });

      next();
    });
  }

  private setupMockRoutes(): void {
    this.app.use('/api', mockRoutes);
  }

  private setupMockHandler(): void {
    this.app.all('*', async (req: Request, res: Response) => {
      const endpoint = endpointModel.findByPath(req.path, req.method as HttpMethod);

      if (!endpoint) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      if (endpoint.delay && endpoint.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
      }

      res.json(endpoint.response);
    });
  }

  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Mock server running on http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }

  public getLogs(): RequestLog[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public getPort(): number {
    return this.port;
  }
}

export function startMockServer(config?: MockServerConfig): MockServer {
  const server = new MockServer(config);
  server.start();
  return server;
}

export function createMockServer(config?: MockServerConfig): MockServer {
  return new MockServer(config);
}

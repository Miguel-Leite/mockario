import { v4 as uuidv4 } from 'uuid';
import { RequestLog } from '../types';

class Logger {
  private logs: RequestLog[] = [];

  addLog(log: Omit<RequestLog, 'id'>): RequestLog {
    const newLog: RequestLog = {
      id: uuidv4(),
      ...log,
    };
    this.logs.push(newLog);
    return newLog;
  }

  getLogs(): RequestLog[] {
    return this.logs;
  }

  clear(): void {
    this.logs = [];
  }

  getLogCount(): number {
    return this.logs.length;
  }
}

export const logger = new Logger();

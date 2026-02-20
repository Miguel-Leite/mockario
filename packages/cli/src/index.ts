#!/usr/bin/env node

import { Command } from 'commander';
import { startCommand } from './commands/start';
import { serverCommand } from './commands/server';

const program = new Command();

program
  .name('mockario')
  .description('Mock APIs rapidinho - Server + UI for creating mock endpoints')
  .version('1.0.0');

program
  .command('start')
  .description('Start Mockario with server and built-in web interface')
  .option('-p, --port <port>', 'Server port', '3001')
  .option('-w, --web-port <port>', 'Web UI port', '5173')
  .option('--no-open', 'Do not open browser automatically')
  .action(startCommand);

program
  .command('server')
  .description('Start only the mock server (without web UI)')
  .option('-p, --port <port>', 'Server port', '3001')
  .action(serverCommand);

program
  .command('web')
  .description('Start only the web UI (requires running server)')
  .option('-p, --port <port>', 'Web UI port', '5173')
  .option('-a, --api-url <url>', 'API URL', 'http://localhost:3001')
  .action(async (options) => {
    const { spawn } = await import('child_process');
    spawn('npm', ['run', 'web'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, VITE_WEB_PORT: options.port, VITE_API_URL: options.apiUrl }
    });
  });

program.parse();

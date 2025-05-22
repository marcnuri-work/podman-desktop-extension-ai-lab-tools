import express from 'express';
import { Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Closable } from './backend';

const DEFAULT_TARGET_URL = 'http://192.168.5.12:11434';

export class ProxyServer implements Closable {
  private readonly app: express.Express;
  private server: Server;

  constructor(
    private port?: number,
    private targetUrl: string = DEFAULT_TARGET_URL,
  ) {
    this.app = express();
    const proxyOptions = {
      target: targetUrl,
      changeOrigin: true,
      logLevel: 'debug',
    };
    this.app.use('/', createProxyMiddleware(proxyOptions));
  }

  public async start(): Promise<void> {
    process.on('SIGINT', () => {
      console.log('SIGINT signal received. Shutting down...');
      this.close().finally(() => {
        process.exit(0);
      });
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10_000);
    });
    return new Promise<void>(resolve => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Reverse proxy server started on port ${this.server.address()['port']}`);
        console.log(`Forwarding requests to: ${this.targetUrl}`);
        resolve();
      });
    });
  }

  public async close(): Promise<void> {
    if (this.server) {
      return new Promise<void>(resolve => {
        this.server.close(() => {
          console.log('Server closed successfully');
          resolve();
        });
      });
    }
  }

  public address(): AddressInfo {
    return this.server.address() as AddressInfo;
  }
}

import {Webview} from '@podman-desktop/api';
import {IMessage, isMessageRequest} from '@shared/messages/MessageProxy';
import express from 'express';
import {Buffer} from 'node:buffer';
import console from 'node:console';
import {Server as HttpServer} from 'node:http';
import {ViteDevServer} from 'vite';
import {WebSocketServer, WebSocket} from 'ws';
import {Closable} from './closable';
import {StudioExtension} from './studio-extension';
import {ProxyServer} from '../';

export class Server implements Webview, Closable {

  private readonly studioExtension: StudioExtension;
  private readonly app: express.Express;
  private readonly connections: WebSocket[];
  private readonly ollamaProxy: ProxyServer;
  private server: HttpServer;
  private webSocketServer: WebSocketServer;

  constructor(
    appUserDirectory: string,
    private port: number,
    frontendServer: ViteDevServer,
  ) {
    this.studioExtension = new StudioExtension(appUserDirectory, port, this);
    this.app = express();
    this.app.use(express.json());
    this.app.use(frontendServer.middlewares);
    this.connections = [];
    this.ollamaProxy = new ProxyServer()
  }

  async postMessage(message: unknown): Promise<boolean> {
    console.log('Webview.postMessage', message);
    this.connections.forEach(ws => {
      ws.send(JSON.stringify(message));
    });
    return true;
  }

  async init(): Promise<void> {
    await this.ollamaProxy.start();
    await this.studioExtension.init(this.ollamaProxy.address().port);
    this.server = this.app.listen(this.port);
    this.webSocketServer = new WebSocketServer({server: this.server});
    this.webSocketServer.on('connection', this.onConnection.bind(this));
    console.log(`Backend server started, listening on port ${this.port}`);
  }

  async close(): Promise<void> {
    if (this.studioExtension) {
      await this.studioExtension.close();
    }
    this.connections.forEach(ws => {
      ws.close(1000, 'Server is shutting down');
    });
    if (this.webSocketServer) {
      await this.webSocketServer.close();
    }
    if (this.server) {
      await new Promise<void>(
        (resolve) => {
          this.server.closeAllConnections();
          this.server.close(() => {
            console.log('Express server closed');
            resolve();
          });
        });
    }
    console.log('Backend server closed');
  }

  private onConnection(ws: WebSocket): void {
    this.connections.push(ws);
    ws.on('message', (data: Buffer, isBinary: boolean) => this.onMessage(data, isBinary).catch(console.error));
    ws.on('close', () => {
      const index = this.connections.indexOf(ws);
      if (index !== -1) {
        this.connections.splice(index, 1);
      }
    });
    console.log('WebSocket connection established');
  }

  private async onMessage(data: Buffer, _isBinary: boolean): Promise<void> {
    const message = JSON.parse(data.toString());
    if (!isMessageRequest(message)) {
      console.warn('Received incompatible message:', message);
      return;
    }
    if (!this.studioExtension[message.method]) {
      console.warn('Unsupported method (please implement):', message.method);
      return;
    }
    try {
      console.log('Calling method:', message.method);
      let result = this.studioExtension[message.method](...message.args);
      if (result instanceof Promise) {
        result = await result;
      }
      this.connections.forEach(ws => {
        ws.send(JSON.stringify({
          id: message.id,
          channel: message.channel,
          method: message.method,
          body: result,
          status: 'success',
        } as IMessage));
      });
    } catch (error: unknown) {
      this.connections.forEach(ws => {
        ws.send(JSON.stringify({
          id: message.id,
          channel: message.channel,
          method: message.method,
          body: error,
          status: 'error',
        } as IMessage));
      });
    }
  }

}

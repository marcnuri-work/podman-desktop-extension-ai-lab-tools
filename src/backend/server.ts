import express from 'express';
import * as http from 'node:http';
import {Closable} from './closable';
import {StudioExtension} from './studio-extension';
import {ViteDevServer} from "vite";

export class Server implements Closable {
  private readonly studioExtension: StudioExtension;
  private readonly app: express.Express;
  private server: http.Server;
  constructor(
    private appUserDirectory: string,
    private port: number,
    frontendServer: ViteDevServer
  ) {
    this.studioExtension = new StudioExtension(appUserDirectory, port);
    this.app = express();
    // Order is important
    this.app.use(express.json());
    this.app.use(this.studioExtension.middleware.bind(this.studioExtension));
    this.app.use(frontendServer.middlewares);
  }

  async init(): Promise<void> {
    await this.studioExtension.init();
    this.server = this.app.listen(this.port);
    console.log(`Backend server started, listening on port ${this.port}`);
  }

  async close(): Promise<void> {
    if (this.studioExtension) {
      await this.studioExtension.close();
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



}

import {type Disposable, Webview} from '@podman-desktop/api';
import {RpcExtension} from 'podman-desktop-extension-ai-lab-shared/src/messages/MessageProxy';
import {CatalogManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import {InferenceManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import {ModelsManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/modelsManager';
import {
  CancellationTokenRegistry
} from 'podman-desktop-extension-ai-lab-backend/src/registries/CancellationTokenRegistry';
import {ModelHandlerRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/ModelHandlerRegistry';
import {TaskRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/TaskRegistry';
import {NextFunction, Request, Response} from 'express';
import {TelemetryLogger} from '../__tests__/@podman-desktop/api';
import {ServerWebview} from './server-webview';
import {StaticInferenceManager} from './static-inference-manager';
import {StaticModelsManager} from './static-models-manager';
import {StaticCatalogManager} from './static-catalog-manager';
import {ExtendedPlaygroundManager} from './extended-playground-manager';
import type {ExtensionConfiguration} from '@shared/models/IExtensionConfiguration';
import {Closable} from "./closable";
// Requires more complexity and is not really compatible with tsx
// import {Studio} from 'podman-desktop-extension-ai-lab-backend/src/studio';


export class StudioExtension implements Closable {
  private readonly webview: Webview;
  private readonly rpcExtension: RpcExtension;
  private readonly modelHandlerRegistry: ModelHandlerRegistry
  private readonly modelsManager: ModelsManager;
  private readonly catalogManager: CatalogManager;
  private readonly inferenceManager: InferenceManager;
  private readonly cancellationTokenRegistry: CancellationTokenRegistry;
  private readonly taskRegistry: TaskRegistry;
  private readonly telemetryLogger: TelemetryLogger;
  private readonly playgroundManager: ExtendedPlaygroundManager;

  constructor(
    private appUserDirectory: string,
    private port: number,
  ) {
    this.webview = new ServerWebview() as unknown as Webview;
    this.rpcExtension = new RpcExtension(this.webview);
    this.modelHandlerRegistry = new ModelHandlerRegistry(this.rpcExtension);
    this.modelsManager = new StaticModelsManager(this.modelHandlerRegistry);
    this.catalogManager = new StaticCatalogManager(this.modelsManager);
    this.inferenceManager = new StaticInferenceManager(this.modelsManager);
    this.playgroundManager = new ExtendedPlaygroundManager(
      this.modelsManager,
      appUserDirectory,
      this.rpcExtension,
      this.inferenceManager,
      this.taskRegistry,
      this.telemetryLogger,
      this.cancellationTokenRegistry
    );
  }

  public async init(): Promise<void> {
    await this.playgroundManager.initTestData();
  }

  public middleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.url.startsWith('/api')) {
      next();
      return;
    }
    console.log(req.body);
    switch (req.body.method) {
      case 'getInferenceServers': {
        res.json(this.inferenceManager.getServers());
        break;
      }
      case 'getModelsInfo': {
        res.json(this.modelsManager.getModelsInfo());
        break;
      }
      case 'getCatalog': {
        res.json(this.catalogManager.getCatalog());
        break;
      }
      case 'getPlaygroundConversations': {
        res.json(this.playgroundManager.getConversations());
        break;
      }
      case 'getExtensionConfiguration': {
        res.json({
          experimentalGPU: true,
          modelsPath: this.appUserDirectory,
          apiPort: this.port,
          appearance: 'dark'
        } as ExtensionConfiguration);
        break;
      }
      case 'getPodmanDesktopVersion': {
        res.json('1.33.7');
        break;
      }
      case 'readRoute': {
        res.json('');
      }
    }
  }

  async close(): Promise<void> {
    const disposables: Disposable[] = [
      this.rpcExtension,
      this.modelsManager,
      this.catalogManager,
      this.playgroundManager
    ];
    disposables.forEach(disposable => disposable.dispose());
  }
}

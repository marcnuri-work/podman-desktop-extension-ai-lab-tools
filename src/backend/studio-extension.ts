import {type Disposable, Webview} from '@podman-desktop/api';
import type {ApplicationCatalog} from '@shared/models/IApplicationCatalog';
import type {ExtensionConfiguration} from '@shared/models/IExtensionConfiguration';
import type {InferenceServer} from '@shared/models/IInference';
import type {ModelInfo} from '@shared/models/IModelInfo';
import type {Conversation} from '@shared/models/IPlaygroundMessage';
import type {Task} from '@shared/models/ITask';
import {RpcExtension} from 'podman-desktop-extension-ai-lab-shared/src/messages/MessageProxy';
import {CatalogManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import {InferenceManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import {ModelsManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/modelsManager';
import {
  CancellationTokenRegistry
} from 'podman-desktop-extension-ai-lab-backend/src/registries/CancellationTokenRegistry';
import {ModelHandlerRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/ModelHandlerRegistry';
import {TaskRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/TaskRegistry';
import {TelemetryLogger} from './podman-desktop-api';
import {StaticInferenceManager} from './static-inference-manager';
import {StaticModelsManager} from './static-models-manager';
import {StaticCatalogManager} from './static-catalog-manager';
import {ExtendedPlaygroundManager} from './extended-playground-manager';
import {Closable} from './closable';
// Requires more complexity and is not really compatible with tsx
// import {Studio} from 'podman-desktop-extension-ai-lab-backend/src/studio';


export class StudioExtension implements Closable {
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
    private readonly webview: Webview,
  ) {
    this.rpcExtension = new RpcExtension(this.webview);
    this.modelHandlerRegistry = new ModelHandlerRegistry(this.rpcExtension);
    this.modelsManager = new StaticModelsManager(this.modelHandlerRegistry);
    this.catalogManager = new StaticCatalogManager(this.modelsManager);
    this.inferenceManager = new StaticInferenceManager(this.modelsManager);
    this.taskRegistry = new TaskRegistry(this.rpcExtension);
    this.telemetryLogger = new TelemetryLogger();
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

  public getCatalog(): ApplicationCatalog {
    return this.catalogManager.getCatalog();
  }

  public getExtensionConfiguration(): ExtensionConfiguration {
    return {
      experimentalGPU: true,
      modelsPath: this.appUserDirectory,
      apiPort: this.port,
      appearance: 'dark'
    } as ExtensionConfiguration;
  }

  public getInferenceServers(): InferenceServer[] {
    return this.inferenceManager.getServers();
  }

  public getModelsInfo(): ModelInfo[] {
    return this.modelsManager.getModelsInfo();
  }

  public getPlaygroundConversations(): Conversation[] {
    return this.playgroundManager.getConversations();
  }

  public getPodmanDesktopVersion(): string {
    return '1.33.7';
  }

  public getTasks(): Task[] {
    return this.taskRegistry.getTasks();
  }

  public requestCreatePlayground(name: string, model: ModelInfo) {
    return this.playgroundManager.requestCreatePlayground(name, model);
  }

  public readRoute(): string {
    return '';
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

import {
  type Disposable,
  type Webview,
  NoOpTelemetryLogger,
  type TelemetryLogger,
  disposables,
} from '@podman-desktop/api';
import type { ApplicationCatalog } from '@shared/models/IApplicationCatalog';
import type { ExtensionConfiguration } from '@shared/models/IExtensionConfiguration';
import type { InferenceServer } from '@shared/models/IInference';
import type { ModelInfo } from '@shared/models/IModelInfo';
import type { ModelOptions } from '@shared/models/IModelOptions';
import type { Conversation } from '@shared/models/IPlaygroundMessage';
import type { Task } from '@shared/models/ITask';
import { RpcExtension } from 'podman-desktop-extension-ai-lab-shared/src/messages/MessageProxy';
import { ModelsManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/modelsManager';
import { McpServerManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/playground/McpServerManager';
import { CancellationTokenRegistry } from 'podman-desktop-extension-ai-lab-backend/src/registries/CancellationTokenRegistry';
import { ModelHandlerRegistry } from 'podman-desktop-extension-ai-lab-backend/src/registries/ModelHandlerRegistry';
import { TaskRegistry } from 'podman-desktop-extension-ai-lab-backend/src/registries/TaskRegistry';
import { StaticInferenceManager } from './static-inference-manager';
import { StaticCatalogManager } from './static-catalog-manager';
import { ExtendedPlaygroundManager } from './extended-playground-manager';
import { Closable } from './closable';
// Requires more complexity and is not really compatible with tsx
// import {Studio} from 'podman-desktop-extension-ai-lab-backend/src/studio';

export class StudioExtension implements Closable {
  private readonly rpcExtension: RpcExtension;
  private readonly catalogManager: StaticCatalogManager;
  private readonly telemetryLogger: TelemetryLogger;
  private readonly taskRegistry: TaskRegistry;
  private readonly cancellationTokenRegistry: CancellationTokenRegistry;
  private readonly modelHandlerRegistry: ModelHandlerRegistry;
  private readonly modelsManager: ModelsManager;
  private readonly inferenceManager: StaticInferenceManager;
  private readonly mcpServerManager: McpServerManager;
  private readonly playgroundManager: ExtendedPlaygroundManager;

  constructor(
    private appUserDirectory: string,
    private port: number,
    private readonly webview: Webview,
  ) {
    this.rpcExtension = new RpcExtension(this.webview);
    this.catalogManager = new StaticCatalogManager(this.rpcExtension, appUserDirectory);
    this.telemetryLogger = new NoOpTelemetryLogger();
    this.taskRegistry = new TaskRegistry(this.rpcExtension);
    this.cancellationTokenRegistry = new CancellationTokenRegistry();
    this.modelHandlerRegistry = new ModelHandlerRegistry(this.rpcExtension);
    this.modelsManager = new ModelsManager(
      this.rpcExtension,
      this.catalogManager,
      this.telemetryLogger,
      this.taskRegistry,
      this.cancellationTokenRegistry,
      undefined,
      undefined,
      this.modelHandlerRegistry,
    );
    this.inferenceManager = new StaticInferenceManager(this.catalogManager);
    this.mcpServerManager = new McpServerManager(this.rpcExtension, this.appUserDirectory);
    this.playgroundManager = new ExtendedPlaygroundManager(
      this.catalogManager,
      this.rpcExtension,
      this.inferenceManager,
      this.taskRegistry,
      this.telemetryLogger,
      this.cancellationTokenRegistry,
      this.mcpServerManager,
    );
  }

  public async init(ollamaPort: number, aiLabPort: number): Promise<void> {
    this.rpcExtension.init();
    this.mcpServerManager.init();
    this.inferenceManager.ollamaPort = ollamaPort;
    this.inferenceManager.aiLabPort = aiLabPort;
    await this.catalogManager.initTestData();
    this.modelsManager.init();
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
      appearance: 'dark',
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

  public submitPlaygroundMessage(containerId: string, userInput: string, options?: ModelOptions): Promise<number> {
    return this.playgroundManager.submit(containerId, userInput, options);
  }

  async close(): Promise<void> {
    const toDispose: Disposable[] = [
      this.rpcExtension,
      this.modelsManager,
      this.catalogManager,
      this.playgroundManager,
      ...disposables,
    ];
    toDispose.forEach(disposable => disposable.dispose());
  }
}

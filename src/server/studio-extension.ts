import {RpcExtension} from 'podman-desktop-extension-ai-lab-shared/src/messages/MessageProxy';
import {InferenceManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import {CatalogManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import {ModelsManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/modelsManager';
import {PlaygroundV2Manager} from 'podman-desktop-extension-ai-lab-backend/src/managers/playgroundV2Manager';
import {PodmanConnection} from 'podman-desktop-extension-ai-lab-backend/src/managers/podmanConnection';
import {CancellationTokenRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/CancellationTokenRegistry';
import {ContainerRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/ContainerRegistry';
import {InferenceProviderRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/InferenceProviderRegistry';
import {TaskRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/TaskRegistry';
import {NextFunction, Request, Response} from 'express';
import {TelemetryLogger} from '../__tests__/@podman-desktop/api';
// Requires more complexity and is not really compatible with tsx
// import {Studio} from 'podman-desktop-extension-ai-lab-backend/src/studio';


export class StudioExtension {
  private readonly rpcExtension: RpcExtension;
  private readonly cancellationTokenRegistry: CancellationTokenRegistry;
  private readonly containerRegistry: ContainerRegistry;
  private readonly inferenceProviderRegistry: InferenceProviderRegistry;
  private readonly taskRegistry: TaskRegistry;
  private readonly podmanConnection: PodmanConnection;
  private readonly modelsManager: ModelsManager;
  private readonly telemetryLogger: TelemetryLogger;
  private readonly catalogManager: CatalogManager;
  private readonly inferenceManager: InferenceManager;
  private readonly playgroundManager: PlaygroundV2Manager;

  constructor(
    appUserDirectory: string,
    port: number,
  ) {
    this.rpcExtension = new RpcExtension(undefined);
    this.inferenceManager = new InferenceManager(
      this.rpcExtension,
      this.containerRegistry,
      this.podmanConnection,
      this.modelsManager,
      this.telemetryLogger,
      this.taskRegistry,
      this.inferenceProviderRegistry,
      this.catalogManager
    );
    this.playgroundManager = new PlaygroundV2Manager(
      appUserDirectory,
      this.rpcExtension,
      this.inferenceManager,
      this.taskRegistry,
      this.telemetryLogger,
      this.cancellationTokenRegistry
    )
  }

  public middleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.url.startsWith('/api')) {
      next();
      return;
    }
    console.log(req.body);
  }
}

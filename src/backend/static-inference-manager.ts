import {CatalogManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import {InferenceManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import {InferenceServer} from '@shared/models/IInference';

export class StaticInferenceManager extends InferenceManager {

  private readonly catalogManagerInstance: CatalogManager;
  public ollamaPort: number = 3000;

  constructor(
    catalogManager: CatalogManager,
  ) {
    super(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      catalogManager
    );
    this.catalogManagerInstance = catalogManager;
  }

  isInitialize(): boolean {
    return true;
  }

  getServers(): InferenceServer[] {
    return [{
      status: 'running',
      labels: {},
      health: {
        Status: 'healthy',
      },
      container: {
        engineId: 'ollama',
        containerId: `remote-ollama-server-${this.ollamaPort}`,
      },
      models: this.catalogManagerInstance.getModels(),
      connection: {
        port: this.ollamaPort,
      },
    } as InferenceServer];
  }
}

import { CatalogManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import { InferenceManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import { InferenceServer } from '@shared/models/IInference';

export class StaticInferenceManager extends InferenceManager {
  private readonly catalogManagerInstance: CatalogManager;
  public ollamaPort: number = 1337;
  public aiLabPort: number = 1337;

  constructor(catalogManager: CatalogManager) {
    super(undefined, undefined, undefined, undefined, undefined, undefined, undefined, catalogManager);
    this.catalogManagerInstance = catalogManager;
  }

  isInitialize(): boolean {
    return true;
  }

  getServers(): InferenceServer[] {
    return [
      {
        container: {
          engineId: 'ollama',
          containerId: `remote-ollama-server-${this.ollamaPort}`,
        },
        status: 'running',
        labels: {},
        health: { Status: 'healthy' },
        models: this.catalogManagerInstance.getModels().filter(m => m.id.startsWith('ollama-')),
        connection: { port: this.ollamaPort },
      } as InferenceServer,
      {
        container: {
          engineId: 'aiLab',
          containerId: `remote-ai-lab-server-${this.ollamaPort}`,
        },
        status: 'running',
        labels: {},
        health: { Status: 'healthy' },
        models: this.catalogManagerInstance.getModels().filter(m => m.id.startsWith('ai-lab-')),
        connection: { port: this.aiLabPort },
      } as InferenceServer,
    ];
  }
}

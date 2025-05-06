import {InferenceManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import {InferenceServer} from '@shared/models/IInference';
import {ModelsManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/modelsManager';

export class StaticInferenceManager extends InferenceManager {

  readonly modelsManagerInstance: ModelsManager;

  constructor(modelsManager: ModelsManager) {
    super(
      undefined,
      undefined,
      undefined,
      modelsManager,
      undefined,
      undefined,
      undefined,
      undefined
    );
    this.modelsManagerInstance = modelsManager;
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
        engineId: 'static-server',
        containerId: 'static-server-fake-container',
      },
      models: this.modelsManagerInstance.getModelsInfo(),
      connection: {
        port: 3000,
      },
    } as InferenceServer];
  }
}

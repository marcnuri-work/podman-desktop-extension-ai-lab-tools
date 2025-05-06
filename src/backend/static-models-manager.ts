import {ModelsManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/modelsManager';
import type {ModelHandlerRegistry} from 'podman-desktop-extension-ai-lab-backend/src/registries/ModelHandlerRegistry';
import {ModelInfo} from '@shared/models/IModelInfo';
import {InferenceType} from '@shared/models/IInference';

const models: ModelInfo[] = [
  {
    id: 'ibm-granite-3.3',
    name: 'granite3.3:latest',
    description: 'IBM Granite 3.3',
    file: { file: 'ibm-granite-3.3.gguf', path: ''},
    url: 'https://example.com/ibm-granite-3.3',
    backend: InferenceType.LLAMA_CPP,
  },
];

export class StaticModelsManager extends ModelsManager {
  constructor(modelHandlerRegistry: ModelHandlerRegistry) {
    super(undefined, undefined, undefined, undefined, undefined, undefined, undefined, modelHandlerRegistry);
  }
  getModelsInfo(): ModelInfo[] {
    return models;
  }
}

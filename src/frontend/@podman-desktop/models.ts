import { ModelInfo } from '@shared/models/IModelInfo';
import { InferenceType } from '@shared/models/IInference';

export function getModelsInfo(): ModelInfo[] {
  return [
    {
      id: 'model-1',
      file: { file: 'model.gguf', path: '/tmp' },
      name: 'Model Number 1',
      description: 'The first model',
      backend: InferenceType.LLAMA_CPP,
    },
  ];
}

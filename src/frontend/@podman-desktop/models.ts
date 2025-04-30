import {ModelInfo} from "@shared/models/IModelInfo";
import { InferenceType } from '@shared/models/IInference';

export const getModelsInfo: Array<ModelInfo> = () => {
  return [
    {id: 'model-1', file: 'file', name: 'Model Number 1', backend: InferenceType.LLAMA_CPP}
  ];
};

import {ModelInfo} from "@shared/models/IModelInfo";
import { InferenceType } from '@shared/models/IInference';

export const getModelsInfo: Array<ModelInfo> = () => {
  return [
    {id: 'a-model', file: 'file', name: 'A model!', backend: InferenceType.LLAMA_CPP}
  ]
};

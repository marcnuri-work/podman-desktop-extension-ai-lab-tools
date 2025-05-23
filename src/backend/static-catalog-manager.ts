import { CatalogManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import { type ApplicationCatalog } from '@shared/models/IApplicationCatalog';
import { InferenceType } from '@shared/models/IInference';

export class StaticCatalogManager extends CatalogManager {
  async initTestData(): Promise<void> {
    Object.assign(this.getCatalog(), {
      version: '1.33.7',
      recipes: [],
      models: [
        {
          id: 'ollama-ibm-granite-3.3',
          name: 'granite3.3:latest',
          description: 'IBM Granite 3.3',
          file: { file: 'ibm-granite-3.3.gguf', path: '/tmp' },
          url: 'https://example.com/ibm-granite-3.3',
          backend: InferenceType.LLAMA_CPP,
        },
        {
          id: 'ai-lab-ibm-granite-3.3',
          name: 'ibm-granite/granite-3.3-8b-instruct-GGUF',
          description: 'Granite-3.3-8B-Instruct',
          file: { file: 'ibm-granite-3.3-instruct.gguf', path: '/tmp' },
          url: 'https://example.com/ibm-granite-3.3-instruct',
          backend: InferenceType.LLAMA_CPP,
        },
      ],
      categories: [],
    } as ApplicationCatalog);
  }
}

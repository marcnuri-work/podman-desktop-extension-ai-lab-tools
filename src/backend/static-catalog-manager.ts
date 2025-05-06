import {CatalogManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import {ModelsManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/modelsManager';
import {ApplicationCatalog} from '@shared/models/IApplicationCatalog';

export class StaticCatalogManager extends CatalogManager {

  readonly modelsManager: ModelsManager;

  constructor(modelsManager: ModelsManager) {
    super(undefined, undefined);
    this.modelsManager = modelsManager;
  }

  getCatalog(): ApplicationCatalog {
    return {
      version: '1.33.7',
      recipes: [],
      models: this.modelsManager.getModelsInfo(),
      categories: [],
    };
  }
}

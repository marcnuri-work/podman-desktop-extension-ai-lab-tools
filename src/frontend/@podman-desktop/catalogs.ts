import { ApplicationCatalog } from '@shared/models/IApplicationCatalog';
import { getModelsInfo } from './models';

export function getCatalog(): ApplicationCatalog {
  return {
    version: '1.33.7',
    recipes: [],
    models: getModelsInfo(),
    categories: [],
  };
}

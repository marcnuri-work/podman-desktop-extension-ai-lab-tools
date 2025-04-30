import { ApplicationCatalog } from '@shared/models/IApplicationCatalog';
import { getModelsInfo } from './models';

export const getCatalog: ApplicationCatalog = () => {
  return {
    version: '1.33.7',
    recipes: [],
    models: getModelsInfo(),
    categories: [],
  };
};

import { Type } from '@cometx-server/common';
import { getAllEntities } from '@cometx-server/transaction';
import { getConfig, setConfig } from '../config.helpers';
import { CometXConfig } from '../config.interface';

export function preBootstrapConfig(
  userConfig: Partial<CometXConfig>,
  coreEntitiesMap: Array<Type<any>>,
) {
  if (userConfig) {
    setConfig(userConfig);
  }

  const entities = getAllEntities(coreEntitiesMap);

  setConfig({
    databaseConfig: {
      entities,
    },
  });

  const config = getConfig();

  return config;
}

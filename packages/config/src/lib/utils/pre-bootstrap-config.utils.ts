import { Type } from '@cometx-server/common';
import { setEntityIdStrategy } from '@cometx-server/entity';
import { getConfig, setConfig } from '../config.helpers';
import { CometXConfig } from '../config.interface';

export function preBootstrapConfig(
  userConfig: Partial<CometXConfig>,
  entities: Array<Type<any>>,
) {
  if (userConfig) {
    setConfig(userConfig);
  }

  Object.assign(userConfig, {
    databaseConfig: {
      entities,
    },
  });

  setConfig(userConfig);

  const config = getConfig();
  const { entityIdStrategy } = config.entityConfig;

  setEntityIdStrategy(entityIdStrategy, entities);

  return config;
}

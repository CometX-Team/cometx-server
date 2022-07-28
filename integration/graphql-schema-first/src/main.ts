import { Type } from '@cometx-server/common';
import { CometXConfig, preBootstrapConfig } from '@cometx-server/config';
import { getAllEntities } from '@cometx-server/entity';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { coreEntitiesMap } from './environments/entitiesMap';
import { config } from './environments/environment';

async function bootstrap(userConfig: Partial<CometXConfig>) {
  const entities = getAllEntities(
    coreEntitiesMap as unknown as Array<Type<any>>,
  );

  const config = preBootstrapConfig(userConfig, entities);

  const { AppModule } = await import('./app/app.module');

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const port = config.apiConfig.port || 3333;

  await app.listen(port);

  Logger.log(
    `🚀 Graphql Schema First is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap(config);

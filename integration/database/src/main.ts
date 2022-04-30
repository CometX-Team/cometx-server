/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Type } from '@cometx-server/common';
import { CometXConfig, getConfig, setConfig } from '@cometx-server/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { coreEntitiesMap } from './environments/entitiesMap';
import { config } from './environments/environment';

async function bootstrap(userConfig: Partial<CometXConfig>) {
  const config = await preBootstrap(userConfig);

  const { AppModule } = await import('./app/app.module');

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3333;

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

async function preBootstrap(userConfig: Partial<CometXConfig>) {
  if (userConfig) {
    setConfig(userConfig);
  }

  const entities = await getAllEntities();

  setConfig({
    databaseConfig: {
      entities,
    },
  });

  const config = getConfig();

  return config;
}

/**
 * Returns an array of core entities and any additional entities defined in plugins.
 */
export async function getAllEntities(): Promise<Array<Type<any>>> {
  const coreEntities = Object.values(coreEntitiesMap) as Array<Type<any>>;

  const allEntities: Array<Type<any>> = coreEntities;

  return allEntities;
}

bootstrap(config);

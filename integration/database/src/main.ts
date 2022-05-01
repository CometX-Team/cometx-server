/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Type } from '@cometx-server/common';
import {
  CometXConfig,
  getConfig,
  preBootstrapConfig,
  setConfig,
} from '@cometx-server/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { coreEntitiesMap } from './environments/entitiesMap';
import { config } from './environments/environment';

async function bootstrap(userConfig: Partial<CometXConfig>) {
  const config = preBootstrapConfig(
    userConfig,
    coreEntitiesMap as unknown as Array<Type<any>>,
  );

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

bootstrap(config);

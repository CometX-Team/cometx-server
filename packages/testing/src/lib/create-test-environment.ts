import { CometXConfig } from '@cometx-server/config';
import { Type } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { TestServer } from './server/test-server';

export function createTestEnvironment(
  config: Required<CometXConfig>,
  testModule: TestingModule,
  coreEntitiesMap: Array<Type<any>>,
) {
  const server = new TestServer(config, testModule, coreEntitiesMap);

  return {
    server,
  };
}

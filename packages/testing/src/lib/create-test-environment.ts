import { Type } from '@cometx-server/common';
import { CometXConfig } from '@cometx-server/config';
import { TestServer } from './test-server';

export function createTestEnvironment(
  config: Required<CometXConfig>,
  testModuleRef: any,
  coreEntitiesMap: Array<Type<any>>,
) {
  const server = new TestServer(config, testModuleRef, coreEntitiesMap);

  return {
    server,
  };
}

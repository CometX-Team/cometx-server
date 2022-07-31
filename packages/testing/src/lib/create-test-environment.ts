import { Type } from '@cometx-server/common';
import { CometXConfig } from '@cometx-server/config';
import { TestGraphQLClient } from './test-graphql-client';
import { TestServer } from './test-server';

export function createTestEnvironment(
  config: Required<CometXConfig>,
  testModuleRef: any,
  coreEntitiesMap: Array<Type<any>>,
) {
  const server = new TestServer(config, testModuleRef, coreEntitiesMap);
  const { port, adminApiPath } = config.apiConfig;
  const adminClient = new TestGraphQLClient(
    `http://localhost:${port}/${adminApiPath}`,
  );

  return {
    server,
    adminClient,
  };
}

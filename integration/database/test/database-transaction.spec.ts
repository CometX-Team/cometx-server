import { ConfigModule } from '@cometx-server/config';
import { createTestEnvironment, TestServer } from '@cometx-server/testing';
import { TransactionModule } from '@cometx-server/transaction';
import { Type } from '@cometx-server/common';

import { TestAdminModule, TestAdminService } from './transaction-test-plugin';
import { testConfig } from './test-environment';
import { coreEntitiesMap } from '../src/environments/entitiesMap';
import { DatabaseContextModule } from '../src/database-context/database-context.module';
import { DatabaseContextService } from '../src/database-context/database-context.service';

describe('Transaction Infrastructure', () => {
  let adminService: TestAdminService;
  let databaseContextService: DatabaseContextService;
  let testServer: TestServer;

  beforeAll(async () => {
    const moduleRef: any = {
      imports: [
        ConfigModule,
        TransactionModule.forRoot(),
        DatabaseContextModule,
        TestAdminModule,
      ],
    };

    testServer = createTestEnvironment(
      testConfig(),
      moduleRef,
      coreEntitiesMap as unknown as Array<Type<any>>,
    ).server;

    await testServer.init();

    const { testModule } = testServer;

    adminService = testModule.get(TestAdminService);
    databaseContextService = testModule.get(DatabaseContextService);
  });

  afterAll(async () => {
    await testServer.destroy();
  });

  it('create admin user', async () => {
    const ctx = await databaseContextService.create({});
    const admin = await adminService.createAdministrator(
      ctx,
      'koekoetech@gmail.com',
      false,
    );
  });
});

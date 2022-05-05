import { ConfigModule } from '@cometx-server/config';
import { createTestEnvironment, TestServer } from '@cometx-server/testing';
import { TransactionModule } from '@cometx-server/transaction';
import { Type } from '@cometx-server/common';

import { TestAdminModule, TestAdminService } from './transaction-test-plugin';
import { testConfig } from './test-environment';
import { coreEntitiesMap } from '../src/environments/entitiesMap';
import { DatabaseContextModule } from '../src/database-context/database-context.module';
import { DatabaseContextService } from '../src/database-context/database-context.service';
import { DatabaseContext } from '../src/database-context/database-context';

describe('Transaction Infrastructure', () => {
  let adminService: TestAdminService;
  let databaseContextService: DatabaseContextService;
  let testServer: TestServer;
  let ctx: DatabaseContext;

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

    ctx = await databaseContextService.create({});
  });

  afterAll(async () => {
    await testServer.destroy();
  });

  it('non failing transaction', async () => {
    const createdAdmin = await adminService.createAdministrator(
      ctx,
      'test@gmail.com',
      false,
    );

    expect(createdAdmin.emailAddress).toBe('test@gmail.com');
    expect(createdAdmin.user.identifier).toBe('test@gmail.com');

    const verify = await adminService.verify();

    expect(
      !!verify.admins.find((a: any) => a.emailAddress === 'test@gmail.com'),
    ).toBe(true);
    expect(
      !!verify.users.find((u: any) => u.identifier === 'test@gmail.com'),
    ).toBe(true);
  });

  it('failing transaction', async () => {
    try {
      await adminService.createAdministrator(ctx, 'test2@gmail.com', true);
      fail('Should have thrown');
    } catch (e) {
      expect(e.message).toContain('Failed');
    }

    const verify = await adminService.verify();

    expect(verify.admins.length).toBe(1);
    expect(verify.users.length).toBe(1);
    expect(
      !!verify.admins.find((a: any) => a.emailAddress === 'test2@gmail.com'),
    ).toBe(false);
    expect(
      !!verify.users.find((u: any) => u.identifier === 'test2@gmail.com'),
    ).toBe(false);
  });
});

import { request } from 'undici';
import { ConfigModule } from '@cometx-server/config';
import { createTestEnvironment, TestServer } from '@cometx-server/testing';
import { TransactionModule } from '@cometx-server/transaction';
import { Type } from '@cometx-server/common';

import {
  TestAdminModule,
  TestAdminServiceMock,
} from './transaction-test-plugin';
import { DatabaseAuthGuard } from '../src/guard/database.auth.guard';
import { testConfig } from './test-environment';
import { coreEntitiesMap } from '../src/environments/entitiesMap';
import { DatabaseContextModule } from '../src/database-context/database-context.module';
import { DatabaseContextService } from '../src/database-context/database-context.service';
import { DatabaseContext } from '../src/database-context/database-context';
import { APP_GUARD } from '@nestjs/core';

describe('Transaction Infrastructure', () => {
  let databaseContextService: DatabaseContextService;
  let adminService: TestAdminServiceMock;
  let testServer: TestServer;
  let ctx: DatabaseContext;
  let httpServer: string;

  beforeAll(async () => {
    const moduleRef: any = {
      imports: [
        ConfigModule,
        TransactionModule.forRoot(),
        DatabaseContextModule,
        TestAdminModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: DatabaseAuthGuard,
        },
      ],
    };

    const testEnvConfig = testConfig();

    httpServer = `http://localhost:${testEnvConfig.apiConfig.port}`;

    testServer = createTestEnvironment(
      testEnvConfig,
      moduleRef,
      coreEntitiesMap as unknown as Array<Type<any>>,
    ).server;

    await testServer.init();

    const { testModule } = testServer;

    adminService = testModule.get(TestAdminServiceMock);
    databaseContextService = testModule.get(DatabaseContextService);

    ctx = await databaseContextService.create({});
  });

  afterAll(async () => {
    await testServer.destroy();
  });

  it('should succeed transaction', async () => {
    await request(`${httpServer}/admin/createAdmin`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ emailAddress: 'testcontroller@gmail.com' }),
    });

    const verify = await adminService.verify();

    expect(verify.admins.length).toBe(1);
    expect(verify.users.length).toBe(1);
    expect(
      !!verify.admins.find(
        (a: any) => a.emailAddress === 'testcontroller@gmail.com',
      ),
    ).toBe(true);
    expect(
      !!verify.users.find(
        (u: any) => u.identifier === 'testcontroller@gmail.com',
      ),
    ).toBe(true);
  });

  it('should fail transaction', async () => {
    await request(`${httpServer}/admin/createAdmin`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        emailAddress: 'testcontroller2@gmail.com',
        fail: true,
      }),
    });

    const verify = await adminService.verify();

    expect(verify.admins.length).toBe(1);
    expect(verify.users.length).toBe(1);
    expect(
      !!verify.admins.find(
        (a: any) => a.emailAddress === 'testcontroller2@gmail.com',
      ),
    ).toBe(false);
    expect(
      !!verify.users.find(
        (u: any) => u.identifier === 'testcontroller2@gmail.com',
      ),
    ).toBe(false);
  });

  it('should succeed manual transaction', async () => {
    await request(`${httpServer}/admin/createAdminManual`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        emailAddress: 'testcontroller3@gmail.com',
      }),
    });

    const verify = await adminService.verify();

    expect(verify.admins.length).toBe(2);
    expect(verify.users.length).toBe(2);
    expect(
      !!verify.admins.find(
        (a: any) => a.emailAddress === 'testcontroller3@gmail.com',
      ),
    ).toBe(true);
    expect(
      !!verify.users.find(
        (u: any) => u.identifier === 'testcontroller3@gmail.com',
      ),
    ).toBe(true);
  });

  it('should fail manual transaction', async () => {
    await request(`${httpServer}/admin/createAdminManual`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        emailAddress: 'testcontroller4@gmail.com',
        fail: true,
      }),
    });

    const verify = await adminService.verify();

    expect(verify.admins.length).toBe(2);
    expect(verify.users.length).toBe(2);
    expect(
      !!verify.admins.find(
        (a: any) => a.emailAddress === 'testcontroller4@gmail.com',
      ),
    ).toBe(false);
    expect(
      !!verify.users.find(
        (u: any) => u.identifier === 'testcontroller4@gmail.com',
      ),
    ).toBe(false);
  });

  it('should fail manual without transaction', async () => {
    await request(`${httpServer}/admin/createAdminManualNoStartTransaction`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        emailAddress: 'testcontroller5@gmail.com',
        fail: true,
      }),
    });

    const verify = await adminService.verify();

    expect(verify.admins.length).toBe(2);
    expect(verify.users.length).toBe(3);
    expect(
      !!verify.admins.find(
        (a: any) => a.emailAddress === 'testcontroller5@gmail.com',
      ),
    ).toBe(false);
    expect(
      !!verify.users.find(
        (u: any) => u.identifier === 'testcontroller5@gmail.com',
      ),
    ).toBe(true);
  });
});

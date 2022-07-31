import { AuthGuard } from '@cometx-server/authentication';
import { Type } from '@cometx-server/common';
import { ConfigModule } from '@cometx-server/config';
import { RequestContextModule } from '@cometx-server/request-context';
import { createTestEnvironment } from '@cometx-server/testing';
import { TransactionModule } from '@cometx-server/transaction';
import { APP_GUARD } from '@nestjs/core';

import { configureGraphQLModule } from '../src/app/module.config';
import { coreEntitiesMap } from '../src/environments/entitiesMap';
import { testConfig } from './test-environment';
import {
  CREATE_ADMIN,
  CREATE_ADMIN2,
  CREATE_ADMIN3,
  CREATE_ADMIN5,
  CREATE_N_ADMINS,
  VERIFY_TEST,
} from './test.fragment';
import { TestAdminModule } from './transaction-test-plugin';

type DBType = 'mysql' | 'postgres' | 'sqlite' | 'sqljs';

const itIfDB = (dbs: DBType[]) => {
  return dbs.includes((process.env.DATABASE_TYPE as DBType) || 'sqljs')
    ? it
    : it.skip;
};

describe('Transaction Infrastructure (Resolver)', () => {
  const moduleRef: any = {
    imports: [
      ConfigModule,
      TransactionModule.forRoot(),
      configureGraphQLModule(configService => ({
        apiType: 'admin',
        apiPath: configService.apiConfig.adminApiPath,
        playground: configService.apiConfig.adminApiPlayground,
        debug: configService.apiConfig.adminApiDebug,
        typePaths: [
          'integration/graphql-schema-first/src/graphql/**/*.graphql',
          'integration/graphql-schema-first/test/testadmin.api.graphql',
        ],
        resolverModule: [TestAdminModule],
      })),
      RequestContextModule,
      TestAdminModule,
    ],
    providers: [
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
      },
    ],
  };

  const testEnvConfig = testConfig();

  const { server, adminClient } = createTestEnvironment(
    testEnvConfig,
    moduleRef,
    coreEntitiesMap as unknown as Array<Type<any>>,
  );

  beforeAll(async () => {
    await server.init();
  });

  afterAll(async () => {
    await server.destroy();
  });

  it('should succeed mutation', async () => {
    const { createTestAdministrator } = await adminClient.query(CREATE_ADMIN, {
      emailAddress: 'test1',
      fail: false,
    });

    expect(createTestAdministrator.emailAddress).toBe('test1');
    expect(createTestAdministrator.user.identifier).toBe('test1');

    const { verify } = await adminClient.query(VERIFY_TEST);

    expect(verify.administrators.length).toBe(1);
    expect(verify.users.length).toBe(1);
    expect(
      !!verify.administrators.find((a: any) => a.emailAddress === 'test1'),
    ).toBe(true);
    expect(!!verify.users.find((u: any) => u.identifier === 'test1')).toBe(
      true,
    );
  });

  it('should fail mutation', async () => {
    await adminClient.query(CREATE_ADMIN, {
      emailAddress: 'test2',
      fail: true,
    });

    const { verify } = await adminClient.query(VERIFY_TEST);

    expect(verify.administrators.length).toBe(1);
    expect(verify.users.length).toBe(1);
    expect(
      !!verify.administrators.find((a: any) => a.emailAddress === 'test2'),
    ).toBe(false);
    expect(!!verify.users.find((u: any) => u.identifier === 'test2')).toBe(
      false,
    );
  });

  it('should fail mutation with promise concurrent', async () => {
    await adminClient.query(CREATE_N_ADMINS, {
      emailAddress: 'testN-',
      failFactor: 0.4,
      n: 10,
    });

    const { verify } = await adminClient.query(VERIFY_TEST);

    expect(verify.administrators.length).toBe(1);
    expect(verify.users.length).toBe(1);
    expect(
      !!verify.administrators.find((a: any) =>
        a.emailAddress.includes('testN'),
      ),
    ).toBe(false);
    expect(
      !!verify.users.find((u: any) => u.identifier.includes('testN')),
    ).toBe(false);
  });

  it('should fail manual mutation', async () => {
    await adminClient.query(CREATE_ADMIN2, {
      emailAddress: 'test3',
      fail: true,
    });

    const { verify } = await adminClient.query(VERIFY_TEST);

    expect(verify.administrators.length).toBe(1);
    expect(verify.users.length).toBe(1);
    expect(
      !!verify.administrators.find((a: any) => a.emailAddress === 'test3'),
    ).toBe(false);
    expect(!!verify.users.find((u: any) => u.identifier === 'test3')).toBe(
      false,
    );
  });

  it('should fail manual mutation without transaction', async () => {
    await adminClient.query(CREATE_ADMIN3, {
      emailAddress: 'test4',
      fail: true,
    });

    const { verify } = await adminClient.query(VERIFY_TEST);

    expect(verify.administrators.length).toBe(1);
    expect(verify.users.length).toBe(2);
    expect(
      !!verify.administrators.find((a: any) => a.emailAddress === 'test4'),
    ).toBe(false);
    expect(!!verify.users.find((u: any) => u.identifier === 'test4')).toBe(
      true,
    );
  });

  it('should fail mutation without connection.withTransaction() wrapper with request context', async () => {
    await adminClient.query(CREATE_ADMIN5, {
      emailAddress: 'test5',
      fail: true,
      noContext: false,
    });

    const { verify } = await adminClient.query(VERIFY_TEST);

    expect(verify.administrators.length).toBe(1);
    expect(verify.users.length).toBe(2);
    expect(
      !!verify.administrators.find((a: any) => a.emailAddress === 'test5'),
    ).toBe(false);
    expect(!!verify.users.find((u: any) => u.identifier === 'test5')).toBe(
      false,
    );
  });

  it('should fail mutation inside connection.withTransaction() without request context', async () => {
    await adminClient.query(CREATE_ADMIN5, {
      emailAddress: 'test6',
      fail: true,
      noContext: true,
    });

    const { verify } = await adminClient.query(VERIFY_TEST);

    expect(verify.administrators.length).toBe(1);
    expect(verify.users.length).toBe(2);
    expect(
      !!verify.administrators.find((a: any) => a.emailAddress === 'test6'),
    ).toBe(false);
    expect(!!verify.users.find((u: any) => u.identifier === 'test6')).toBe(
      false,
    );
  });

  // @Todo - didn't rollback after concurrent transaction
  itIfDB(['postgres', 'mysql'])(
    'should fail mutation inside connection.withTransaction() wrapper with context and promise concurrent',
  );
});

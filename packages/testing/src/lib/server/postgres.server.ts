import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { Type } from '@cometx-server/common';
import { CometXConfig, preBootstrapConfig } from '@cometx-server/config';

import { Client } from 'pg';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { TestDBServer, TestServerOptions } from './server.interface';

export class PostgresServer implements TestDBServer<PostgresConnectionOptions> {
  private app: INestApplication;
  private client: Client;
  coreEntitiesMap: Array<Type<any>>;

  async init(
    testModule: TestingModule,
    testConfig: Partial<CometXConfig>,
    connectionOptions: PostgresConnectionOptions,
    coreEntitiesMap: Array<Type<any>>,
  ) {
    this.coreEntitiesMap = coreEntitiesMap;
    const dbName = 'testcommerce';
    (connectionOptions as any).database = dbName;
    (connectionOptions as any).synchronize = true;

    this.client = await this.initConnection(connectionOptions);

    await this.renewDatabase(dbName);

    this.app = await this.bootstrapForTesting(testConfig, testModule);
  }

  async destroy() {
    await new Promise(resolve => global.setTimeout(resolve, 500));
    await this.app.close();
  }

  populate(options: TestServerOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async initConnection(connectionOptions: PostgresConnectionOptions) {
    const client = new Client({
      host: connectionOptions.host,
      port: connectionOptions.port,
      user: connectionOptions.username,
      password: connectionOptions.password,
      database: 'postgres',
    });
    await client.connect();

    return client;
  }

  private async renewDatabase(dbName: string) {
    await this.client.query(
      `REVOKE CONNECT ON DATABASE ${dbName} FROM public;`,
    );
    await this.client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${dbName}';`);
    await this.client.query(`DROP DATABASE IF EXISTS ${dbName};`);
    await this.client.query(`CREATE DATABASE ${dbName};`);
  }

  private async bootstrapForTesting(
    testConfig: Partial<CometXConfig>,
    testModule: TestingModule,
  ) {
    const config = await preBootstrapConfig(testConfig, this.coreEntitiesMap);

    const app = testModule.createNestApplication();

    await app.init();

    return app;
  }
}

import * as path from 'path';
import { Client } from 'pg';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import {
  TestPopulateOptions,
  TestDBInitializer,
} from './initializer.interface';

export class PostgresInitializer
  implements TestDBInitializer<PostgresConnectionOptions>
{
  private client: Client;

  async init(databaseConfig: PostgresConnectionOptions) {
    const { database } = databaseConfig;

    this.client = await this.initConnection(databaseConfig);

    await this.renewDatabase(database as string);
  }

  async destroy() {
    return this.client.end();
  }

  populate(options: TestPopulateOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async initConnection(connectionOptions: PostgresConnectionOptions) {
    const client = new Client({
      host: connectionOptions.host,
      port: connectionOptions.port,
      user: connectionOptions.username,
      password: connectionOptions.password,
      database: connectionOptions.database,
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
}

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
    if (!process.env['CI']) {
      await this.renewDatabase(database as string);
    }
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
      database: 'postgres',
    });
    await client.connect();

    return client;
  }

  private async renewDatabase(dbName: string) {
    await this.client.query(`DROP DATABASE IF EXISTS ${dbName};`);
    await this.client.query(`CREATE DATABASE ${dbName};`);
  }
}

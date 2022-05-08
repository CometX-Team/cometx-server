import {
  TestDBInitializer,
  TestPopulateOptions,
} from './initializer.interface';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { promisify } from 'util';

export class MysqlInitializer
  implements TestDBInitializer<MysqlConnectionOptions>
{
  private client: import('mysql2').Connection;

  async init(databaseConfig: MysqlConnectionOptions) {
    const { database } = databaseConfig;
    this.client = await this.initConnection(databaseConfig);
    const query = promisify(this.client.query).bind(this.client);

    if (!process.env['CI']) {
      await query(`DROP DATABASE IF EXISTS ${database}`);
      await query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    }
  }
  populate(options: TestPopulateOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async destroy() {
    await promisify(this.client.end).bind(this.client);
  }

  private async initConnection(connectionOptions: MysqlConnectionOptions) {
    const { createConnection } = await import('mysql2');
    const conn = createConnection({
      host: connectionOptions.host,
      port: connectionOptions.port,
      user: connectionOptions.username,
      password: connectionOptions.password,
    });

    const connect = promisify(conn.connect).bind(conn);
    await connect();

    return conn;
  }
}

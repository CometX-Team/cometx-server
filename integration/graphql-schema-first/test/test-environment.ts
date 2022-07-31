import { mergeConfig } from '@cometx-server/config';
import {
  MysqlInitializer,
  PostgresInitializer,
  registerInitializer,
  testConfig as defaultTestConfig,
} from '@cometx-server/testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConnectionOptions } from 'typeorm';

dotenv.config({ path: `.env.test}` });

registerInitializer('postgres', new PostgresInitializer());
registerInitializer('mysql', new MysqlInitializer());

export const testConfig = () => {
  return mergeConfig(defaultTestConfig, {
    databaseConfig: getDbConfig(),
  });
};

const getDbConfig = (): ConnectionOptions => {
  const dbType = process.env['DATABASE_TYPE'] || 'postgres';
  switch (dbType) {
    case 'postgres':
      console.log('Using postgres conection');
      return {
        type: 'postgres',
        synchronize: true,
        database: process.env['POSTGRES_NAME'],
        host: '127.0.0.1',
        port: process.env['CI']
          ? +(process.env['CI_POSTGRES_PORT'] || 5432)
          : 5432,
        username: process.env['POSTGRES_USER'],
        password: process.env['POSTGRES_PASSWORD'],
      };
    case 'mysql':
      console.log('Using mysql connection');
      return {
        type: 'mysql',
        synchronize: true,
        database: process.env['MYSQL_NAME'],
        host: '127.0.0.1',
        port: process.env['CI']
          ? +(process.env['CI_MYSQL_PORT'] || 3306)
          : 3306,
        username: process.env['MYSQL_USER'],
        password: process.env['MYSQL_PASSWORD'],
      };
    case 'sqljs':
      console.log('Using sqljs connection');
      return {
        type: 'sqljs',
        autoSave: true,
        database: new Uint8Array([]),
        location: path.join(__dirname, 'cometx.db'),
      };
    default:
      return defaultTestConfig.databaseConfig;
  }
};

import * as path from 'path';
import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import {
  PostgresInitializer,
  registerInitializer,
  SqlInitializer,
  testConfig as defaultTestConfig,
} from '@cometx-server/testing';
import { mergeConfig } from '@cometx-server/config';

dotenv.config({ path: `.env.test}` });

registerInitializer('postgres', new PostgresInitializer());
registerInitializer('sqljs', new SqlInitializer());

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
        host: process.env['POSTGRES_HOST'],
        port: process.env['CI']
          ? +(process.env['CI_POSTGRES_PORT'] || 5432)
          : 5432,
        username: process.env['POSTGRES_USER'],
        password: process.env['POSTGRES_PASSWORD'],
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

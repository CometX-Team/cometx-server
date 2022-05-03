import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import {
  PostgresInitializer,
  registerInitializer,
  testConfig as defaultTestConfig,
} from '@cometx-server/testing';
import { mergeConfig } from '@cometx-server/config';

dotenv.config({ path: __dirname + `./.env.test}` });

registerInitializer('postgres', new PostgresInitializer());

export const testConfig = () => {
  return mergeConfig(defaultTestConfig, {
    databaseConfig: getDbConfig(),
  });
};

const getDbConfig = (): ConnectionOptions => {
  const dbType = process.env['DATABASE_TYPE'] || 'postgres';
  switch (dbType) {
    case 'postgres':
      return {
        type: 'postgres',
        synchronize: true,
        database: process.env['DATABASE_NAME'],
        host: process.env['DATABASE_HOST'],
        port: process.env['CI']
          ? +(process.env['CI_POSTGRES_PORT'] || 5432)
          : 5432,
        username: process.env['DATABASE_USER'],
        password: process.env['DATABASE_PASSWORD'],
      };

    default:
      return defaultTestConfig.databaseConfig;
  }
};

import * as dotenv from 'dotenv';
import { ConfigModuleOptions } from '@cometx-server/config';
import path = require('path');
import { ConnectionOptions } from 'typeorm';
import { ApiOptions, AuthOptions, CometXConfig } from './environment.interface';

dotenv.config({
  path: `integration/database/.env.${
    process.env['NODE_ENV'] === 'development'
      ? 'dev'
      : process.env['NODE_ENV'] === 'production'
      ? 'prod'
      : 'test'
  }`,
});

const appConfig: ConfigModuleOptions = {
  isGlobal: true,
};

const apiConfig: ApiOptions = {
  hostname: '',
  port: 3000,

  adminApiPath: 'admin-api',
  adminApiPlayground: false,
  adminApiDebug: false,
  adminListQueryLimit: 1000,
  adminApiValidationRules: [],

  shopApiPath: 'shop-api',
  shopApiPlayground: false,
  shopApiDebug: false,
  shopListQueryLimit: 100,
  shopApiValidationRules: [],

  channelTokenKey: 'cometx-token',

  cors: {
    credentials: true,
    origin: ['http://localhost:4200', 'https://studio.apollographql.com'],
  },
};

const authConfig: AuthOptions = {
  adminAuthenticationStrategy: [],
  shopAuthenticationStrategy: [],
};

const databaseConfig: ConnectionOptions = {
  type: 'postgres',
  synchronize: true, // turn off for production
  logging: false,
  database: process.env['DATABASE_NAME'],
  host: process.env['DATABASE_HOST'],
  port: 5432,
  username: process.env['DATABASE_USER'],
  password: process.env['DATABASE_PASSWORD'],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
};

export const environment: CometXConfig = {
  appConfig,
  apiConfig,
  authConfig,
  databaseConfig,
};

import {
  RuntimeCometXConfig,
  ApiOptions,
  AuthOptions,
} from '@cometx-server/config';
import * as dotenv from 'dotenv';
import path = require('path');
import { ConnectionOptions } from 'typeorm';

dotenv.config({
  path: `.env.${
    process.env['NODE_ENV'] === 'development'
      ? 'dev'
      : process.env['NODE_ENV'] === 'production'
      ? 'prod'
      : 'test'
  }`,
});

const apiConfig: Required<ApiOptions> = {
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
  introspection: false,
};

const authConfig: Required<AuthOptions> = {
  adminAuthenticationStrategy: [],
  shopAuthenticationStrategy: [],
  disableAuth: false,
  tokenMethod: 'cookie',
  requireVerification: false,
  verificationTokenDuration: '',
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

export const config: RuntimeCometXConfig = {
  apiConfig,
  authConfig,
  databaseConfig,
};

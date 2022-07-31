import { BcryptPasswordHashingStrategy } from '@cometx-server/authentication';
import {
  ApiOptions,
  AuthOptions,
  EntityOptions,
  RuntimeCometXConfig,
} from '@cometx-server/config';
import { AutoIncrementIdStrategy } from '@cometx-server/entity';
import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import path = require('path');

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
  port: 3200,

  adminApiPath: 'admin-api',
  adminApiPlayground: true,
  adminApiDebug: true,
  adminListQueryLimit: 1000,
  adminApiValidationRules: [],

  shopApiPath: 'shop-api',
  shopApiPlayground: true,
  shopApiDebug: true,
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
  passwordHashingStrategy: new BcryptPasswordHashingStrategy(),
};

const databaseConfig: ConnectionOptions = {
  type: 'postgres',
  synchronize: true, // turn off for production
  logging: false,
  database: process.env['DATABASE_NAME'],
  host: process.env['DATABASE_HOST'],
  port: process.env['DATABASE_PORT'] as unknown as number,
  username: process.env['DATABASE_USER'],
  password: process.env['DATABASE_PASSWORD'],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
};

const entityConfig: Required<EntityOptions> = {
  entityIdStrategy: new AutoIncrementIdStrategy(),
};

export const config: RuntimeCometXConfig = {
  apiConfig,
  authConfig,
  databaseConfig,
  entityConfig,
};

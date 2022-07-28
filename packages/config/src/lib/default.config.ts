import { BcryptPasswordHashingStrategy } from '@cometx-server/authentication';
import { AutoIncrementIdStrategy } from '@cometx-server/entity';
import { ConnectionOptions } from 'typeorm';
import {
  ApiOptions,
  AuthOptions,
  EntityOptions,
  RuntimeCometXConfig,
} from './config.interface';

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
  passwordHashingStrategy: new BcryptPasswordHashingStrategy(),
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
};

const entityConfig: Required<EntityOptions> = {
  entityIdStrategy: new AutoIncrementIdStrategy(),
};

export const defaultConfig: RuntimeCometXConfig = {
  apiConfig,
  authConfig,
  databaseConfig,
  entityConfig,
};

import { ADMIN_API_PATH, SHOP_API_PATH } from '@cometx-server/common';
import {
  CometXConfig,
  defaultConfig,
  mergeConfig,
} from '@cometx-server/config';

export const testConfig: Required<CometXConfig> = mergeConfig(defaultConfig, {
  apiConfig: {
    port: 3050,
    adminApiPath: ADMIN_API_PATH,
    shopApiPath: SHOP_API_PATH,
    cors: true,
  },
  authConfig: {
    tokenMethod: 'bearer',
    requireVerification: false,
  },
  databaseConfig: {
    type: 'sqljs',
    database: new Uint8Array([]),
    location: '',
    autoSave: false,
    logging: false,
  },
});

import { Injectable } from '@nestjs/common';
import { ConnectionOptions } from 'typeorm';
import { getConfig } from './config.helpers';
import {
  ApiOptions,
  AuthOptions,
  CometXConfig,
  RuntimeCometXConfig,
} from './config.interface';

@Injectable()
export class ConfigService implements CometXConfig {
  private activeConfig: RuntimeCometXConfig;

  constructor() {
    this.activeConfig = getConfig();
  }

  get apiConfig(): Required<ApiOptions> {
    return this.activeConfig.apiConfig;
  }

  get authConfig(): Required<AuthOptions> {
    return this.activeConfig.authConfig;
  }

  get databaseConfig(): ConnectionOptions {
    return this.activeConfig.databaseConfig;
  }
}

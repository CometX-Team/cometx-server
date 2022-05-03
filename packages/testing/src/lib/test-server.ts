import { Test, TestingModule } from '@nestjs/testing';
import { Type } from '@cometx-server/common';
import { CometXConfig, preBootstrapConfig } from '@cometx-server/config';
import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';

import { getAllEntities } from '@cometx-server/transaction';
import { INestApplication } from '@nestjs/common';
import {
  getInitializer,
  TestDBInitializer,
  TestPopulateOptions,
} from './initializer';

/**
 * @description
 * CometX Test server for testing
 *
 */
export class TestServer {
  private app: INestApplication;
  public testModule: TestingModule;
  public initializer: TestDBInitializer<BaseConnectionOptions>;

  constructor(
    private testConfig: Required<CometXConfig>,
    private testModuleRef: any,
    private coreEntitiesMap: Array<Type<any>>,
  ) {}

  async init(options?: TestPopulateOptions) {
    const { type } = this.testConfig.databaseConfig;
    const { databaseConfig } = this.testConfig;

    this.initializer = getInitializer(type);

    try {
      await this.initializer.init(databaseConfig);
      await this.initializer.destroy();
    } catch (e) {
      console.log(e);
      throw e;
    }

    await this.bootstrap();
  }

  async bootstrap() {
    this.app = await this.bootstrapForTesting();
  }

  async destroy() {
    await new Promise(resolve => global.setTimeout(resolve, 500));
    await this.app.close();
  }

  private async bootstrapForTesting() {
    const entities = getAllEntities(this.coreEntitiesMap);

    const config = preBootstrapConfig(this.testConfig, entities);

    this.testModule = await Test.createTestingModule(
      this.testModuleRef,
    ).compile();

    const app = this.testModule.createNestApplication();

    return app;
  }
}

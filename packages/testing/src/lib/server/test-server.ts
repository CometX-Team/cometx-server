import { Type } from '@cometx-server/common';
import { CometXConfig } from '@cometx-server/config';
import { TestingModule } from '@nestjs/testing';
import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';
import { getServer } from './server.utils';
import { TestDBServer, TestServerOptions } from './server.interface';

/**
 * @description
 * MyanCommerce Test server for e2e testing
 *
 * @docsCategory testing
 */
export class TestServer {
  public server: TestDBServer<BaseConnectionOptions>;

  constructor(
    private cometXConfig: Required<CometXConfig>,
    private testModule: TestingModule,
    private coreEntitiesMap: Array<Type<any>>,
  ) {}

  async init(options?: TestServerOptions) {
    const { type } = this.cometXConfig.databaseConfig;
    const { databaseConfig } = this.cometXConfig;

    this.server = getServer(type);

    try {
      await this.server.init(
        this.testModule,
        this.cometXConfig,
        databaseConfig,
        this.coreEntitiesMap,
      );
      //   await this.server.populate(options);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async destroy() {
    await this.server.destroy();
  }
}

import { TestingModule } from '@nestjs/testing';
import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';
import { CometXConfig } from '@cometx-server/config';
import { Type } from '@cometx-server/common';

export interface TestDBServer<T extends BaseConnectionOptions> {
  init(
    testModule: TestingModule,
    testConfig: Partial<CometXConfig>,
    ConnectionOptions: T,
    coreEntitiesMap: Array<Type<any>>,
  ): void;

  populate(options: TestServerOptions): Promise<void>;

  destroy(): void | Promise<void>;
}

export interface TestServerOptions {
  customerCount?: number;
  adminCount?: number;
}

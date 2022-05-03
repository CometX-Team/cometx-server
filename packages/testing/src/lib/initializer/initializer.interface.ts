import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';

export interface TestDBInitializer<T extends BaseConnectionOptions> {
  init(databaseConfig: T): void;

  populate(options: TestPopulateOptions): Promise<void>;

  destroy(): void | Promise<void>;
}

export interface TestPopulateOptions {
  customerCount?: number;
  adminCount?: number;
}

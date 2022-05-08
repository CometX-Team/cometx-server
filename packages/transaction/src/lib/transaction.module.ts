import { ConfigModule, ConfigService } from '@cometx-server/config';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionWrapper } from './transaction.wrapper';
import { TransactionalConnection } from './transactional-connection';

let defaultTypeOrmModule: DynamicModule;

@Module({
  imports: [ConfigModule],
  providers: [TransactionalConnection, TransactionWrapper],
  exports: [TransactionalConnection, TransactionWrapper],
})
export class TransactionModule {
  static forRoot(): DynamicModule {
    if (!defaultTypeOrmModule) {
      defaultTypeOrmModule = TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          ...configService.databaseConfig,
        }),
        inject: [ConfigService],
      });
    }

    return {
      module: TransactionModule,
      imports: [defaultTypeOrmModule],
    };
  }
}

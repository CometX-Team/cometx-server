import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { TransactionalConnection } from './transactional-connection';

let defaultTypeOrmModule: DynamicModule;

@Module({
  controllers: [],
  providers: [TransactionalConnection],
  exports: [TransactionalConnection],
})
export class TransactionModule {
  static forRoot(dbConnectionOptions: ConnectionOptions): DynamicModule {
    if (!defaultTypeOrmModule){
      defaultTypeOrmModule = TypeOrmModule.forRootAsync({useFactory: () => {
        return {
          ...dbConnectionOptions
        }
      }})
    }

    return {
      module: TransactionModule,
      imports: [defaultTypeOrmModule]
    }
  }
}

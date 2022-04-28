import { Module } from '@nestjs/common';
import { TransactionalConnection } from './transactional-connection';

@Module({
  controllers: [],
  providers: [TransactionalConnection],
  exports: [TransactionalConnection],
})
export class TransactionModule {}

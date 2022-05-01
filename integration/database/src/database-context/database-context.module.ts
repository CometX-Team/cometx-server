import { Module } from '@nestjs/common';
import { DatabaseContextService } from './database-context.service';

@Module({
  providers: [DatabaseContextService],
  exports: [DatabaseContextService],
})
export class DatabaseContextModule {}

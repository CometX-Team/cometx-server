import { ConfigModule } from '@cometx-server/config';
import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

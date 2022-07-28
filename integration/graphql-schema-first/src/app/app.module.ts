import { ConfigModule } from '@cometx-server/config';
import { RequestContextModule } from '@cometx-server/request-context';
import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { AdminModule } from '../administrator/administrator.module';
import { UserModule } from '../user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    TransactionModule.forRoot(),
    RequestContextModule,
    UserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

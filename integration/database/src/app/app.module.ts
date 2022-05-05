import { ConfigModule } from '@cometx-server/config';
import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from '../administrator/administrator.module';
import { DatabaseContextModule } from '../database-context/database-context.module';
import { DatabaseAuthGuard } from '../guard/database.auth.guard';
import { UserModule } from '../user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    TransactionModule.forRoot(),
    DatabaseContextModule,
    UserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: DatabaseAuthGuard,
    },
  ],
})
export class AppModule {}

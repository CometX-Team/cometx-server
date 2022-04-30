import { ConfigModule } from '@cometx-server/config';
import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { appConfiguration } from './app.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...environment.appConfig,
      load: [appConfiguration],
    }),
    TransactionModule.forRoot(environment.databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

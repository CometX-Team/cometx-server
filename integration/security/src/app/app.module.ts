import { AuthGuard } from '@cometx-server/authentication';
import { ConfigModule } from '@cometx-server/config';
import { RequestContextModule } from '@cometx-server/request-context';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ApiModule } from './api.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, ApiModule, RequestContextModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

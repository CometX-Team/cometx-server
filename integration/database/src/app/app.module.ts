import { ConfigModule } from '@cometx-server/config';
import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

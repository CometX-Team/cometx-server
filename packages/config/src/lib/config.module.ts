import {
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    private configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {}

  async onApplicationBootstrap() {
    await this.initInjectableStrategies();
  }

  async onApplicationShutdown() {
    await this.destroyInjectableStrategies();
  }

  private async initInjectableStrategies() {
    for (const strategy of this.getInjectableStrategies()) {
      if (typeof strategy.init === 'function') {
        await strategy.init(this.moduleRef);
      }
    }
  }

  private async destroyInjectableStrategies() {
    for (const strategy of this.getInjectableStrategies()) {
      if (typeof strategy.destroy === 'function') {
        await strategy.destroy();
      }
    }
  }

  private getInjectableStrategies() {
    const { adminAuthenticationStrategy, shopAuthenticationStrategy } =
      this.configService.authConfig;

    return [...adminAuthenticationStrategy, ...shopAuthenticationStrategy];
  }
}

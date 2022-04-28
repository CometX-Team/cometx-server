import {
    DynamicModule,
    Module,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { ModuleRef } from '@nestjs/core';

import { ConfigHostModule } from './config-host.module';
import {
    CONFIGURATION_LOADER,
    CONFIGURATION_SERVICE_TOKEN,
    CONFIGURATION_TOKEN,
} from './config.constants';
import { ConfigService } from './config.service';
import { ConfigFactory, ConfigModuleOptions } from './interfaces';
import { ConfigFactoryKeyHost } from './util';

import { createConfigProvider } from './util/create-config-factory.util';
import { getRegistrationToken } from './util/get-registration-token.util';
import { mergeConfigObject } from './util/merge-configs.util';

@Module({
    imports: [ConfigHostModule],
    providers: [
        {
            provide: ConfigService,
            useExisting: CONFIGURATION_SERVICE_TOKEN,
        },
    ],
    exports: [ConfigHostModule, ConfigService],
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
        const shopAuthenticationStrategy = this.configService.get(
            'authConfig.shopAuthenticationStrategy',
        );

        return [...shopAuthenticationStrategy];
    }

    static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
        const isConfigToLoad = options.load && options.load.length;
        const providers = (options.load || [])
            .map(factory =>
                createConfigProvider(
                    factory as ConfigFactory & ConfigFactoryKeyHost,
                ),
            )
            .filter(item => item) as FactoryProvider[];

        const configProviderTokens = providers.map(item => item.provide);
        const configServiceProvider = {
            provide: ConfigService,
            useFactory: (configService: ConfigService) => {
                return configService;
            },
            inject: [CONFIGURATION_SERVICE_TOKEN, ...configProviderTokens],
        };
        providers.push(configServiceProvider);

        return {
            module: ConfigModule,
            global: options.isGlobal,
            providers: isConfigToLoad
                ? [
                      ...providers,
                      {
                          provide: CONFIGURATION_LOADER,
                          useFactory: (
                              host: Record<string, any>,
                              ...configurations: Record<string, any>[]
                          ) => {
                              configurations.forEach((item, index) =>
                                  this.mergePartial(
                                      host,
                                      item,
                                      providers[index],
                                  ),
                              );
                          },
                          inject: [
                              CONFIGURATION_TOKEN,
                              ...configProviderTokens,
                          ],
                      },
                  ]
                : providers,
            exports: [ConfigService, ...configProviderTokens],
        };
    }

    static forFeature(config: ConfigFactory): DynamicModule {
        const configProvider = createConfigProvider(
            config as ConfigFactory & ConfigFactoryKeyHost,
        );
        const serviceProvider = {
            provide: ConfigService,
            useFactory: (configService: ConfigService) => configService,
            inject: [CONFIGURATION_SERVICE_TOKEN, configProvider.provide],
        };

        return {
            module: ConfigModule,
            providers: [
                configProvider,
                serviceProvider,
                {
                    provide: CONFIGURATION_LOADER,
                    useFactory: (
                        host: Record<string, any>,
                        partialConfig: Record<string, any>,
                    ) => {
                        this.mergePartial(host, partialConfig, configProvider);
                    },
                    inject: [CONFIGURATION_TOKEN, configProvider.provide],
                },
            ],
            exports: [ConfigService, configProvider.provide],
        };
    }

    private static mergePartial(
        host: Record<string, any>,
        item: Record<string, any>,
        provider: FactoryProvider,
    ) {
        const factoryRef = provider.useFactory;
        const token = getRegistrationToken(factoryRef);
        mergeConfigObject(host, item, token);
    }
}

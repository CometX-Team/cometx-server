import { AuthGuard } from '@cometx-server/authentication';
import { ConfigModule } from '@cometx-server/config';
import { RequestContextModule } from '@cometx-server/request-context';
import { TransactionModule } from '@cometx-server/transaction';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AdminModule } from '../administrator/administrator.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configureGraphQLModule } from './module.config';

@Module({
  imports: [
    ConfigModule,
    TransactionModule.forRoot(),
    configureGraphQLModule(configService => ({
      apiType: 'admin',
      apiPath: configService.apiConfig.adminApiPath,
      playground: configService.apiConfig.adminApiPlayground,
      debug: configService.apiConfig.adminApiDebug,
      typePaths: ['integration/graphql-schema-first/src/graphql/**/*.graphql'],
      resolverModule: [AdminModule, UserModule, RoleModule],
    })),
    RequestContextModule,
    UserModule,
    AdminModule,
    RoleModule,
  ],
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

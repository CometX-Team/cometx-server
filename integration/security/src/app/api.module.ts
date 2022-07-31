import { TransactionModule } from '@cometx-server/transaction';

import { Module } from '@nestjs/common';

import { readdirSync } from 'fs';
import { join } from 'path';

import { AdminAPIModule } from './api-internal.module';
import { configureGraphQLModule } from './module.config';
import { ServiceModule } from './service.module';

/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
@Module({
  imports: [
    ServiceModule,
    TransactionModule.forRoot(),
    AdminAPIModule,
    configureGraphQLModule(configService => {
      return {
        apiType: 'admin',
        apiPath: configService.apiConfig.adminApiPath,
        playground: configService.apiConfig.adminApiPlayground,
        debug: configService.apiConfig.adminApiDebug,
        typePaths: readdirSync('integration/security/src/graphql')
          .filter(file => file !== 'shop')
          .map(p => join('integration/security/src/graphql', p, '*.graphql')),
        resolverModule: [AdminAPIModule],
      };
    }),
  ],
})
export class ApiModule {}

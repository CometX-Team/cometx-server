import { AuthGuard } from '@cometx-server/authentication';
import { RequestContextModule } from '@cometx-server/request-context';
import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from '../user/user.module';

/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
@Module({
  imports: [TransactionModule.forRoot(), RequestContextModule, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ApiModule {
  constructor() {}
}

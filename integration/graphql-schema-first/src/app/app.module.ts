import { ConfigModule } from '@cometx-server/config';
import { RequestContextModule } from '@cometx-server/request-context';
import { TransactionModule } from '@cometx-server/transaction';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AdminModule } from '../administrator/administrator.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    TransactionModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['integration/graphql-schema-first/src/graphql/**/*.graphql'],
      playground: true,
      debug: true,
    }),
    RequestContextModule,
    UserModule,
    AdminModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

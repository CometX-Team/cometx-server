import { ConfigModule } from '@cometx-server/config';
import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { AdministratorResolver } from '../administrator/administrator.resolver';
import { CustomerResolver } from '../customer/customer.resolver';
import { RoleResolver } from '../role/role.resolver';
import { ServiceModule } from './service.module';

const adminResolvers = [AdministratorResolver, CustomerResolver, RoleResolver];

/**
 * The internal module containing some shared providers used by more than
 * one API module.
 */
@Module({
  imports: [ConfigModule, ServiceModule, TransactionModule.forRoot()],
  exports: [ConfigModule, ServiceModule, TransactionModule.forRoot()],
})
export class APISharedModule {}

/**
 * The internal module containing the Admin GraphQL API resolvers
 */
@Module({
  imports: [APISharedModule],
  providers: [...adminResolvers],
  exports: [...adminResolvers],
})
export class AdminAPIModule {}

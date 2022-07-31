import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { AdministratorService } from '../administrator/administrator.service';
import { CustomerService } from '../customer/customer.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';

const services = [
  AdministratorService,
  CustomerService,
  UserService,
  RoleService,
];

/**
 * The ServiceCoreModule is imported internally by the ServiceModule. It is arranged in this way so that
 * there is only a single instance of this module being instantiated, and thus the lifecycle hooks will
 * only run a single time.
 */
@Module({
  imports: [TransactionModule],
  providers: [...services],
  exports: [...services],
})
export class ServiceCoreModule {}

/**
 * The ServiceModule is responsible for the service layer, i.e. accessing the database
 * and implementing the main business logic of the application.
 *
 * The exported providers are used in the ApiModule, which is responsible for parsing requests
 * into a format suitable for the service layer logic.
 */
@Module({
  imports: [ServiceCoreModule],
  exports: [ServiceCoreModule],
})
export class ServiceModule {}

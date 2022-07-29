import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';

import { UserService } from './user.service';

@Module({
  imports: [TransactionModule, RoleModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

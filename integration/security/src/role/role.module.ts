import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';

@Module({
  imports: [TransactionModule],
  providers: [RoleService, RoleResolver],
  exports: [RoleService],
})
export class RoleModule {}

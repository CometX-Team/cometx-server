import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdministratorResolver } from './administrator.resolver';
import { AdministratorService } from './administrator.service';

@Module({
  imports: [TransactionModule, UserModule],
  providers: [AdministratorResolver, AdministratorService],
  exports: [AdministratorService],
})
export class AdminModule {}

import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdminController } from './administrator.controller';
import { AdministratorService } from './administrator.service';

@Module({
  imports: [TransactionModule, UserModule],
  controllers: [AdminController],
  providers: [AdministratorService],
  exports: [AdministratorService],
})
export class AdminModule {}

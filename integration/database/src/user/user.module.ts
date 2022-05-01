import { TransactionModule } from '@cometx-server/transaction';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

import { UserService } from './user.service';

@Module({
  imports: [TransactionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Ctx } from '@cometx-server/request-context';
import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { Transaction } from '@cometx-server/transaction';
import { DatabaseContext } from '../database-context/database-context';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Transaction()
  @Post()
  async createCustomer(
    @Ctx() ctx: DatabaseContext,
    @Body() input: any,
  ): Promise<any> {
    const user = await this.userService.createCustomerUser(
      ctx,
      input.identifier,
    );

    return this.userService.getUserById(ctx, user.id);
  }

  @Transaction()
  @Post()
  async createAdministrator(@Ctx() ctx: DatabaseContext, @Body() input: any) {
    const user = await this.userService.createAdminUser(ctx, input.identifier);

    return this.userService.getUserById(ctx, user.id);
  }
}

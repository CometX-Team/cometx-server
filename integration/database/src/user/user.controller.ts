import { Ctx, RequestContext } from '@cometx-server/request-context';
import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { Transaction } from '@cometx-server/transaction';
import { InternalServerError } from '@cometx-server/error';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Transaction()
  @Post()
  async createCustomer(
    @Ctx() ctx: RequestContext,
    @Body() input: any,
  ): Promise<any> {
    const user = await this.userService.createCustomerUser(
      ctx,
      input.identifier,
    );

    // throw new InternalServerError({
    //   message: 'Just throw an error for no reason',
    // });

    return this.userService.getUserById(ctx, user.id);
  }
}

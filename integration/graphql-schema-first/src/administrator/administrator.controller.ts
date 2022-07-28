import { Ctx, RequestContext } from '@cometx-server/request-context';

import { Transaction } from '@cometx-server/transaction';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdministratorService } from './administrator.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdministratorService) {}

  @Transaction()
  @Post()
  async createAdmin(
    @Ctx() ctx: RequestContext,
    @Body() input: any,
  ): Promise<any> {
    return this.adminService.createAdmin(ctx, input);
  }

  @Get()
  async getAdmin() {
    return 'This is admin route';
  }
}

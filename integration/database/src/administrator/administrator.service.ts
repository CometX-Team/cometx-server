import { Injectable } from '@nestjs/common';

import { RequestContext } from '@cometx-server/request-context';
import { TransactionalConnection } from '@cometx-server/transaction';
import { Administrator } from './administrator.entity';
import { UserService } from '../user/user.service';
import { InternalServerError } from '@cometx-server/error';

/**
 * @description
 * Contains methods relating to {@link Admin} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class AdministratorService {
  constructor(
    private connection: TransactionalConnection,
    private userService: UserService,
  ) {}

  async createAdmin(
    ctx: RequestContext,
    identifier: string,
  ): Promise<Administrator> {
    const user = await this.userService.createAdminUser(ctx, identifier);

    const admin = this.connection.getRepository(ctx, Administrator).save(
      new Administrator({
        user,
        emailAddress: identifier,
        firstName: 'john',
        lastName: 'doe',
      }),
    );

    return admin;
  }
}

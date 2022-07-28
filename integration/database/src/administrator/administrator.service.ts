import { Injectable } from '@nestjs/common';

import { TransactionalConnection } from '@cometx-server/transaction';
import { DatabaseContext } from '../database-context/database-context';
import { UserService } from '../user/user.service';
import { Administrator } from './administrator.entity';

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
    ctx: DatabaseContext,
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

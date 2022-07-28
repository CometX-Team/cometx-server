import { Injectable } from '@nestjs/common';

import { ID } from '@cometx-server/common';
import { RequestContext } from '@cometx-server/request-context';
import { TransactionalConnection } from '@cometx-server/transaction';
import { User } from './user.entity';

/**
 * @description
 * Contains methods relating to {@link User} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class UserService {
  constructor(private connection: TransactionalConnection) {}

  async getUserById(
    ctx: RequestContext,
    userId: ID,
  ): Promise<User | undefined> {
    return this.connection.getRepository(ctx, User).findOne(userId);
  }

  async getUserByEmailAddress(
    ctx: RequestContext,
    emailAddress: string,
  ): Promise<User | undefined> {
    return this.connection.getRepository(ctx, User).findOne({
      where: {
        identifier: emailAddress,
        deletedAt: null,
      },
    });
  }

  /**
   * @description
   * Create a new User with the special code `customer` Role
   */
  async createCustomerUser(
    ctx: RequestContext,
    identifier: string,
  ): Promise<User> {
    const user = new User();
    user.identifier = identifier;
    return this.connection.getRepository(ctx, User).save(user);
  }

  /**
   * @description
   * Create a new User with the special code `admmin` Role
   */
  async createAdminUser(
    ctx: RequestContext,
    identifier: string,
  ): Promise<User> {
    const user = new User({ identifier, verified: true });
    return this.connection.getRepository(ctx, User).save(user);
  }
}

import { Injectable, Module } from '@nestjs/common';
import {
  TransactionalConnection,
  TransactionModule,
} from '@cometx-server/transaction';
import { DatabaseContext } from '../src/database-context/database-context';
import { User } from '../src/user/user.entity';
import { InternalServerError } from '@cometx-server/error';
import { Administrator } from '../src/administrator/administrator.entity';

export const allSettled = promises => {
  return Promise.all(
    promises.map((promise, i) =>
      promise
        .then(value => ({ statue: 'fullfiled' as const, value }))
        .catch(reason => ({ status: 'rejected' as const, reason })),
    ),
  );
};

@Injectable()
export class TestUserService {
  constructor(private connection: TransactionalConnection) {}

  async createUser(ctx: DatabaseContext, identifier: string) {
    await this.connection.getRepository(ctx, User).insert(
      new User({
        identifier,
        verified: true,
      }),
    );

    return this.connection
      .getRepository(ctx, User)
      .findOne({ where: { identifier } });
  }
}

@Injectable()
export class TestAdminService {
  constructor(
    private connection: TransactionalConnection,
    private userService: TestUserService,
  ) {}

  async createAdministrator(
    emailAddress: string,
    fail: boolean,
    ctx?: DatabaseContext,
  ) {
    if (!ctx) {
      return this.connection.withTransaction(async _ctx => {
        const user = await this.userService.createUser(_ctx, emailAddress);

        if (fail) {
          throw new InternalServerError({ message: 'Failed' });
        }

        const admin = this.connection.getRepository(_ctx, Administrator).save(
          new Administrator({
            user,
            emailAddress,
            firstName: 'john',
            lastName: 'doe',
          }),
        );

        return admin;
      });
    } else {
      return this.connection.withTransaction(ctx, async _ctx => {
        const user = await this.userService.createUser(_ctx, emailAddress);

        if (fail) {
          throw new InternalServerError({ message: 'Failed' });
        }

        const admin = this.connection.getRepository(_ctx, Administrator).save(
          new Administrator({
            user,
            emailAddress,
            firstName: 'john',
            lastName: 'doe',
          }),
        );

        return admin;
      });
    }
  }

  async verify() {
    const admins = await this.connection.getRepository(Administrator).find();
    const users = await this.connection.getRepository(User).find();

    return { admins, users };
  }
}

@Module({
  imports: [TransactionModule],
  providers: [TestAdminService, TestUserService],
  exports: [TestAdminService, TestUserService],
})
export class TestAdminModule {}

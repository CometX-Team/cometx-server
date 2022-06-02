import { Body, Injectable, Module, Post } from '@nestjs/common';
import {
  TransactionalConnection,
  TransactionModule,
} from '@cometx-server/transaction';
import { DatabaseContext } from '../src/database-context/database-context';
import { User } from '../src/user/user.entity';
import { InternalServerError } from '@cometx-server/error';
import { Administrator } from '../src/administrator/administrator.entity';
import { Transaction } from 'typeorm';
import { Ctx } from '@cometx-server/request-context';

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

@Injectable()
export class TestAdminServiceMock {
  constructor(
    private connection: TransactionalConnection,
    private userService: TestUserService,
  ) {}

  async createAdministrator(ctx: DatabaseContext, emailAddress: string) {
    const user = await this.userService.createUser(ctx, emailAddress);

    const admin = this.connection.getRepository(ctx, Administrator).save(
      new Administrator({
        user,
        emailAddress,
        firstName: 'john',
        lastName: 'doe',
      }),
    );

    return admin;
  }
}

@Injectable()
export class TestAdminController {
  constructor(private adminService: TestAdminServiceMock) {}

  @Transaction()
  @Post()
  async createAdmin(@Ctx() ctx: DatabaseContext, @Body() input: any) {
    return this.adminService.createAdministrator(ctx, input.emailAddress);
  }
}

@Module({
  imports: [TransactionModule],
  controllers: [TestAdminController],
  providers: [TestAdminService, TestAdminServiceMock, TestUserService],
  exports: [TestAdminService, TestAdminServiceMock, TestUserService],
})
export class TestAdminModule {}

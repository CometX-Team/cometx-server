import { InternalServerError } from '@cometx-server/error';
import { Ctx, RequestContext } from '@cometx-server/request-context';
import {
  Transaction,
  TransactionalConnection,
  TransactionModule,
} from '@cometx-server/transaction';

import { Injectable, Module } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Administrator } from '../src/administrator/administrator.entity';
import { User } from '../src/user/user.entity';

@Injectable()
export class TestUserService {
  constructor(private connection: TransactionalConnection) {}

  async createUser(ctx: RequestContext, identifier: string) {
    await this.connection.getRepository(ctx, User).insert(
      new User({
        identifier,
        roles: [],
        verified: true,
      }),
    );

    return this.connection.getRepository(ctx, User).findOne({
      where: { identifier },
    });
  }
}

@Injectable()
export class TestAdminService {
  constructor(
    private connection: TransactionalConnection,
    private userService: TestUserService,
  ) {}

  async createAdministrator(
    ctx: RequestContext,
    emailAddress: string,
    fail: boolean,
  ) {
    const user = await this.userService.createUser(ctx, emailAddress);

    if (fail) {
      throw new InternalServerError({ message: 'Failed!' });
    }

    const admin = await this.connection.getRepository(ctx, Administrator).save(
      new Administrator({
        emailAddress,
        user,
        firstName: 'john',
        lastName: 'doe',
      }),
    );

    return admin;
  }
}

@Resolver('administrator')
export class TestAdminResolver {
  constructor(
    private testAdminService: TestAdminService,
    private connection: TransactionalConnection,
  ) {}

  @Mutation()
  @Transaction()
  async createTestAdministrator(@Ctx() ctx: RequestContext, @Args() args: any) {
    return await this.testAdminService.createAdministrator(
      ctx,
      args.emailAddress,
      args.fail,
    );
  }

  @Mutation()
  @Transaction('manual')
  async createTestAdministrator2(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    await this.connection.startTransaction(ctx);
    return this.testAdminService.createAdministrator(
      ctx,
      args.emailAddress,
      args.fail,
    );
  }

  @Mutation()
  @Transaction('manual')
  async createTestAdministrator3(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    // no transaction started
    return this.testAdminService.createAdministrator(
      ctx,
      args.emailAddress,
      args.fail,
    );
  }

  @Mutation()
  @Transaction()
  async createTestAdministrator4(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    const admin = await this.testAdminService.createAdministrator(
      ctx,
      args.emailAddress,
      args.fail,
    );
    await new Promise(resolve => setTimeout(resolve, 50));
    return admin;
  }

  @Mutation()
  async createTestAdministrator5(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    if (args.noContext === true) {
      return this.connection.withTransaction(async _ctx => {
        const admin = await this.testAdminService.createAdministrator(
          _ctx,
          args.emailAddress,
          args.fail,
        );
        return admin;
      });
    } else {
      return this.connection.withTransaction(ctx, async _ctx => {
        const admin = await this.testAdminService.createAdministrator(
          _ctx,
          args.emailAddress,
          args.fail,
        );
        return admin;
      });
    }
  }

  @Mutation()
  @Transaction()
  async createNTestAdministrators(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    let error: any;

    const promises: Promise<any>[] = [];
    for (let i = 0; i < args.n; i++) {
      promises.push(
        new Promise(resolve => setTimeout(resolve, i * 10)).then(() =>
          this.testAdminService.createAdministrator(
            ctx,
            `${args.emailAddress}${i}`,
            i < args.n * args.failFactor,
          ),
        ),
      );
    }

    const result = await Promise.all(promises).catch((e: any) => {
      error = e;
    });

    await this.allSettled(promises);

    if (error) {
      throw error;
    }

    return result;
  }

  @Mutation()
  async createNTestAdministrators2(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    let error: any;

    const promises: Promise<any>[] = [];
    const result = await this.connection
      .withTransaction(ctx, _ctx => {
        for (let i = 0; i < args.n; i++) {
          promises.push(
            new Promise(resolve => setTimeout(resolve, i * 10)).then(() =>
              this.testAdminService.createAdministrator(
                _ctx,
                `${args.emailAddress}${i}`,
                i < args.n * args.failFactor,
              ),
            ),
          );
        }

        return Promise.all(promises);
      })
      .catch((e: any) => {
        error = e;
      });

    await this.allSettled(promises);

    if (error) {
      throw error;
    }

    return result;
  }

  @Query()
  async verify() {
    const administrators = await this.connection
      .getRepository(Administrator)
      .find();
    const users = await this.connection.getRepository(User).find();

    return {
      administrators,
      users,
    };
  }

  // Promise.allSettled polyfill
  // Same as Promise.all but waits until all promises will be fulfilled or rejected.
  private allSettled<T>(
    promises: Promise<T>[],
  ): Promise<
    ({ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: any })[]
  > {
    return Promise.all(
      promises.map((promise, i) =>
        promise
          .then(value => ({
            status: 'fulfilled' as const,
            value,
          }))
          .catch(reason => ({
            status: 'rejected' as const,
            reason,
          })),
      ),
    );
  }
}

@Module({
  imports: [TransactionModule],
  providers: [TestAdminResolver, TestAdminService, TestUserService],
  exports: [TestAdminResolver, TestAdminService, TestUserService],
})
export class TestAdminModule {}

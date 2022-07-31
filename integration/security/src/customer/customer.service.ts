import { ErrorResultUnion, ID } from '@cometx-server/common';
import { RequestContext } from '@cometx-server/request-context';
import { TransactionalConnection } from '@cometx-server/transaction';
import { Injectable } from '@nestjs/common';
import { CreateCustomerResult } from '../generated-typings';
import { UserService } from '../user/user.service';
import { Customer } from './customer.entity';

/**
 * @description
 * Contains methods relating to {@link Customer} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class CustomerService {
  constructor(
    private connection: TransactionalConnection,
    private userService: UserService,
  ) {}

  /**
   * @description
   * Find all Customers
   */
  findAll(ctx: RequestContext, options: any): Promise<Customer[]> {
    return this.connection.getRepository(ctx, Customer).find({
      select: [...options],
    });
  }

  /**
   * @description
   * Find a customer
   */
  findOne(ctx: RequestContext, id: ID): Promise<Customer | undefined> {
    return this.connection.getRepository(ctx, Customer).findOne(id);
  }

  /**
   * @description
   * Return the {@link Customer} entity associated with userId, If one exists
   */
  findOneByUserId(
    ctx: RequestContext,
    userId: ID,
  ): Promise<Customer | undefined> {
    const query = this.connection
      .getRepository(ctx, Customer)
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('customer.deletedAt is null');

    return query.getOne();
  }

  /**
   * @description
   * Return the Customer entity associated with userId, If one exists
   */

  /**
   * @description
   * Creates a new Customer
   */
  async create(
    ctx: RequestContext,
    input: any,
  ): Promise<ErrorResultUnion<CreateCustomerResult, Customer>> {
    const customer = new Customer(input);

    customer.user = await this.userService.createCustomerUser(
      ctx,
      input.emailAddress,
    );

    const createdCustomer = await this.connection
      .getRepository(ctx, Customer)
      .save(customer);

    return createdCustomer;
  }
}

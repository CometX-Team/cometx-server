import { Ctx, RequestContext } from '@cometx-server/request-context';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { readdirSync } from 'fs';
import { Transaction } from 'typeorm';
import { CreateCustomerInput } from '../generated-typings';
import { CustomerService } from './customer.service';
import path = require('path');

@Resolver()
export class CustomerResolver {
  constructor(private customerService: CustomerService) {}

  @Mutation()
  @Transaction()
  async createCustomer(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateCustomerInput,
  ): Promise<any> {
    return this.customerService.create(ctx, input);
  }

  @Mutation()
  demo() {
    const files = readdirSync('integration/security/src/graphql')
      .filter(file => file !== 'shop')
      .map(p => path.join(__dirname, 'src/graphql', p, '*.graphql'));

    // (err, files) => {
    //   return files.filter((file: string) => file !== 'shop');
    // },

    console.log(files);

    return 'Hello';
  }
}

import { ID, PaginatedList } from '@cometx-server/common';
import { Ctx, RequestContext } from '@cometx-server/request-context';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAdministratorInput,
  DeletionResponse,
  UpdateAdministratorInput,
} from '../generated-graphql';
import { Administrator } from './administrator.entity';
import { AdministratorService } from './administrator.service';

@Resolver('Administrators')
export class AdministratorResolver {
  constructor(private administratorService: AdministratorService) {}

  @Query()
  administrators(
    @Ctx() ctx: RequestContext,
  ): Promise<PaginatedList<Administrator>> {
    return this.administratorService.findAll(ctx);
  }

  @Query()
  administrator(
    @Ctx() ctx: RequestContext,
    @Args('id') id: ID,
  ): Promise<Administrator | undefined> {
    return this.administratorService.findOne(ctx, id);
  }

  @Mutation()
  createAdministrator(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateAdministratorInput,
  ): Promise<Administrator> {
    return this.administratorService.create(ctx, input);
  }

  @Mutation()
  updateAdministrator(
    @Ctx() ctx: RequestContext,
    @Args('input') input: UpdateAdministratorInput,
  ): Promise<Administrator> {
    return this.administratorService.update(ctx, input);
  }

  @Mutation()
  deleteAdministrator(
    @Ctx() ctx: RequestContext,
    @Args('id') id: ID,
  ): Promise<DeletionResponse> {
    return this.administratorService.delete(ctx, id);
  }
}

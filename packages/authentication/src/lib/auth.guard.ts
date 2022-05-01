import { GraphQLResolveInfo } from 'graphql';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import {
  parseContext,
  RequestContextService,
  REQUEST_CONTEXT_KEY,
} from '@cometx-server/request-context';

@Injectable()
export class AuthGuard implements CanActivate {
  strategy: any;

  constructor(private requestContextService: RequestContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = parseContext(context);

    const requestContext = ((req as any)[REQUEST_CONTEXT_KEY] =
      await this.requestContextService.fromRequest(req));

    (req as any)[REQUEST_CONTEXT_KEY] = requestContext;

    return true;
  }

  // Return true if the guard is being called by @ResolveField, i.e, not a top level Query or Mutation.s
  private isFieldResolver(info?: GraphQLResolveInfo): boolean {
    if (!info) return false;

    const parentType = info?.parentType?.name;

    return parentType !== 'Query' && parentType !== 'Mutation';
  }
}

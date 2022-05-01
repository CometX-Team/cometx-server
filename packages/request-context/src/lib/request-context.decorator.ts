import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import {
  REQUEST_CONTEXT_KEY,
  REQUEST_CONTEXT_MAP_KEY,
} from './request-context.constant';

/**
 * @description
 * Resolver param decorator which extracts the {@link RequestContext} from the incoming
 * request object.
 *
 * @example
 * ```TypeScript
 *  \@Query()
 *  getAdministrators(\@Ctx() ctx: RequestContext) {
 *      // ...
 *  }
 * ```
 *
 */
export const Ctx = createParamDecorator((data, ctx: ExecutionContext) => {
  const getContext = (req: any) => {
    const map: Map<Function, any> | undefined = req[REQUEST_CONTEXT_MAP_KEY];

    // A map contains associated transactional context with its handler
    // meaning the handler is wrapped with @Transaction decorator
    // then we have to use it, otherwise use default context.
    return map?.get(ctx.getHandler()) || req[REQUEST_CONTEXT_KEY];
  };

  if (ctx.getType<ContextType | 'graphql'>() === 'graphql') {
    // GraphQL request
    return getContext(ctx.getArgByIndex(2).req);
  } else {
    // REST request
    return getContext(ctx.switchToHttp().getRequest());
  }
});

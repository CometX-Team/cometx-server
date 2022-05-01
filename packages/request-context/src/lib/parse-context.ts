import { Request as HttpRequest, Response as HttpResponse } from 'express';

import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

import { GraphQLResolveInfo } from 'graphql';
import { InternalServerError } from '@cometx-server/error';

export type RestContext = {
  req: HttpRequest;
  res: HttpResponse;
  isGraphQL: false;
  info: undefined;
};

export type GraphQLContext = {
  req: HttpRequest;
  res: HttpResponse;
  isGraphQL: true;
  info: GraphQLResolveInfo;
};

export function parseContext(
  context: ExecutionContext | ArgumentsHost,
): RestContext | GraphQLContext {
  if (context.getType() === 'http') {
    const httpContext = context.switchToHttp();

    return {
      req: httpContext.getRequest(),
      res: httpContext.getResponse(),
      isGraphQL: false,
      info: undefined,
    };
  } else if (context.getType<GqlContextType>() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context as ExecutionContext);

    return {
      req: gqlContext.getContext().req,
      res: gqlContext.getContext().res,
      isGraphQL: true,
      info: gqlContext.getInfo(),
    };
  } else {
    throw new InternalServerError({
      message: `Context "${context.getType()}" is not supported`,
    });
  }
}

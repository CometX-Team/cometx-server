import { GraphQLResolveInfo } from 'graphql';

import { ExecutionContext, Injectable } from '@nestjs/common';
import { DatabaseContextService } from '../database-context/database-context.service';
import {
  parseContext,
  REQUEST_CONTEXT_KEY,
} from '@cometx-server/request-context';
import { AuthGuard } from '@cometx-server/authentication';

@Injectable()
export class DatabaseAuthGuard extends AuthGuard {
  strategy: any;

  constructor(private databaseContextService: DatabaseContextService) {
    super(databaseContextService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = parseContext(context);

    const requestContext = ((req as any)[REQUEST_CONTEXT_KEY] =
      await this.databaseContextService.fromRequest(req));

    (req as any)[REQUEST_CONTEXT_KEY] = requestContext;

    return true;
  }
}

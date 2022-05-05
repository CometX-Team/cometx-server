import { Observable, of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  parseContext,
  RequestContext,
  REQUEST_CONTEXT_KEY,
  REQUEST_CONTEXT_MAP_KEY,
} from '@cometx-server/request-context';
import {
  TransactionMode,
  TRANSACTION_MODE_METADATA_KEY,
} from './transaction.decorator';
import { TransactionWrapper } from './transaction.wrapper';
import { TransactionalConnection } from './transactional-connection';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private connection: TransactionalConnection,
    private reflector: Reflector,
    private transactionWrapper: TransactionWrapper,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { req } = parseContext(context);

    const ctx: RequestContext | undefined = (req as any)[REQUEST_CONTEXT_KEY];

    if (ctx) {
      const transactionMode = this.reflector.get<TransactionMode>(
        TRANSACTION_MODE_METADATA_KEY,
        context.getHandler(),
      );

      return of(
        this.transactionWrapper.executeInTransaction(
          ctx,
          ctx => {
            this.registerTransactionalContext(ctx, context.getHandler(), req);

            return next.handle();
          },
          transactionMode,
          this.connection.rawConnection,
        ),
      );
    } else {
      return next.handle();
    }
  }

  /**
   * Registers transactional request context with its associated execution handler function
   *
   * @param ctx
   * @param handler
   * @param req
   */
  registerTransactionalContext(
    ctx: RequestContext,
    handler: Function,
    req: any,
  ) {
    const map: Map<Function, RequestContext> =
      req[REQUEST_CONTEXT_MAP_KEY] || new Map();

    map.set(handler, ctx);

    req[REQUEST_CONTEXT_MAP_KEY] = map;
  }
}

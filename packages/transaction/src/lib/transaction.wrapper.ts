import { TRANSACTION_MANAGER_KEY } from '@cometx-server/common';
import { RequestContext } from '@cometx-server/request-context';
import { first, from, Observable, retry, retryWhen, take, tap } from 'rxjs';
import {
  Connection,
  QueryRunner,
  TransactionAlreadyStartedError,
} from 'typeorm';
import { TransactionMode } from './transaction.decorator';

export class TransactionWrapper {
  async executeInTransaction<T>(
    originalCtx: RequestContext,
    work: (ctx: RequestContext) => Observable<T> | Promise<T>,
    mode: TransactionMode,
    connection: Connection,
  ) {
    const ctx = originalCtx.copy();

    const queryRunnerExist = !!(ctx as any)[TRANSACTION_MANAGER_KEY];
    if (queryRunnerExist) {
      return new Promise((resolve, reject) => {
        from(work(ctx))
          .pipe(first())
          .subscribe(result => resolve(result));
      });
    }
    const queryRunner = connection.createQueryRunner();

    if (mode === 'auto') {
      await this.startTransaction(queryRunner);
    }
    (ctx as any)[TRANSACTION_MANAGER_KEY] = queryRunner.manager;

    try {
      const maxRetries = 5;

      const result = await new Promise((resolve, reject) => {
        from(work(ctx))
          .pipe(retry(maxRetries))
          .subscribe({
            next: result => resolve(result),
            error: error =>
              error.pipe(
                tap(err => {
                  if (!this.isRetriableError(err)) {
                    reject(err);
                  }
                }),
                take(maxRetries),
              ),
          });
      });

      if (queryRunner.isTransactionActive) {
        await queryRunner.commitTransaction();
      }

      return result;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
    } finally {
      if (queryRunner?.isReleased === false) {
        await queryRunner.release();
      }
    }
  }

  /**
   * In case a transaction already started for the conection,
   * attempt to start a db connection with retry logic
   * (which is mainly a problem with SQLite/Sql.js)
   *
   * @param queryRunner
   * @returns void
   */
  private async startTransaction(queryRunner: QueryRunner) {
    const maxRetries = 25;
    let attempts = 0;
    let lastError: any;

    // Return false if transaction is in already progress
    async function attemptStartTransaction(): Promise<boolean> {
      try {
        await queryRunner.startTransaction();

        return true;
      } catch (error) {
        lastError = error;
        if (error instanceof TransactionAlreadyStartedError) {
          return false;
        }
        throw error;
      }
    }

    while (attempts < maxRetries) {
      const result = await attemptStartTransaction();

      if (result) {
        return;
      }

      attempts++;

      // the more attempts, the more increase the relay
      await new Promise(resolve => setTimeout(resolve, attempts * 20));
    }

    throw lastError;
  }

  /**
   * If the resolver function throws an error, there are certain cases in which
   * we want to retry the whole thing again - notably in the case of a deadlock
   * situation, which can usually be retried with success.
   */
  private isRetriableError(err: any): boolean {
    const mysqlDeadlock = err.code === 'ER_LOCK_DEADLOCK';
    const postgresDeadlock = err.code === 'deadlock_detected';
    return mysqlDeadlock || postgresDeadlock;
  }
}

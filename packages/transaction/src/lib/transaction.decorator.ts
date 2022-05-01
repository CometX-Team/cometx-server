import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from './transaction.interceptor';

export const TRANSACTION_MODE_METADATA_KEY = '__transaction_mode__';

export type TransactionMode = 'auto' | 'manual';

export const Transaction = (transactionMode: TransactionMode = 'auto') => {
  return applyDecorators(
    SetMetadata(TRANSACTION_MODE_METADATA_KEY, transactionMode),
    UseInterceptors(TransactionInterceptor),
  );
};

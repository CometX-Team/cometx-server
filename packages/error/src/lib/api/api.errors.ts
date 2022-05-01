import { ID } from '@cometx-server/common';
import ApiError from './base.api.error';
import {
  ENTITY_NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from './api.errors.constant';

export class EntityNotFoundError extends ApiError {
  constructor(entityName: string, id: ID) {
    super(
      `Entity '${entityName}' with ID '${id}' not found.`,
      { entityName, id },
      id ? `error.${id}-not-found` : ENTITY_NOT_FOUND_ERROR_CODE,
    );
  }
}

export class InternalServerError extends ApiError {
  constructor(options: {
    message?: string;
    variables?: { [key: string]: string | number };
    errorCode?: string;
  }) {
    super(
      options?.message || INTERNAL_SERVER_ERROR_MESSAGE,
      options?.variables || {},
      options?.errorCode || INTERNAL_SERVER_ERROR_CODE,
    );
  }
}

import { RequestContextService } from '@cometx-server/request-context';
import { Injectable } from '@nestjs/common';
import { Request as HttpRequest } from 'express';

import { DatabaseContext } from './database-context';

@Injectable()
export class DatabaseContextService extends RequestContextService {
  constructor() {
    super();
  }

  override async create(config: { req?: HttpRequest }) {
    const { req } = config;

    return new DatabaseContext({
      req,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
    });
  }

  override async fromRequest(req: HttpRequest) {
    return new DatabaseContext({
      req,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
    });
  }
}

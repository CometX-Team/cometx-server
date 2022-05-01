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

  //   /**
  //    * Returns true if any element of arr1 appears in arr2.
  //    */
  //   private arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
  //     return arr1.reduce((intersects, role) => {
  //       return intersects || arr2.includes(role);
  //     }, false as boolean);
  //   }
}

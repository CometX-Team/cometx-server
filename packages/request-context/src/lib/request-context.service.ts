import { Injectable } from '@nestjs/common';
import { Request as HttpRequest } from 'express';

import { RequestContext } from './request-context';

@Injectable()
export class RequestContextService {
  constructor() {}

  async create(config: { req?: HttpRequest }) {
    const { req } = config;

    return new RequestContext({
      req,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
    });
  }

  async fromRequest(req: HttpRequest) {
    return new RequestContext({
      req,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
    });
  }

  /**
   * Returns true if any element of arr1 appears in arr2.
   */
  private arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
    return arr1.reduce((intersects, role) => {
      return intersects || arr2.includes(role);
    }, false as boolean);
  }
}

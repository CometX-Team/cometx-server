import { RequestContext } from '@cometx-server/request-context';
import { Request } from 'express';

export class DatabaseContext extends RequestContext {
  constructor(options: {
    req?: Request;
    isAuthorized: boolean;
    authorizedAsOwnerOnly: boolean;
    sampleTest?: boolean;
  }) {
    super(options);
  }
}

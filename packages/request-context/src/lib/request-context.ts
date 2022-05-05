import { InternalServerErrorException } from '@nestjs/common';
import { isObject } from '@cometx-server/common';
import { Request } from 'express';

/**
 * @description
 * The RequestContext holds information relevant to the current request, which may be
 * required at various points of the stack.
 *
 * It is a good practice to inject the RequestContext (using the {@link Ctx} decorator) into
 * _all_ resolvers & REST handlers, and then pass it through to the service layer.
 */
export class RequestContext {
  private readonly _isAuthorized: boolean;
  private readonly _authorizedAsOwnerOnly: boolean;
  private readonly _req?: Request;

  /**
   * @internal
   */
  constructor(options: {
    req?: Request;
    isAuthorized: boolean;
    authorizedAsOwnerOnly: boolean;
  }) {
    const { req } = options;
    this._req = req;
    this._isAuthorized = options.isAuthorized;
    this._authorizedAsOwnerOnly = options.authorizedAsOwnerOnly;
  }

  /**
   * @description
   * Creates an "empty" RequestContext object. This is only intended to be used
   * when a service method must be called outside the normal request-response
   * cycle, e.g. when programmatically populating data. Usually a better alternative
   * is to use the {@link RequestContextService} `create()` method, which allows more control
   * over the resulting RequestContext object.
   */
  static empty(): RequestContext {
    return new RequestContext({
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
    });
  }

  /**
   * @description
   * Creates a new RequestContext object from a serialized object created by the
   * `serialize()` method.
   */
  static deserialize(ctxObject: Object) {
    throw new InternalServerErrorException('No Implementation');
  }

  /**
   * @description
   * Serializes the RequestContext object into a JSON-compatible simple object.
   * This is useful when you need to send a RequestContext object to another
   * process, e.g. to pass it to the Job Queue via the {@link JobQueueService}.
   */
  serialize() {
    throw new InternalServerErrorException('No Implementation');
  }

  /**
   * @description
   * Creates a shallow copy of the RequestContext instance. This means that
   * mutations to the copy itself will not affect the original, but deep mutations
   * (e.g. copy.channel.code = 'new') *will* also affect the original.
   */
  copy(): RequestContext {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  /**
   * @description
   * The raw Express request object.
   */
  get req(): Request | undefined {
    return this._req;
  }

  /**
   * @description
   * True if the current session is authorized to access the current resolver method.
   *
   */
  get isAuthorized(): boolean {
    return this._isAuthorized;
  }

  /**
   * @description
   * True if the current anonymous session is only authorized to operate on entities that
   * are owned by the current session.
   */
  get authorizedAsOwnerOnly(): boolean {
    return this._authorizedAsOwnerOnly;
  }

  /**
   * Returns true if any element of arr1 appears in arr2.
   */
  private arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
    return arr1.reduce((intersects, role) => {
      return intersects || arr2.includes(role);
    }, false as boolean);
  }

  /**
   * The Express "Request" object is huge and contains many circular
   * references. We will preserve just a subset of the whole, by preserving
   * only the serializable properties up to 2 levels deep.
   * @private
   */
  private shallowCloneRequestObject(req: Request) {
    function copySimpleFieldsToDepth(
      target: any,
      maxDepth: number,
      depth: number = 0,
    ) {
      const result: any = {};
      for (const key in target) {
        if (key === 'host' && depth === 0) {
          // avoid Express "deprecated: req.host" warning
          continue;
        }
        let val: any;
        try {
          val = (target as any)[key];
        } catch (e) {
          val = String(e);
        }

        if (Array.isArray(val)) {
          depth++;
          result[key] = val.map(v => {
            if (!isObject(v) && typeof val !== 'function') {
              return v;
            } else {
              return copySimpleFieldsToDepth(v, maxDepth, depth);
            }
          });
          depth--;
        } else if (!isObject(val) && typeof val !== 'function') {
          result[key] = val;
        } else if (depth < maxDepth) {
          depth++;
          result[key] = copySimpleFieldsToDepth(val, maxDepth, depth);
          depth--;
        }
      }
      return result;
    }
    return copySimpleFieldsToDepth(req, 1);
  }
}

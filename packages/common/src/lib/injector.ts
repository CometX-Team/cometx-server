import { Type } from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';

/**
 * @description
 * The injector is wrapped around the underlying Nestjs `ModuleRef`, which allow injection of
 * known to the application's dependency injection container. This is intended to enable the injection
 * of services into objects which exist outside of the Nestjs module system
 */

/**
 * -- resolve() - share same identiifier generated from same DI container sub tree
 *
 * As the resolve function return a unique instance of the provider from its own DI container sub-tree.
 * and each sub-tree has a unqiue context identifier. Thus, if you call this method more than once
 * and compare instance references, they will not be equal
 *
 * Use the ContextIdFactory class to generate a context identifier
 * We can passing the resolve function the context identiifer from generated class or function
 *
 * @example
 * ```TypeScript
 *
 * export class CatsService implements OnModuleInit {
 *  constructor(private moduleRef: ModuleRef) {}
 *
 *  async onModuleInit() {
 *   const contextId = ContextIdFactory.create();
 *   const transientServices = await Promise.all([
 *     this.moduleRef.resolve(TransientService, contextId),
 *     this.moduleRef.resolve(TransientService, contextId),
 *   ]);
 *   console.log(transientServices[0] === transientServices[1]); // true
 *  }
 *  }
 * ```
 */
export class Injector {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * @description
   * Retrieve an instance of the given type from the app's dependency injection container.
   * Wraps the Nestjs `ModuleRef.get()` method.
   */
  get<T, R = T>(typeOrToken: Type<T> | string | symbol): R {
    // To retrieve a provider from the global context, pass { strict: false }
    return this.moduleRef.get(typeOrToken, { strict: false });
  }

  /**
   * @description
   * Retrieve an instance of the given scoped provider (transient or request-scoped) from the
   * app's dependency injection container.
   * Wraps the Nestjs `ModuleRef.resolve()` method.
   */
  resolve<T, R = T>(
    typeOrToken: Type<T> | string | symbol,
    contextId?: ContextId,
  ): Promise<R> {
    return this.moduleRef.resolve(typeOrToken, contextId, { strict: false });
  }
}

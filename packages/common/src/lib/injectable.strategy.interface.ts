import { Injector } from './injector';

/**
 * @description
 * This interface defines the setup and teardown hooks available to the
 * various strategies used to configure Vendure.
 */
export interface InjectableStrategy {
  init?: (injector: Injector) => void | Promise<void>;
  destroy?: () => void | Promise<void>;
}

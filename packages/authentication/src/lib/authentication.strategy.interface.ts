import { InjectableStrategy } from '@cometx-server/common';

export interface AuthenticationStrategy<Data = unknown>
  extends InjectableStrategy {
  readonly name: string;
  authenticate(data: Data): Promise<any | false | string>;
}

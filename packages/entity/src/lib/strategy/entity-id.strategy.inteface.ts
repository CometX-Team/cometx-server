import { InjectableStrategy } from '@cometx-server/common';

export type PrimaryKey<T> = T extends 'uuid'
  ? string
  : T extends 'increment'
  ? number
  : any;

export interface EntityIdStrategy<T extends 'increment' | 'uuid'>
  extends InjectableStrategy {
  readonly primaryKeyType: T;
}

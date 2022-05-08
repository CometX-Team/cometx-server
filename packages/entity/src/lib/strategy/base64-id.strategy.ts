import { EntityIdStrategy } from './entity-id.strategy.inteface';

export class Base64IdStrategy implements EntityIdStrategy<'increment'> {
  readonly primaryKeyType = 'increment';
}

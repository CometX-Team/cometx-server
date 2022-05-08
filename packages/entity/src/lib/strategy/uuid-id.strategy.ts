import { EntityIdStrategy } from './entity-id.strategy.inteface';

export class UuidIdStrategy implements EntityIdStrategy<'uuid'> {
  readonly primaryKeyType = 'uuid';
}

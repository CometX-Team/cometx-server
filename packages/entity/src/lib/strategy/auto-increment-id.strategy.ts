import { EntityIdStrategy } from './entity-id.strategy.inteface';

export class AutoIncrementIdStrategy implements EntityIdStrategy<'increment'> {
  readonly primaryKeyType: 'increment';

  decodeId(id: string): number {
    const asNumber = +id;

    return Number.isNaN(asNumber) ? -1 : asNumber;
  }

  encodeId(primaryKey: number): string {
    console.log(primaryKey);
    return primaryKey.toString();
  }
}

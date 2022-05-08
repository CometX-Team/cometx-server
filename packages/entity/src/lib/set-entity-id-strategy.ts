import { Type } from '@cometx-server/common';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { getIdColumns, getPrimaryGeneratedColumn } from './entity-id.decorator';
import { EntityIdStrategy } from './strategy/entity-id.strategy.inteface';

export function setEntityIdStrategy(
  entityIdStrategy: EntityIdStrategy<any>,
  entities: Array<Type<any>>,
) {
  setBaseEntityType(entityIdStrategy);
  setEntityIdColumnTypes(entityIdStrategy, entities);
}

function setEntityIdColumnTypes(
  entityIdStrategy: EntityIdStrategy<any>,
  entities: Array<Type<any>>,
) {
  const columnDataType =
    entityIdStrategy.primaryKeyType === 'increment' ? 'int' : 'varchar';
  for (const entityType of entities) {
    const columnConfig = getIdColumns(entityType);

    for (const { name, entity, options } of columnConfig) {
      Column({
        type: columnDataType,
        nullable: (options && options.nullable) || false,
        primary: (options && options.primary) || false,
      })(entity, name);
    }
  }
}

function setBaseEntityType(entityIdStrategy: EntityIdStrategy<any>) {
  const { entity, name } = getPrimaryGeneratedColumn();
  PrimaryGeneratedColumn(entityIdStrategy.primaryKeyType as any)(entity, name);
}

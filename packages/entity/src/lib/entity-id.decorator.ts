import { Type } from '@cometx-server/common';
import { InternalServerError } from '@cometx-server/error';

interface IdColumnOptions {
  nullable?: boolean;
  primary?: boolean;
}

interface IdColumnConfig {
  name: string;
  entity: any;
  options?: IdColumnOptions;
}

const idColumnRegistry = new Map<any, IdColumnConfig[]>();

let primaryGeneratedColumn: { entity: any; name: string } | undefined;

export function PrimaryGeneratedId() {
  return (entity: any, propertyName: string) => {
    primaryGeneratedColumn = {
      entity,
      name: propertyName,
    };
  };
}

export function EntityId(options?: IdColumnOptions) {
  return (entity: any, propertyName: string) => {
    const idColumns = idColumnRegistry.get(entity);
    const entry = { name: propertyName, entity, options };

    if (idColumns) {
      idColumns.push(entry);
    } else {
      idColumnRegistry.set(entity, [entry]);
    }
  };
}

export function getIdColumns(entityType: Type<any>): IdColumnConfig[] {
  const match = Array.from(idColumnRegistry.entries()).find(
    ([entity, columns]) => entity.constructor === entityType,
  );
  return match ? match[1] : [];
}

export function getPrimaryGeneratedColumn() {
  if (!primaryGeneratedColumn) {
    throw new InternalServerError({
      message:
        'primaryGeneratedColumn is undefined.The base CometXEntity must have PrimaryGeneratedColumn decorator set on its id property.',
    });
  }

  return primaryGeneratedColumn;
}

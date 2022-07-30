import { assertNever } from '@cometx-server/common';
import { CustomFieldConfig } from './custom-field.types';

/**
 * Maps an array of CustomFieldConfig objects into a string of SDL fields.
 */
export function mapToFields(
  fieldDefs: CustomFieldConfig[],
  typeFn: (def: CustomFieldConfig) => string | undefined,
  nameFn?: (def: Pick<CustomFieldConfig, 'name' | 'type' | 'list'>) => string,
): string {
  const res = fieldDefs
    .map(field => {
      const type = typeFn(field);

      if (!type) {
        return;
      }

      const name = nameFn ? nameFn(field) : field.name;

      return `${name}:${type}`;
    })
    .filter(x => x != null);

  return res.join('\n');
}

export function getGraphQLTypes(config: CustomFieldConfig) {
  switch (config.type) {
    case 'string':
    case 'localeString':
    case 'text':
      return 'String';
    case 'datetime':
      return 'DateTime';
    case 'boolean':
      return 'Boolean';
    case 'int':
      return 'Int';
    case 'float':
      return 'Float';
    case 'relation':
      return config.graphQLType || config.entity.name;
    default:
      assertNever(config);
  }
}

export function wrapListType(
  getTypeFn: (def: CustomFieldConfig) => string | undefined,
): (def: CustomFieldConfig) => string | undefined {
  return (def: CustomFieldConfig) => {
    const type = getTypeFn(def);

    if (!type) {
      return;
    }

    return def.list ? `[${type}!]` : type;
  };
}

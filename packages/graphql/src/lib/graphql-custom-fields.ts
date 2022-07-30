import { buildSchema, extendSchema, GraphQLSchema, parse } from 'graphql';
import { getGraphQLTypes, mapToFields, wrapListType } from './utils';

/**
 * Given a CustomFields config object, generates an SDL string extending the built-in
 * types with a customFields property for all entities, translations and inputs for which
 * custom fields are defined.
 */
export function addGraphQLCustomField(
  typeDefsOrSchema: string | GraphQLSchema,
  customFieldConfig: any,
  publicOnly: boolean,
): GraphQLSchema {
  const schema =
    typeof typeDefsOrSchema === 'string'
      ? buildSchema(typeDefsOrSchema)
      : typeDefsOrSchema;

  let customFieldTypeDefs = '';

  if (!schema.getType('JSON')) {
    customFieldTypeDefs += `
      scalar JSON
    `;
  }

  if (!schema.getType('DateTime')) {
    customFieldTypeDefs += `
      scalar DateTime
    `;
  }

  for (const entityName of Object.keys(customFieldConfig)) {
    const customEntityFields = (customFieldConfig[entityName] || []).filter(
      config => {
        return (
          !config.internal &&
          (publicOnly === true ? config.public !== false : true)
        );
      },
    );

    if (schema.getType(entityName)) {
      if (customEntityFields.length) {
        customFieldTypeDefs += `
        type ${entityName}CustomFields {
            ${mapToFields(customEntityFields, wrapListType(getGraphQLTypes))}
        }

        extend type ${entityName} {
            customFields: ${entityName}CustomFields
        }
    `;
      } else {
        customFieldTypeDefs += `
          extend type ${entityName} {
            customFields: JSON
          }
        `;
      }
    }
  }

  return extendSchema(schema, parse(customFieldTypeDefs));
}

import { Type } from '@cometx-server/common';
/**
 * Returns an array of core entities and any additional entities defined in plugins.
 */
export function getAllEntities(
  coreEntitiesMap: Array<Type<any>>,
): Array<Type<any>> {
  const coreEntities = Object.values(coreEntitiesMap) as Array<Type<any>>;

  const allEntities: Array<Type<any>> = coreEntities;

  return allEntities;
}

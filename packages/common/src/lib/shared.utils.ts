import { ID } from './shared.types';

/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 */
export function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function isClassInstance(item: any): boolean {
  return isObject(item) && item.constructor.name !== 'Object';
}

/**
 * Compare ID values for equality, taking into account the fact that they may not be of matching types
 * (string or number).
 */
export function idsAreEqual(id1?: ID, id2?: ID): boolean {
  if (id1 === undefined || id2 === undefined) {
    return false;
  }
  return id1.toString() === id2.toString();
}

/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 */
export function isObject(item: any): item is object {
    return item && typeof item === 'object' && !Array.isArray(item);
}

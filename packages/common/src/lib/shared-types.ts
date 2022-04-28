/**
 * @description
 * An entity ID. Depending on the configured {@link EntityIdStrategy}, it will be either
 * a `string` or a `number`;
 *
 */
export type ID = string | number;

export type Json = null | boolean | number | string | Json[] | { [prop: string]: Json };

/**
 * @description
 * A type representing JSON-compatible values.
 * From https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081
 *
 * @docsCategory common
 */
export type JsonCompatible<T> = {
    [P in keyof T]: T[P] extends Json
        ? T[P]
        : Pick<T, P> extends Required<Pick<T, P>>
        ? never
        : JsonCompatible<T[P]>;
};
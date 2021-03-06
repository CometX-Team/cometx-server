/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = {
  [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>);
};
// tslint:enable:no-shadowed-variable

// tslint:disable:ban-types
/**
 * A recursive implementation of Required<T>.
 * Source: https://github.com/microsoft/TypeScript/issues/15012#issuecomment-365453623
 */
export type DeepRequired<
  T,
  U extends object | undefined = undefined,
> = T extends object
  ? {
      [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<
        U | Function | Type<any>
      >
        ? NonNullable<T[P]>
        : DeepRequired<NonNullable<T[P]>, U>;
    }
  : T;
// tslint:enable:ban-types

/**
 * A type representing the type rather than instance of a class.
 */
export interface Type<T> extends Function {
  // tslint:disable-next-line:callable-types
  new (...args: any[]): T;
}

/**
 * @description
 * An entity ID. Depending on the configured {@link EntityIdStrategy}, it will be either
 * a `string` or a `number`;
 *
 */
export type ID = string | number;

/**
 * @description
 * A type describing the shape of a paginated list response.
 *
 * @docsCategory shared
 */
export type PaginatedList<T> = {
  items: T[];
  totalItems: number;
};

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };

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

/**
 * @description
 * A data type for a custom field. The CustomFieldType determines the data types used in the generated
 * database columns and GraphQL fields as follows (key: m = MySQL, p = Postgres, s = SQLite):
 *
 * Type         | DB type                               | GraphQL type
 * -----        |---------                              |---------------
 * string       | varchar                               | String
 * localeString | varchar                               | String
 * text         | longtext(m), text(p,s)                | String
 * int          | int                                   | Int
 * float        | double precision                      | Float
 * boolean      | tinyint (m), bool (p), boolean (s)    | Boolean
 * datetime     | datetime (m,s), timestamp (p)         | DateTime
 * relation     | many-to-one / many-to-many relation   | As specified in config
 *
 * Additionally, the CustomFieldType also dictates which [configuration options](/docs/typescript-api/custom-fields/#configuration-options)
 * are available for that custom field.
 *
 */
export type CustomFieldType =
  | 'string'
  | 'localeString'
  | 'int'
  | 'float'
  | 'boolean'
  | 'datetime'
  | 'relation'
  | 'text';

import { CustomFieldType, Injector, Type } from '@cometx-server/common';
import { CometXEntity } from '@cometx-server/entity';
import {
  BooleanCustomFieldConfig as GraphQLBooleanCustomFieldConfig,
  CustomField,
  DateTimeCustomFieldConfig as GraphQLDateTimeCustomFieldConfig,
  FloatCustomFieldConfig as GraphQLFloatCustomFieldConfig,
  IntCustomFieldConfig as GraphQLIntCustomFieldConfig,
  LocaleStringCustomFieldConfig as GraphQLLocaleStringCustomFieldConfig,
  LocalizedString,
  RelationCustomFieldConfig as GraphQLRelationCustomFieldConfig,
  StringCustomFieldConfig as GraphQLStringCustomFieldConfig,
  TextCustomFieldConfig as GraphQLTextCustomFieldConfig,
} from './generated-custom-field.types';

export type DefaultValueType<T extends CustomFieldType> = T extends
  | 'string'
  | 'localeString'
  ? string
  : T extends 'int' | 'float'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'datetime'
  ? Date
  : T extends 'relation'
  ? any
  : never;

export type BaseTypedCustomFieldConfig<
  T extends CustomFieldType,
  C extends CustomField,
> = Omit<C, '__typename' | 'list'> & {
  type: T;
  /**
   * @description
   * Whether or not the custom field is available via the Shop API.
   * @default true
   */
  public?: boolean;
  nullable?: boolean;
  unique?: boolean;
};

/**
 * @description
 * Configures a custom field on an entity in the {@link CustomFields} config object.
 *
 * @docsCategory custom-fields
 */
export type TypedCustomSingleFieldConfig<
  T extends CustomFieldType,
  C extends CustomField,
> = BaseTypedCustomFieldConfig<T, C> & {
  list?: false;
  defaultValue?: DefaultValueType<T>;
  validate?: (
    value: DefaultValueType<T>,
    injector: Injector,
  ) =>
    | string
    | LocalizedString[]
    | void
    | Promise<string | LocalizedString[] | void>;
};

export type TypedCustomListFieldConfig<
  T extends CustomFieldType,
  C extends CustomField,
> = BaseTypedCustomFieldConfig<T, C> & {
  list?: true;
  defaultValue?: Array<DefaultValueType<T>>;
  validate?: (
    value: Array<DefaultValueType<T>>,
  ) => string | LocalizedString[] | void;
};

export type TypedCustomFieldConfig<
  T extends CustomFieldType,
  C extends CustomField,
> = BaseTypedCustomFieldConfig<T, C> &
  (TypedCustomSingleFieldConfig<T, C> | TypedCustomListFieldConfig<T, C>);

export type StringCustomFieldConfig = TypedCustomFieldConfig<
  'string',
  GraphQLStringCustomFieldConfig
>;
export type LocaleStringCustomFieldConfig = TypedCustomFieldConfig<
  'localeString',
  GraphQLLocaleStringCustomFieldConfig
>;
export type TextCustomFieldConfig = TypedCustomFieldConfig<
  'text',
  GraphQLTextCustomFieldConfig
>;
export type IntCustomFieldConfig = TypedCustomFieldConfig<
  'int',
  GraphQLIntCustomFieldConfig
>;
export type FloatCustomFieldConfig = TypedCustomFieldConfig<
  'float',
  GraphQLFloatCustomFieldConfig
>;
export type BooleanCustomFieldConfig = TypedCustomFieldConfig<
  'boolean',
  GraphQLBooleanCustomFieldConfig
>;
export type DateTimeCustomFieldConfig = TypedCustomFieldConfig<
  'datetime',
  GraphQLDateTimeCustomFieldConfig
>;
export type RelationCustomFieldConfig = TypedCustomFieldConfig<
  'relation',
  Omit<GraphQLRelationCustomFieldConfig, 'entity' | 'scalarFields'>
> & { entity: Type<CometXEntity>; graphQLType?: string; eager?: boolean };

/**
 * @description
 * An object used to configure a custom field.
 *
 * @docsCategory custom-fields
 */
export type CustomFieldConfig =
  | StringCustomFieldConfig
  | LocaleStringCustomFieldConfig
  | TextCustomFieldConfig
  | IntCustomFieldConfig
  | FloatCustomFieldConfig
  | BooleanCustomFieldConfig
  | DateTimeCustomFieldConfig
  | RelationCustomFieldConfig;

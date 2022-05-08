import { AuthenticationStrategy } from '@cometx-server/authentication';
import { EntityIdStrategy } from '@cometx-server/entity';
import { Type } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationContext } from 'graphql';
import { ConnectionOptions } from 'typeorm';

/**
 * @description
 * The ApiOptions define how the CometX GraphQL APIs are exposed, as well as allowing the API layer
 * to be extended with middleware.
 *
 */
export interface ApiOptions {
  /**
   * @description
   * Set the hostname of the server. If not set, the server will be available on localhost.
   *
   * @default ''
   */
  hostname: string;
  /**
   * @description
   * Which port the CometX server should listen on.
   *
   * @default 3000
   */
  port: number;
  /**
   * @description
   * The path to the admin GraphQL API.
   *
   * @default 'admin-api'
   */
  adminApiPath?: string;
  /**
   * @description
   * The path to the shop GraphQL API.
   *
   * @default 'shop-api'
   */
  shopApiPath?: string;
  /**
   * @description
   * The playground config to the admin GraphQL API
   * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
   *
   * @default false
   */
  adminApiPlayground?: boolean | any;
  /**
   * @description
   * The playground config to the shop GraphQL API
   * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
   *
   * @default false
   */
  shopApiPlayground?: boolean | any;
  /**
   * @description
   * The debug config to the admin GraphQL API
   * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
   *
   * @default false
   */
  adminApiDebug?: boolean;
  /**
   * @description
   * The debug config to the shop GraphQL API
   * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
   *
   * @default false
   */
  shopApiDebug?: boolean;
  /**
   * @description
   * The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
   * this is the upper limit of the `take` input option.
   *
   * @default 100
   */
  shopListQueryLimit?: number;
  /**
   * @description
   * The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
   * this is the upper limit of the `take` input option.
   *
   * @default 1000
   */
  adminListQueryLimit?: number;
  /**
   * @description
   * Custom functions to use as additional validation rules when validating the schema for the admin GraphQL API
   * [ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).
   *
   * @default []
   */
  adminApiValidationRules?: Array<(context: ValidationContext) => any>;
  /**
   * @description
   * Custom functions to use as additional validation rules when validating the schema for the shop GraphQL API
   * [ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).
   *
   * @default []
   */
  shopApiValidationRules?: Array<(context: ValidationContext) => any>;
  /**
   * @description
   * The name of the property which contains the token of the
   * active channel. This property can be included either in
   * the request header or as a query string.
   *
   * @default 'cometx-token'
   */
  channelTokenKey?: string;
  /**
   * @description
   * Set the CORS handling for the server. See the [express CORS docs](https://github.com/expressjs/cors#configuration-options).
   *
   * @default { origin: true, credentials: true }
   */
  cors?: boolean | CorsOptions;
  /**
   * @description
   * Controls whether introspection of the GraphQL APIs is enabled. For production, it is recommended to disable
   * introspection, since exposing your entire schema can allow an attacker to trivially learn all operations
   * and much more easily find any potentially exploitable queries.
   *
   * **Note:** when introspection is disabled, tooling which relies on it for things like autocompletion
   * will not work.
   *
   * @example
   * ```TypeScript
   * {
   *   introspection: process.env.NODE_ENV !== 'production'
   * }
   * ```
   *
   * @default true
   * @since 1.5.0
   */
  introspection?: boolean;
}

/**
 * @description
 * The AuthOptions define how authentication and authorization is managed.
 *
 * @docsCategory auth
 * */
export interface AuthOptions {
  /**
   * @description
   * Disable authentication & permissions checks.
   * NEVER set the to true in production. It exists
   * only to aid certain development tasks.
   *
   * @default false
   */
  disableAuth?: boolean;
  /**
   * @description
   * Sets the method by which the session token is delivered and read.
   *
   * * 'cookie': Upon login, a 'Set-Cookie' header will be returned to the client, setting a
   *   cookie containing the session token. A browser-based client (making requests with credentials)
   *   should automatically send the session cookie with each request.
   * * 'bearer': Upon login, the token is returned in the response and should be then stored by the
   *   client app. Each request should include the header `Authorization: Bearer <token>`.
   *
   * Note that if the bearer method is used, CometX will automatically expose the configured
   * `authTokenHeaderKey` in the server's CORS configuration (adding `Access-Control-Expose-Headers: cometx-auth-token`
   * by default).
   *
   * @default 'cookie'
   */
  tokenMethod?: 'cookie' | 'bearer' | ReadonlyArray<'cookie' | 'bearer'>;
  /**
   * @description
   * Configures one or more AuthenticationStrategies which defines how authentication
   * is handled in the Shop API.
   * @default NativeAuthenticationStrategy
   */
  shopAuthenticationStrategy?: AuthenticationStrategy[];
  /**
   * @description
   * Configures one or more AuthenticationStrategy which defines how authentication
   * is handled in the Admin API.
   * @default NativeAuthenticationStrategy
   */
  adminAuthenticationStrategy?: AuthenticationStrategy[];
  /**
   * @description
   * Determines whether new User accounts require verification of their email address.
   *
   * If set to "true", when registering via the `registerCustomerAccount` mutation, one should *not* set the
   * `password` property - doing so will result in an error. Instead, the password is set at a later stage
   * (once the email with the verification token has been opened) via the `verifyCustomerAccount` mutation.
   *
   * @default true
   */
  requireVerification?: boolean;
  /**
   * @description
   * Sets the length of time that a verification token is valid for, after which the verification token must be refreshed.
   *
   * Expressed as a string describing a time span per
   * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
   *
   * @default '7d'
   */
  verificationTokenDuration?: string | number;
}

export interface EntityOptions {
  entityIdStrategy?: EntityIdStrategy<any>;
}

export interface CometXConfig {
  /**
   * @description
   * Configuration for the GraphQL APIs, including hostname, port, CORS settings,
   * middleware etc.
   */
  apiConfig: ApiOptions;
  /**
   * @description
   * The connection options used by TypeORM to connect to the database.
   * See the [TypeORM documentation](https://typeorm.io/#/connection-options) for a
   * full description of all available options.
   */
  databaseConfig: ConnectionOptions;
  /**
   * @description
   * Configuration for authorization.
   */
  authConfig: AuthOptions;
  /**
   * @description
   * Configuration for entity.
   */
  entityConfig: EntityOptions;
}

/**
 * @description
 * This interface represents the CometXConfig object available at run-time, i.e. the user-supplied
 * config values have been merged with the {@link defaultConfig} values.
 */
export interface RuntimeCometXConfig extends Required<CometXConfig> {
  apiConfig: Required<ApiOptions>;
  authConfig: Required<AuthOptions>;
}

type DeepPartialSimple<T> = {
  [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
        ? Array<DeepPartialSimple<U>>
        : T[P] extends ReadonlyArray<infer X>
        ? ReadonlyArray<DeepPartialSimple<X>>
        : T[P] extends Type<any>
        ? T[P]
        : DeepPartialSimple<T[P]>);
};

export type PartialCometXConfig = DeepPartialSimple<CometXConfig>;

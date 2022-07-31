import { GqlModuleOptions, GraphQLTypesLoader } from '@nestjs/graphql';

import { buildSchema, GraphQLSchema, printSchema } from 'graphql';
import * as path from 'path';

export interface GraphQLApiOptions {
  apiType: 'shop' | 'admin';
  typePaths: string[];
  apiPath: string;
  debug: boolean;
  playground: boolean | any;
  resolverModule: any;
}

export async function createGraphQLOptions(
  typesLoader: GraphQLTypesLoader,
  options: GraphQLApiOptions,
): Promise<GqlModuleOptions> {
  const builtSchema = await buildSchemaForAPI();

  return {
    path: '/' + options.apiPath,
    typeDefs: printSchema(builtSchema),
    include: [...options.resolverModule],
    playground: options.playground || false,
    debug: options.debug || false,
    context: (req: any) => req,
    cors: false,
  } as GqlModuleOptions;

  /**
   * Generates the server's GraphQL schema by combining:
   * 1. the default schema as defined in the source .graphql files specified by `typePaths`
   * 2. any custom fields defined in the config
   * 3. any schema extensions defined by plugins
   */
  async function buildSchemaForAPI(): Promise<GraphQLSchema> {
    // Paths must be normalized to use forward-slash separators.
    // See https://github.com/nestjs/graphql/issues/336
    const normalizedPaths = options.typePaths
      .concat(['packages/graphql/src/lib/custom-fields.types.graphql'])
      .map(p => p.split(path.sep).join('/'));

    const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);

    const schema = buildSchema(typeDefs);

    return schema;
  }
}

import { ConfigModule, ConfigService } from '@cometx-server/config';
import {
  createGraphQLOptions,
  GraphQLApiOptions,
} from '@cometx-server/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule, GraphQLTypesLoader } from '@nestjs/graphql';

/**
 * Dynamically generates a GraphQLModule according to the given config options.
 */
export function configureGraphQLModule(
  getOptions: (configService: ConfigService) => GraphQLApiOptions,
) {
  return GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    useFactory: (
      configService: ConfigService,
      typesLoader: GraphQLTypesLoader,
    ) => {
      return createGraphQLOptions(typesLoader, getOptions(configService));
    },
    inject: [ConfigService, GraphQLTypesLoader],
    imports: [ConfigModule],
  });
}

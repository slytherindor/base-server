import {ApolloServer, gql} from 'apollo-server';
import * as fs from 'fs';
import {BookGqlEndpoint} from './graphql/endpoints/bookGqlEndpoint';
import logger from "./utils/logger";

export class GraphqlServerInitializer {
  private static resolvers: any;
  private static typeDefs: any;

  public static startGraphqlServer() {
    this.loadGraphqlSchema();
    this.initResolvers();
    const server = new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
      debug: false,
      context: ({req}) => ({req: req}),
    });
    // The `listen` method launches a web server.
    server.listen().then(({url}) => {
      logger.info(`GraphqlServerInitializer: 🚀  Graphql server ready at ${url}`);
    });
  }

  private static loadGraphqlSchema(): void {
    logger.info('GraphqlServerInitializer: Loading graphql schema');
    try {
      this.typeDefs = gql(
        fs.readFileSync(__dirname.concat('/graphql/schema.graphql'), 'utf8')
      );
    } catch (e) {
      logger.error('GraphqlServerInitializer: Failed to load graphql schema');
      throw e;
    }
  }

  private static initResolvers() {
    logger.info('GraphqlServerInitializer: Initializing graphql resolvers');
    const bookGqlEndpoint = new BookGqlEndpoint();
    this.resolvers = [bookGqlEndpoint.initialize()];
  }
}

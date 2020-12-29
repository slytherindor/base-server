import {ApolloServer, gql} from "apollo-server";
import * as fs from "fs";
import {BookResolver} from "./graphql/resolvers/bookResolver";
export class ServerInitializer {
    private static resolvers: any;
    private static typeDefs: any;
    public static start() {
        this.loadGraphqlSchema();
        this.initResolvers();
        const server = new ApolloServer({ typeDefs: this.typeDefs, resolvers: this.resolvers, debug: false, context: ({req}) => ( {req: req}) });
        // The `listen` method launches a web server.
        server.listen().then(({ url }) => {
            console.log(`🚀  Server ready at ${url}`);
        });

    }
    private static loadGraphqlSchema(): void {
        try {
            this.typeDefs = gql(fs.readFileSync(__dirname.concat('/graphql/schema.graphql'), 'utf8'))
        } catch (e) {
            console.error(e);
            process.exit(1);
        }

    }

    private static initResolvers() {
        let bookResolver1 = new BookResolver();
        this.resolvers = [bookResolver1.initialize()];
    }
}





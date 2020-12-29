import {ApolloServer, gql} from "apollo-server";
import * as fs from "fs";

export class ServerInitializer {
    private static resolvers: any;
    private static typeDefs: any;
    private static books: Array<any>;
    private static authors: Array<any>;
    public static start() {
        this.loadGraphqlSchema();
        this.initResolvers();
        const server = new ApolloServer({ typeDefs: this.typeDefs, resolvers: this.resolvers, debug: false });
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
        this.resolvers = {
            Query: {
                books: () => this.books,
                authors: () => this.authors,
                users: (parent: any, args: any, context: any, info: any) => {
                    // console.log(parent, args, context, info);
                    return [{
                        name: "User"
                    }];

                }
            },

            Mutation: {
                addBook: (parent: any, args: any, context: any, info: any) => {
                    let book = {
                        title: args["book"]["title"],
                        author: {
                            name: args["book"]["author"]
                        }
                    }
                    this.books.push(book);
                    return book;
                }
            }
        };
    }
}





import {BookRepository} from "../../repositories/BookRepository";
import Author from "../../database/models/Author";
import User from "../../database/models/User";
import {
    GQLBookInput,
    GQLBookResolvers,
    GQLMutation,
    GQLMutationAddBookArgs,
    GQLQueryBookArgs,
    GQLResolvers,
    GQLResolversTypes,
    GQLBook,
    GQLAuthor,
} from "../../generated/schema";
import Book, {BookInterface} from "../../database/models/Book";
import {GraphQLScalarType} from "graphql";

export class BookResolver {
    public bookResolvers!: GQLResolvers;

    public initialize(): GQLResolvers {
        this.bookResolvers = {
            Query: {
                books: this.getBooks,
                book: this.getBookById
            },
            Mutation: {
                addBook: this.addBook
            },
            Book: {
                title: this.titleResolver,
                author: this.bookAuthorResolver,

            }
        }
        return this.bookResolvers;
    }

    private getBooks(parent: any, args: any, context: any, info: any): Promise<BookInterface[]> {
        return Book.findAll({include: Book.associations.author})
    }

    private addBook(parent: any, args: GQLMutationAddBookArgs, context: any, info: any): Promise<BookInterface> {
        return Book.create(args.book);
    }

    private getBookById(parent: any, args: GQLQueryBookArgs, context: any, info: any): Promise<BookInterface> {
        return Book.findByPk(args.id, {rejectOnEmpty: true});
    }

    private async titleResolver(args: GQLBook, parent: any, context: any, info: any): Promise<string> {
        return args.title;

    }

    private async bookAuthorResolver(book: GQLBook, parent: any, context: any, info: any): Promise<GQLAuthor> {
        return Author.findByPk(book.authorId, {rejectOnEmpty: true});
    }


}

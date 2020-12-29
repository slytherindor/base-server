import "reflect-metadata";
import {Arg, Args, ArgsType, Ctx, Field, InputType, Int, Mutation, Query, Resolver} from "type-graphql";
import {BookType} from "./BookSchema";
import User from "../../database/models/User";
import {Max, MaxLength, Min} from "class-validator";

class BookService{
    async findById(id: number): Promise<BookType> {
        return new BookType();
    }

    findAll(param: { take: any; skip: any }): BookType[] {
        return [new BookType()];
    }

    async addNew(param: { data: NewBookInputData; user: User }): Promise<BookType> {
        return new BookType();
    }

    async removeById(id: number) {

    }
}

class BookNotFoundError implements Error {
    constructor(id: number) {
        this.message = `Book with id ${id} could not be found`;
        this.name = "BookNotFoundError";
    }

    message: string;
    name: string;
}

@ArgsType()
class BookArgs {
    @Field(type => Int)
    @Min(1)
    @Max(50)
    take: number = 25;

    @Field(type => Int)
    @Min(0)
    skip: number = 0;
}

@InputType()
class NewBookInputData {
    @Field()
    @MaxLength(30)
    title!: string;

    @Field()
    authorId!: number;

}

@Resolver(BookType)
export class BookResolver {
    constructor(private bookService: BookService) {
        this.bookService = bookService;

    }

    @Query(returns => BookType)
    async book(@Arg("id") id: number): Promise<BookType> {
        const book = await this.bookService.findById(id);
        if (book == undefined) {
            throw new BookNotFoundError(id);
        }
        return book;
    }

    @Query(returns => [BookType])
    recipes(@Args() { skip, take }: BookArgs): BookType[] {
        return this.bookService.findAll({ skip, take });
    }

    @Mutation(returns => BookType)
    async addBook(
        @Arg("newBookInputData") newBookInputData: NewBookInputData,
        @Ctx("user") user: User,
    ): Promise<BookType> {
        return this.bookService.addNew({data: newBookInputData, user});
    }

    @Mutation(returns => Boolean)
    async removeBook(@Arg("id") id: number): Promise<boolean> {
        try {
            await this.bookService.removeById(id);
            return true
        } catch {
            return false;
        }
    }

}

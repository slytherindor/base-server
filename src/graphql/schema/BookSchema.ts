import "reflect-metadata";
import {Field, ID, ObjectType} from "type-graphql";
import Book from "../../database/models/Book";

@ObjectType()
export class BookType extends Book{
    @Field(type => ID)
    id!: number;

    @Field()
    title!: string;

    @Field()
    authorId!: number;

    @Field()
    Author?: string
}

import {
    DataTypes,
    Model,
    Optional,
    BelongsToGetAssociationMixin,
    Association,
    BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin
} from "sequelize";
import {DatabaseClient} from "../client";
import Author from "./Author";
import User from "./User";

export interface BookInterface {
    id: number;
    title: string;
    authorId: number;

}

type BookCreationAttributes = Optional<BookInterface, 'id'>;

export default class Book extends Model<BookInterface, BookCreationAttributes> implements BookInterface {
    public id!: number;
    public title!: string;
    public authorId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
    public readonly author?: Author;

    public getAuthor!: BelongsToGetAssociationMixin<Author>;
    public addAuthor!: BelongsToSetAssociationMixin<Author, number>;
    public createAuthor!: BelongsToCreateAssociationMixin<Author>
    public static associations: {
        author: Association<User, Author>;
    };

    public static initialize() {
        console.info("Initializing Book model");
        const sequelize = DatabaseClient.defaultClient()
        Book.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            title: DataTypes.STRING,
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize: sequelize,
            tableName: "books",
            paranoid: true,
            timestamps: true
        });
    }

    public static associate() {
        Book.belongsTo(Author, { targetKey: "id", as: "author"});
    }
}

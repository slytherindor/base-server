import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
} from 'sequelize';
import logger from '../../utils/logger';
import {DatabaseClient} from '../client';
import Book from './Book';

export interface AuthorInterface {
  id: number;
  name: string;
}

type AuthorCreationAttributes = Optional<AuthorInterface, 'id'>;

export default class Author
  extends Model<AuthorInterface, AuthorCreationAttributes>
  implements AuthorInterface {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  public getBooks!: HasManyGetAssociationsMixin<Book>;
  public addBook!: HasManyAddAssociationMixin<Book, number>;
  public hasBook!: HasManyHasAssociationMixin<Book, number>;
  public countBooks!: HasManyCountAssociationsMixin;
  public createBook!: HasManyCreateAssociationMixin<Book>;

  public readonly books?: Book[];
  public static associations: {
    books: Association<Author, Book>;
  };
  public static initialize() {
    logger.info('Author: Initializing model');
    const sequelize = DatabaseClient.defaultClient();
    Author.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: DataTypes.STRING,
      },
      {
        sequelize: sequelize,
        tableName: 'authors',
        paranoid: true,
        timestamps: true,
      }
    );
  }
  /*
   * This method should only be called after initializing the model.
   * */
  public static associate() {
    Author.hasMany(Book, {
      sourceKey: 'id',
      foreignKey: 'authorId',
      as: 'books',
    });
  }
}

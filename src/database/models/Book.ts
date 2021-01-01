import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
  Optional,
} from 'sequelize';
import logger from '../../utils/logger';
import {DatabaseClient} from '../client';
import Author from './Author';

export interface BookInterface {
  id: number;
  title: string;
  authorId: number;
}

type BookCreationAttributes = Optional<BookInterface, 'id'>;

export default class Book
  extends Model<BookInterface, BookCreationAttributes>
  implements BookInterface {
  public id!: number;
  public title!: string;
  public authorId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  public readonly author?: Author;

  public getAuthor!: BelongsToGetAssociationMixin<Author>;
  public addAuthor!: BelongsToSetAssociationMixin<Author, number>;
  public createAuthor!: BelongsToCreateAssociationMixin<Author>;
  public static associations: {
    author: Association<Book, Author>;
  };

  public static initialize() {
    logger.info('Book: Initializing model');
    const sequelize = DatabaseClient.defaultClient();
    Book.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: DataTypes.STRING,
        authorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize: sequelize,
        tableName: 'books',
        paranoid: true,
        timestamps: true,
      }
    );
  }

  public static associate() {
    Book.belongsTo(Author, {targetKey: 'id', as: 'author'});
  }
}

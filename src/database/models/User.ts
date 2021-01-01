import {
  Association,
  DataTypes,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  Optional,
} from 'sequelize';
import logger from '../../utils/logger';
import {DatabaseClient} from '../client';
import UserCredential from './UserCredential';

export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
type UserCreationAttributes = Optional<UserInterface, 'id'>;

export default class User
  extends Model<UserInterface, UserCreationAttributes>
  implements UserInterface {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public readonly userCredential?: UserCredential;

  public getCredential!: HasOneGetAssociationMixin<UserCredential>;
  public createCredential!: HasOneCreateAssociationMixin<UserCredential>;
  public addCredential!: HasOneSetAssociationMixin<UserCredential, number>;
  /*
   * Following timestamps don't need to be initialized in model
   * They have to part of migration though.
   * Make sure you have enabled timestamps in model options */
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static associations: {
    userCredential: Association<User, UserCredential>;
  };

  public static initialize() {
    logger.info('User: Initializing model');
    const sequelize = DatabaseClient.defaultClient();
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
      },
      {
        sequelize: sequelize,
        tableName: 'users',
        paranoid: true,
        timestamps: true,
      }
    );
  }

  public static associate() {
    User.hasOne(UserCredential, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'userCredential',
    });
  }
}

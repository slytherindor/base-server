import {DataTypes, Model, Optional} from 'sequelize';
import logger from '../../utils/logger';
import {CRED_SALT} from '../../utils/secrets';
import {DatabaseClient} from '../client';
import User from './User';
const bcrypt = require('bcryptjs');

export interface UserCredentialInterface {
  id: number;
  userId: number;
  credential: string;
}

type UserCredentialCreationAttributes = Optional<UserCredentialInterface, 'id'>;

export default class UserCredential
  extends Model<UserCredentialInterface, UserCredentialCreationAttributes>
  implements UserCredentialInterface {
  public id!: number;
  public userId!: number;
  public credential!: string;
  /*
   * Following timestamps don't need to be initialized in model
   * They have to part of migration though.
   * Make sure you have enabled timestamps in model options */
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  public static initialize() {
    logger.info('UserCredential: Initializing model');
    const sequelize = DatabaseClient.defaultClient();
    UserCredential.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        credential: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelize,
        tableName: 'userCredentials',
        paranoid: true,
        timestamps: true,
        hooks: {
          beforeCreate: this.encryptPasswordHook,
        },
      }
    );
  }
  public static encryptPasswordHook(
    userCredential: UserCredential
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.encryptCredential(userCredential.credential)
        .then((encryptedCred: string) => {
          userCredential.credential = encryptedCred;
          resolve();
        })
        .catch((err: Error) => reject(err));
    });
  }

  public static encryptCredential(enteredCredential: string): Promise<string> {
    return bcrypt.hash(enteredCredential, CRED_SALT);
  }

  public async validPassword(enteredCredential: string): Promise<boolean> {
    const encrypted = await UserCredential.encryptCredential(enteredCredential);
    return bcrypt.compareSync(encrypted, this.credential);
  }

  public static associate() {
    UserCredential.belongsTo(User, {targetKey: 'id'});
  }
}

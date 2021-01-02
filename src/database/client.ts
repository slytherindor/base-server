import {Sequelize} from 'sequelize';
import logger from '../utils/logger';

export class DatabaseClient {
  private static instance: Sequelize;

  public static defaultClient(): Sequelize {
    if (!DatabaseClient.instance) {
      //TODO Log debug message with options used to create sequelize instance
      logger.debug('DatabaseClient: Creating sequelize instance with options.');
      DatabaseClient.instance = new Sequelize({
        dialect: 'mysql',
        database: 'simple_db',
        password: 'password',
        host: 'localhost',
        username: 'root',
        port: 3306,
      });
    }

    return DatabaseClient.instance;
  }
}

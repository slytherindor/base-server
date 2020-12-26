import {Sequelize} from 'sequelize';

export class DatabaseClient {
  private static instance: Sequelize;

  public static defaultClient(): Sequelize {
    if (!DatabaseClient.instance) {
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

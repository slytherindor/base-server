import * as fs from 'fs';
import * as Path from 'path';
import logger from '../utils/logger';

export class SchemaRegistrar {
  models: string[];
  constructor() {
    this.models = [];
  }
  public initializeSchema() {
    logger.info('SchemaRegistrar: Initializing sequelize models');
    try {
      fs.readdirSync(`${__dirname}/models`).forEach((file: string) => {
        if (Path.extname(file) === '.js' || Path.extname(file) === '.ts') {
          this.models.push(file);
        }
      });

      this.models.forEach((model: string) => {
        const sequelizeModel = require(Path.join(`${__dirname}/models`, model));
        sequelizeModel.default.initialize();
      });
    } catch (e) {
      logger.error('Failed to initialize sequelize models.');
      throw e;
    }
  }

  public establishAssociations() {
    try {
      this.models.forEach((model: string) => {
        const sequelizeModel = require(Path.join(`${__dirname}/models`, model));
        if (sequelizeModel.default.associate) {
          sequelizeModel.default.associate();
        }
      });
    } catch (e) {
      logger.error('Failed to initialize associations for sequelize models.');
      throw e;
    }
  }
}

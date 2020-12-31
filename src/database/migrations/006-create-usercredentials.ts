import {DataTypes} from 'sequelize';
import {Migration} from '../migrator';

export const up: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().createTable('userCredentials', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    credential: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });
};

export const down: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().dropTable('userCredentials');
};

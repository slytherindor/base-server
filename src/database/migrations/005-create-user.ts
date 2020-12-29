import {DataTypes} from 'sequelize';
import {Migration} from '../migrator';

export const up: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
};
export const down: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().dropTable('users');
};

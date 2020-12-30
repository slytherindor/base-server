import {DataTypes} from 'sequelize';
import {Migration} from '../migrator';

export const up: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().createTable('authors', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
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
  await sequelize.getQueryInterface().dropTable('authors');
};

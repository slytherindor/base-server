import {DataTypes} from 'sequelize';
import {Migration} from '../migrator';

export const up: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().createTable('books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    authorId: {
      type: DataTypes.INTEGER,
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
  await sequelize.getQueryInterface().dropTable('books');
};

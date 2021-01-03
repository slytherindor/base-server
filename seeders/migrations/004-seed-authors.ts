import {Migration} from '../../src/database/migrator';
import {createAuthors} from '../seedUtil';
export const up: Migration = async ({context: sequelize}) => {
  const authors = createAuthors(10);
  authors.forEach((author: any) => {
    author.createdAt = new Date();
    author.updatedAt = new Date();
  });
  await sequelize.getQueryInterface().bulkInsert('authors', authors);
};
export const down: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().bulkDelete('authors', {});
};

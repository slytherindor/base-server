import {Migration} from '../../src/database/migrator';
import {createBooks} from '../seedUtil';
export const up: Migration = async ({context: sequelize}) => {
  const books = createBooks(10);
  books.forEach((book: any) => {
    book.createdAt = new Date();
    book.updatedAt = new Date();
  });
  await sequelize.getQueryInterface().bulkInsert('books', books);
};
export const down: Migration = async ({context: sequelize}) => {
  await sequelize.getQueryInterface().bulkDelete('books', {});
};

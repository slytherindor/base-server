// eslint-disable-next-line node/no-unpublished-import
import * as faker from 'faker';
import {AuthorInterface} from '../src/database/models/Author';
import {BookInterface} from '../src/database/models/Book';
import {UserInterface} from '../src/database/models/User';

export function createBooks(numberOfItems: number): BookInterface[] {
  const books: BookInterface[] = [];
  for (let i = 1; i <= numberOfItems; i++) {
    const book: BookInterface = {
      id: i,
      title: faker.random.words(2),
      authorId: faker.random.number(10),
    };
    books.push(book);
  }
  return books;
}

export function createAuthors(numberOfItems: number): AuthorInterface[] {
  const authors: AuthorInterface[] = [];
  for (let i = 1; i <= numberOfItems; i++) {
    const author: AuthorInterface = {
      id: i,
      name: faker.name.firstName() + faker.name.lastName(),
    };
    authors.push(author);
  }
  return authors;
}

export function createUsers(numberOfItems: number): UserInterface[] {
  const users: UserInterface[] = [];
  for (let i = 1; i <= numberOfItems; i++) {
    const user: UserInterface = {
      id: i,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    };
    users.push(user);
  }
  return users;
}

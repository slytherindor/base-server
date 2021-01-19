import {createBooks, createUsers} from '../../seeders/seedUtil';
import {BookInterface} from '../../src/database/models/Book';
import User, {UserInterface} from '../../src/database/models/User';
import {UserCredentialInterface} from '../../src/database/models/UserCredential';
import {AbstractUserRepository} from '../../src/services/authService';
import {AbstractBookRepository} from '../../src/services/bookService';

export class StorageBookRepository extends AbstractBookRepository {
  private recordsCount: number;
  private books: Record<string, BookInterface>;
  constructor(recordsCount: number) {
    super();
    this.recordsCount = recordsCount;
    this.books = createBooks(this.recordsCount).reduce((acc, book) => {
      return {...acc, [book.id]: book};
    }, {});
  }

  add(title: string, authorId: number): Promise<BookInterface> {
    const newRecordCount = this.recordsCount + 1;
    return new Promise<BookInterface>((resolve, reject) => {
      const newBook: BookInterface = {
        title: title,
        authorId: authorId,
        id: newRecordCount,
      };
      const currentRecordLength = Object.keys(this.books).length;
      this.books[newRecordCount] = newBook;
      if (Object.keys(this.books).length === currentRecordLength + 1) {
        resolve(newBook);
      } else {
        reject('There was an error adding book to repo.');
      }
    });
  }

  list(options: {}): Promise<BookInterface[]> {
    return Promise.resolve(Object.values(this.books));
  }

  get(bookId: number): Promise<BookInterface> {
    return new Promise<BookInterface>((resolve, reject) => {
      if (bookId in this.books) {
        resolve(this.books[bookId]);
      } else {
        reject(`Book with bookId ${bookId} was not found`);
      }
    });
  }

  remove(bookId: number): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      try {
        delete this.books[bookId];
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export class StorareUserRepository extends AbstractUserRepository {
  private recordsCount: number;
  private users: Record<string, UserInterface>;
  private userCredentials: Record<string, UserCredentialInterface>;
  constructor(recordsCount: number) {
    super();
    this.recordsCount = recordsCount;
    this.users = createUsers(this.recordsCount).reduce((acc, user) => {
      return {...acc, [user.id]: user};
    }, {});
    this.userCredentials = {};
  }

  createUser(
    user: Omit<UserInterface, 'id'>,
    credential: string
  ): Promise<UserInterface> {
    const newRecordCount = this.recordsCount + 1;
    return new Promise<UserInterface>((resolve, reject) => {
      const currentRecordLength = Object.keys(this.users).length;
      this.users[newRecordCount] = {...user, id: newRecordCount};
      if (Object.keys(this.users).length === currentRecordLength + 1) {
        this.userCredentials[newRecordCount] = {
          id: newRecordCount,
          userId: newRecordCount,
          credential: credential,
        };
        resolve(this.users[newRecordCount]);
      } else {
        reject('There was an error adding user to repo.');
      }
    });
  }

  findById(id: string): Promise<UserInterface> {
    return new Promise<UserInterface>((resolve, reject) => {
      if (id in this.users) {
        resolve(this.users[id]);
      } else {
        reject(new Error('User not found'));
      }
    });
  }

  findUserWithCredential(identifier: string): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      const user = Object.values(this.users).filter(
        user => user.email == identifier
      );
      if (user && this.userCredentials[user[0].id]) {
        // @ts-ignore
        resolve({...user, userCredential: this.userCredentials[user[0].id]});
      } else if (!user) {
        resolve(null);
      }

      reject(new Error('User not found'));
    });
  }
}

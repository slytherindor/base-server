import {createBooks} from '../../seeders/seedUtil';
import {BookInterface} from '../../src/database/models/Book';
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

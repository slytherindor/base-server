import {FindOptions, WhereOptions} from 'sequelize';
import Book, {BookInterface} from '../database/models/Book';

export abstract class AbstractBookRepository {
  abstract add(title: string, authorId: number): Promise<BookInterface>;
  abstract get(bookId: number): Promise<BookInterface>;
  abstract remove(bookId: number): Promise<Boolean>;
  abstract list(options: {}): Promise<BookInterface[]>;
}

export class SeqeulizeBookRepository implements AbstractBookRepository {
  add(title: string, authorId: number): Promise<BookInterface> {
    return Book.create({title: title, authorId: authorId});
  }

  get(bookId: number): Promise<BookInterface> {
    console.log('Repository finding book.');
    return Book.findByPk(bookId, {rejectOnEmpty: true});
  }

  list(options: WhereOptions): Promise<BookInterface[]> {
    const findOptions: FindOptions = {
      where: options,
    };
    return Book.findAll(findOptions);
  }

  async remove(bookId: number): Promise<Boolean> {
    try {
      await Book.destroy({where: {id: bookId}});
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export class BookService {
  private repository: AbstractBookRepository;
  constructor(repository: AbstractBookRepository) {
    this.repository = repository;
  }

  getAllBooks(): Promise<BookInterface[]> {
    return this.repository.list({});
  }

  getBookById(bookId: number): Promise<BookInterface> {
    return this.repository.get(bookId);
  }

  removeBook(bookId: number): Promise<Boolean> {
    return this.repository.remove(bookId);
  }

  addBook(title: string, authorId: number): Promise<BookInterface> {
    return this.repository.add(title, authorId);
  }
}

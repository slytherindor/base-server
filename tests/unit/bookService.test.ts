import {createBooks} from '../../seeders/seedUtil';
import {BookService} from '../../src/services/bookService';
import {StorageBookRepository} from '../utils/testRepositories';

it('Book service will return all books', async () => {
  expect.assertions(1);
  const bookService = new BookService(new StorageBookRepository(10));
  const books = await bookService.getAllBooks();
  expect(books).toHaveLength(10);
});

it('Book service will add a book', async () => {
  expect.assertions(3);
  const bookService = new BookService(new StorageBookRepository(10));
  const book = createBooks(1)[0];
  const bookAdded = await bookService.addBook(book.title, book.authorId);
  expect(bookAdded.title).toEqual(book.title);
  expect(bookAdded.authorId).toEqual(book.authorId);
  const allBooks = await bookService.getAllBooks();
  expect(allBooks).toContainEqual(bookAdded);
});

it('Book service will remove a book', async () => {
  expect.assertions(1);
  const bookService = new BookService(new StorageBookRepository(10));
  const bookRemoved = await bookService.removeBook(1);
  expect(bookRemoved).toBeTruthy();
});

it('Book service will get a book by Id', async () => {
  expect.assertions(1);
  const bookService = new BookService(new StorageBookRepository(10));
  const book = await bookService.getBookById(1);
  expect(book).toBeTruthy();
});

it('Book service will fail to get a book by Id', async () => {
  const bookService = new BookService(new StorageBookRepository(10));
  expect.assertions(1);
  await expect(bookService.getBookById(11)).rejects.toBeTruthy();
});

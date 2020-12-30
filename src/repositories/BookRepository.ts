import Book, {BookInterface} from "../database/models/Book";

export class BookRepository {
    public getAllBooks(): Promise<BookInterface[]> {
        return new Promise<BookInterface[]>((resolve, reject) => {
            Book.findAll().then((books: Book[]) => {
                resolve(books)
            }).catch(err => reject(err));
            reject(new Error("No books found"));
        });
    };

    public findBookById(bookId: number): Promise<BookInterface> {
        return new Promise<BookInterface>((resolve, reject) => {
            Book.findByPk(1, {
                include: [Book.associations.author],
                rejectOnEmpty: false
            }).then((book: Book) => {
                resolve(book);
            }).catch(err => {
                reject(err);
            });
        });
    }

    public createBook(title: string, authorId: number): Promise<BookInterface> {
        return new Promise<BookInterface>((resolve, reject) => {
            console.log("BOOK", title, authorId);
            Book.create({title: title, authorId: authorId}).then((book: Book) => {
                resolve(book);
            }).catch(err => {
                console.error(err);
                reject(new Error("Could not create book."));
            });
        });
    }

}

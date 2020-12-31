import {BookInterface} from '../../../database/models/Book';
import {GQLBook, GQLQueryBookArgs} from '../../../generated/schema';
import {
  BookService,
  SeqeulizeBookRepository,
} from '../../../services/bookService';

abstract class AbstractClassQueryResolver<T> {
  abstract execute(): Promise<T>;
}

export class GetBookByIdQueryResolver
  implements AbstractClassQueryResolver<GQLBook> {
  private parent: any;
  private args: GQLQueryBookArgs;
  private context: any;
  private info: any;
  private service: BookService;
  private returnValue: GQLBook | undefined;
  constructor(parent: any, args: GQLQueryBookArgs, context: any, info: any) {
    this.parent = parent;
    this.args = args;
    this.context = context;
    this.info = info;
    this.service = new BookService(new SeqeulizeBookRepository());
  }

  public execute(): Promise<GQLBook> {
    return new Promise<GQLBook>((resolve, reject) => {
      this.executeResolver()
        .then(() => {
          resolve(this.returnValue!);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  private executeResolver(): Promise<void> {
    console.log('executing resolver');
    return this.service
      .getBookById(this.args.id)
      .then((value: BookInterface) => {
        this.returnValue = value;
      })
      .catch(e => {
        console.error(e);
        throw e;
      });
  }
}

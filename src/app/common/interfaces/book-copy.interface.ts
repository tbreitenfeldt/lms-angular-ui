import { Book } from './book.interface';
import { Branch } from './branch.interface';

export interface BookCopy {
  id: {
    book: Book;
    branch: Branch;
  };
  amount: number;
}

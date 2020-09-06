import { Book } from './book.interface';
import { Borrower } from './borrower.interface';
import { Branch } from './branch.interface';

export interface Loan {
  id: {
    book: Book;
    borrower: Borrower;
    branch: Branch;
  };
  dateOut: Date;
  dueDate: Date;
  dateIn: Date | null;
}

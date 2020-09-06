import { Book } from './book';
import { Loan } from './loan';
import { Branch } from './branch';
import { Borrower } from './borrower';

import { BehaviorSubject } from 'rxjs';

export interface BorrowerState {
  books?: BehaviorSubject<Book[]>,
  loans?: BehaviorSubject<Loan[]>,
  branches?: BehaviorSubject<Branch[]>,
  branch?: BehaviorSubject<Branch>,
  borrower?: Borrower
}

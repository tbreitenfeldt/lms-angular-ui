import { Book } from '../entity/book';

export interface Borrower {
  id: number,
  address: string,
  name: string,
  phone_number: string
}

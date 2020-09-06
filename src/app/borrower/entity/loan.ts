import { Author } from './author';
import { Genre } from './genre';

export interface Loan {
  id: {
    book: {
      id: string,
      title: string,
      publisher: {
        id: string,
        name: string,
        address: string,
        phoneNumber: string
      },
      authors: Array<Author>,
      genres: Array<Genre>
    },
    borrower: {
      id: string,
      name: string,
      address: string,
      phoneNumber: string
    }
    branch: {
     id: string,
     name: string,
     address: string
    }
  },
  dateOut: Date,
  dueDate: Date,
  dateIn: Date

}

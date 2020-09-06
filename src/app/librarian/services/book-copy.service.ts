import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BookCopy } from '../../common/interfaces/book-copy.interface';

@Injectable({
  providedIn: 'root',
})
export class BookCopyService {
  constructor(
    private http: HttpClient,
    @Inject('domain') private domain: string
  ) {}

  getBookCopies(id: number): Observable<BookCopy[]> {
    return this.http.get<BookCopy[]>(
      `${this.domain}/lms/librarian/book-copies/branches/${id}`
    );
  }

  updateBookCopy(
    bookId: number,
    branchId: number,
    bookCopy: BookCopy
  ): Observable<BookCopy> {
    return this.http.put<BookCopy>(
      `${this.domain}/lms/librarian/book-copies/books/${bookId}/branches/${branchId}`,
      bookCopy
    );
  }

  addBookCopy(bookCopy: BookCopy): Observable<BookCopy> {
    return this.http.post<BookCopy>(
      `${this.domain}/lms/librarian/book-copies`,
      bookCopy
    );
  }

  deleteBookCopy(bookId: number, branchId: number): Observable<object> {
    return this.http.delete<object>(
      `${this.domain}/lms/librarian/book-copies/books/${bookId}/branches/${branchId}`
    );
  }
}

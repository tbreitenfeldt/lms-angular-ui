import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Book } from '../../common/interfaces/book.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(
    private http: HttpClient,
    @Inject('domain') private domain: string
  ) {}

  getBooks(branchId: number): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.domain}/lms/librarian/books/book-copies/branches/${branchId}`
    );
  }
}

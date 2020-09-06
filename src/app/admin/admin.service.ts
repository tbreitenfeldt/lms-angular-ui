import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Author } from '../common/interfaces/author.interface';
import { Book } from '../common/interfaces/book.interface';
import { Borrower } from '../common/interfaces/borrower.interface';
import { Branch } from '../common/interfaces/branch.interface';
import { Loan } from '../common/interfaces/loan.interface';
import { Publisher } from '../common/interfaces/publisher.interface';
import { Genre } from '../common/interfaces/genre.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl: string;

  constructor(
    @Inject('domain') private domain: string,
    private http: HttpClient
  ) {
    this.baseUrl = this.domain + '/lms/admin';
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.baseUrl + '/author').pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteAuthor(id: number): Observable<{}> {
    return this.http.delete(this.baseUrl + '/author/' + id).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  editAuthor(author: Author): Observable<Author> {
    return this.http
      .put<Author>(this.baseUrl + '/author/' + author.id, author)
      .pipe(
        tap((data) => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  addAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(this.baseUrl + '/author', author).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl + '/book').pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<{}> {
    return this.http.delete(this.baseUrl + '/book/' + id).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  editBook(book: Book): Observable<Book> {
    return this.http.put<Book>(this.baseUrl + '/book/' + book.id, book).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.baseUrl + '/book', book).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getBorrowers(): Observable<Borrower[]> {
    return this.http.get<Borrower[]>(this.baseUrl + '/borrower').pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteBorrower(id: number): Observable<{}> {
    return this.http.delete(this.baseUrl + '/borrower/' + id).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  editBorrower(borrower: Borrower): Observable<Borrower> {
    return this.http
      .put<Borrower>(this.baseUrl + '/borrower/' + borrower.id, borrower)
      .pipe(
        tap((data) => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  addBorrower(borrower: Borrower): Observable<Borrower> {
    return this.http.post<Borrower>(this.baseUrl + '/borrower', borrower).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.baseUrl + '/branch').pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteBranch(id: number): Observable<{}> {
    return this.http.delete(this.baseUrl + '/branch/' + id).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  editBranch(branch: Branch): Observable<Branch> {
    return this.http
      .put<Branch>(this.baseUrl + '/branch/' + branch.id, branch)
      .pipe(
        tap((data) => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  addBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(this.baseUrl + '/branch', branch).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.baseUrl + '/loan').pipe(
      map((loans: Loan[]) =>
        loans.map((loan) => {
          loan.dateIn = loan.dateIn ? new Date(loan.dateIn) : null;
          loan.dateOut = loan.dateOut ? new Date(loan.dateOut) : null;
          loan.dueDate = loan.dueDate ? new Date(loan.dueDate) : null;
          return loan;
        })
      ),
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  private formatDate(date: Date): string {
    return (
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + date.getDate()).slice(-2) +
      '/' +
      date.getFullYear()
    );
  }

  editLoan(loan: Loan): Observable<Loan> {
    if (loan.dateIn) {
      // @ts-ignore
      loan.dateIn = this.formatDate(loan.dateIn);
    }
    // @ts-ignore
    loan.dateOut = this.formatDate(loan.dateOut);
    // @ts-ignore
    loan.dueDate = this.formatDate(loan.dueDate);
    return this.http.put<Loan>(this.baseUrl + '/loan', loan).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getPublishers(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(this.baseUrl + '/publisher').pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deletePublisher(id: number): Observable<{}> {
    return this.http.delete(this.baseUrl + '/publisher/' + id).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  editPublisher(publisher: Publisher): Observable<Publisher> {
    return this.http
      .put<Publisher>(this.baseUrl + '/publisher/' + publisher.id, publisher)
      .pipe(
        tap((data) => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  addPublisher(publisher: Publisher): Observable<Publisher> {
    return this.http
      .post<Publisher>(this.baseUrl + '/publisher', publisher)
      .pipe(
        tap((data) => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.baseUrl + '/genre').pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteGenre(id: number): Observable<{}> {
    return this.http.delete(this.baseUrl + '/genre/' + id).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  editGenre(genre: Genre): Observable<Genre> {
    return this.http
      .put<Genre>(this.baseUrl + '/genre/' + genre.id, genre)
      .pipe(
        tap((data) => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  addGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(this.baseUrl + '/genre', genre).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occured.
      errorMessage = `An error occured: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}

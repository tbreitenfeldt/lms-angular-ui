import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BorrowerState } from './entity/borrowerState';
import { Borrower } from './entity/borrower';
import { Loan } from './entity/loan';
import { Book } from './entity/book';
import { Branch } from './entity/branch';


@Injectable({ providedIn: 'root' })
export class BorrowerService {

  private store: BorrowerState = {
    books:    new BehaviorSubject<Book[]>([]),
    loans:    new BehaviorSubject<Loan[]>([]),
    branch:   new BehaviorSubject<Branch>(null),
    branches: new BehaviorSubject<Branch[]>([]),
    borrower: null,
  }

  private _state = new BehaviorSubject<BorrowerState>({} as BorrowerState);
  readonly state$ = this._state.asObservable();

  private hostPath: string;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) {
    this.hostPath = 'http://localhost:8080/lms/borrower';
  }

  get state() {
    return this.state$;
  }

  fetchBorrower(cardNum: string): Observable<Borrower> {
    const url = `http://www.mocky.io/v2/5eab4aad3300005d00760842`;
    return this.http.get(url, this.httpOptions).pipe(
      tap( (borrower: Borrower) => {
        this.store.borrower = borrower;
        this._state.next(Object.assign({}, this.store));
      }),
      catchError(this.handleError<any>('BorrowerSvc::fetchBorrower()'))
    )
  }

  fetchLoans() {
    const url = `${this.hostPath}/borrowers/${this.store.borrower.id}/loans`;
    this.http.get<Loan[]>(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('BorrowerSvc::fetchLoans()'))
    ).subscribe( (loans: Loan[]) => {
      this.store.loans.next(loans);
      this._state.next(Object.assign({}, this.store));
    });
  }

  fetchBranches(){

    const url = `${this.hostPath}/branches`;
    this.http.get<Branch[]>(url, this.httpOptions).pipe(
      catchError(this.handleError<Book[]>('BorrowerSvc::fetchBranches()'))
    ).subscribe( (branches: Branch[]) => {
      this.store.branches.next(branches);
      this._state.next(Object.assign({}, this.store));
    });
  }

  fetchAvailableBooks(branch: Branch){

    const borrowerId = this.store.borrower.id;

    const url = `${this.hostPath}/borrowers/${borrowerId}/branches/${branch.id}/available-books/`;
    this.http.get<Book[]>(url, this.httpOptions).pipe(
      catchError(this.handleError<Book[]>('BorrowerSvc::fetchAvailableBooks()'))
    ).subscribe( (books: Book[]) => {
        this.store.books.next(books);
        this.store.branch.next(branch);
        this._state.next(Object.assign({}, this.store));
    });
  }

  checkinLoan(loan: Loan) {

    const {
      borrowerId,
      branchId,
      bookId
    } = {
      borrowerId: this.store.borrower.id,
      branchId: loan.id.branch.id,
      bookId: loan.id.book.id
    };

    const url = `${this.hostPath}/borrowers/${borrowerId}/branches/${branchId}/books/${bookId}:checkin`;

    this.http.post(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('BorrowerSvc::checkinBook()'))
    ).subscribe( _ => {
      this.fetchLoans();
      this.fetchAvailableBooks(this.store.branch.getValue());
    });
  }

  checkoutBook(book: Book) {

    const borrower = this.store.borrower;
    const branch = this.store.branch.getValue();

    const url = `${this.hostPath}/borrowers/${borrower.id}/branches/${branch.id}/books/${book.id}:checkout`;

    this.http.post(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('BorrowerSvc::checkoutBook()'))
    ).subscribe( _ => {
      this.fetchLoans();
      this.fetchAvailableBooks(branch);
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

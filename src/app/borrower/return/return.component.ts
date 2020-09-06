import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { PagerService } from '../../common/services/pager.service';
import { Loan } from '../entity/loan';
import { Pager } from 'src/app/common/interfaces';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css'],
})
export class ReturnComponent implements OnInit {
  @Input() loans$;
  @Output('checkinLoan') checkinLoan: EventEmitter<any> = new EventEmitter();

  loan: Loan;

  searchLoans$: Observable<Loan[]>;
  searchTerms$ = new Subject<string>();

  pagedLoans$ = new BehaviorSubject<Loan[]>([]);

  pager: Pager;
  itemsPerPage: number;

  constructor(private pagerSvc: PagerService) {
    this.itemsPerPage = 5;
  }

  ngOnInit(): void {
    this.searchLoans$ = this.searchTerms$.pipe(
      debounceTime(300),
      switchMap((term: string) => this.searchLoans(term))
    );

    this.searchLoans$.subscribe((loans) => {
      this.setPage(this.pager.currentPage, loans);
    });

    this.loans$.subscribe((loans) => {
      this.setPage(1, loans);
      this.search('');
    });
  }

  search(term: string): void {
    this.searchTerms$.next(term);
  }

  searchLoans(term: string): Observable<Loan[]> {
    if (!term.trim()) {
      return this.loans$;
    }
    return of(
      this.loans$
        .getValue()
        .filter(
          (loan) =>
            loan.id.book.title.includes(term) ||
            loan.id.book.authors.join().includes(term)
        )
    );
  }

  setPage(page: number, loans: Loan[]): void {
    this.pager = this.pagerSvc.getPager(loans.length, page, this.itemsPerPage);

    this.pagedLoans$.next(
      loans.slice(this.pager.startIndex, this.pager.endIndex + 1)
    );
  }

  selectLoan(loan: Loan) {
    this.loan = loan;
  }

  getBookAuthors(book) {
    return book.authors.map((author) => author.name);
  }

  getBookGenres(book) {
    return book.genres.map((genre) => genre.name);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { PagerService } from '../../common/services/pager.service';
import { Book } from '../entity/book';
import { Pager } from 'src/app/common/interfaces';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  @Input() books$;
  @Input() branch$;

  @Output('checkoutBook') checkoutBook: EventEmitter<any> = new EventEmitter();

  book: Book;

  searchBooks$: Observable<Book[]>;
  searchTerms$ = new Subject<string>();

  pagedBooks$ = new BehaviorSubject<Book[]>([]);

  pager: Pager;
  itemsPerPage: number;

  constructor(private pagerSvc: PagerService) {
    this.itemsPerPage = 5;
  }

  ngOnInit(): void {
    this.searchBooks$ = this.searchTerms$.pipe(
      debounceTime(300),
      switchMap((term: string) => this.searchBooks(term))
    );

    this.searchBooks$.subscribe((books) => {
      this.setPage(this.pager.currentPage, books);
    });

    this.books$.subscribe((books) => {
      this.setPage(1, books);
      this.search('');
    });
  }

  search(term: string): void {
    this.searchTerms$.next(term);
  }

  searchBooks(term: string): Observable<Book[]> {
    if (!term.trim()) {
      return this.books$;
    }

    return of(
      this.books$
        .getValue()
        .filter(
          (book) =>
            book.title.includes(term) || book.authors.join().includes(term)
        )
    );
  }

  setPage(page: number, books: Book[]): void {
    this.pager = this.pagerSvc.getPager(books.length, page, this.itemsPerPage);

    this.pagedBooks$.next(
      books.slice(this.pager.startIndex, this.pager.endIndex + 1)
    );
  }

  selectBook(book: Book) {
    this.book = book;
  }

  getBookAuthors(book) {
    return book.authors.map((author) => author.name);
  }

  getBookGenres(book) {
    return book.genres.map((genre) => genre.name);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { BookCopyService } from '../services/book-copy.service';
import { BookService } from '../services/book.service';
import { PagerService } from '../../common/services/pager.service';
import { BookCopy } from '../../common/interfaces/book-copy.interface';
import { Book } from '../../common/interfaces/book.interface';
import { Branch } from '../../common/interfaces/branch.interface';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  selectedBook: Book;
  books: Book[];
  isLoading: boolean;
  branchId: number;
  amount: number = 0;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  totalItems: number;
  pager: any = {};
  pagedItems: any[];
  itemsPerPage = 5;

  constructor(
    public bookService: BookService,
    public bookCopyService: BookCopyService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private pagerService: PagerService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): Observable<Book[]> {
    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      const tempId: string = this.activatedRoute.snapshot.paramMap.get('id');
      this.branchId = parseInt(tempId, 10);

      if (this.branchId) {
        this.isLoading = true;
        const observable = this.bookService.getBooks(this.branchId);
        observable.subscribe((data: Book[]) => {
          this.books = data;
          this.totalItems = data.length;
          this.setPage(1);
          this.isLoading = false;
        });
        return observable;
      }
    }
    return null;
  }

  addBookCopy(): Observable<BookCopy> {
    const bookCopy: BookCopy = {
      id: {
        book: {
          id: this.selectedBook.id,
          title: null,
          publisher: null,
          authors: [],
          genres: [],
        },
        branch: { id: this.branchId, name: null, address: null },
      },
      amount: this.amount,
    };

    this.isLoading = true;
    const observable = this.bookCopyService.addBookCopy(bookCopy);
    observable.subscribe((data: BookCopy) => {
      this.amount = 0;
      this.modalRef.close();
      this.isLoading = false;
      this.router.navigate(['../book-copies'], {
        relativeTo: this.activatedRoute,
      });
    });
    return observable;
  }

  open(content, book: Book): Promise<any> {
    this.selectedBook = book;
    this.modalRef = this.modalService.open(content);
    return this.modalRef.result.then(
      (result) => {
        this.errMsg = '';
        this.closeResult = `Closed with ${result}`;
      },
      (reason) => {
        this.errMsg = '';
        this.closeResult = `Dismissed`;
      }
    );
  }

  setPage(page: number): void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    const data = this.books;
    this.pager = this.pagerService.getPager(
      data.length,
      page,
      this.itemsPerPage
    );
    this.pagedItems = data.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}

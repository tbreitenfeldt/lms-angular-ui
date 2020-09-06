import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BookCopyService } from '../services/book-copy.service';
import { BranchService } from '../services/branch.service';
import { PagerService } from '../../common/services/pager.service';
import { BookCopy } from '../../common/interfaces/book-copy.interface';
import { Branch } from '../../common/interfaces/branch.interface';

@Component({
  selector: 'app-book-copies',
  templateUrl: './book-copies.component.html',
  styleUrls: ['./book-copies.component.css'],
})
export class BookCopiesComponent implements OnInit {
  selectedBookCopy: BookCopy;
  bookCopies: BookCopy[];
  isLoading: any = { branch: false, bookCopies: false };
  branchId: number;
  branch: Branch;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  totalItems: number;
  pager: any = {};
  pagedItems: any[];
  itemsPerPage = 5;

  constructor(
    public bookCopyService: BookCopyService,
    public branchService: BranchService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private pagerService: PagerService
  ) {}

  ngOnInit(): void {
    this.loadBranch();
    this.loadBookCopies();
  }

  loadBranch(): Observable<Branch> {
    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      const tempId: string = this.activatedRoute.snapshot.paramMap.get('id');
      this.branchId = parseInt(tempId, 10);

      if (this.branchId) {
        this.isLoading.branch = true;
        const observable = this.branchService.getBranch(this.branchId);
        observable.subscribe((data: Branch) => {
          this.branch = data;
          this.isLoading.branch = false;
        });
        return observable;
      }
    }

    return null;
  }

  loadBookCopies(): Observable<BookCopy[]> {
    this.isLoading.bookCopies = true;
    const observable = this.bookCopyService.getBookCopies(this.branchId);
    observable.subscribe((data: BookCopy[]) => {
      this.bookCopies = data;
      this.totalItems = data.length;
      this.setPage(1);
      this.isLoading.bookCopies = false;
    });
    return observable;
  }

  deleteBookCopy(bookCopy): Observable<Object> {
    this.isLoading = true;
    const observable = this.bookCopyService.deleteBookCopy(
      bookCopy.id.book.id,
      bookCopy.id.branch.id
    );
    observable.subscribe((data: Object) => {
      const bookId = bookCopy.id.book.id;
      const branchId = bookCopy.id.branch.id;
      this.bookCopies = this.bookCopies.filter(
        (bc: BookCopy) => bc.id.book.id != bookId || bc.id.branch.id != branchId
      );

      this.totalItems -= 1;
      this.setPage(1);
      this.isLoading = false;
    });
    return observable;
  }

  updateBookCopy(): Observable<BookCopy> {
    this.isLoading = true;
    const observable = this.bookCopyService.updateBookCopy(
      this.selectedBookCopy.id.book.id,
      this.selectedBookCopy.id.branch.id,
      this.selectedBookCopy
    );
    observable.subscribe((data: BookCopy) => {
      this.modalRef.close();
      this.isLoading = false;
    });
    return observable;
  }

  open(content, bookCopy: BookCopy): Promise<any> {
    this.selectedBookCopy = bookCopy;
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
    const data = this.bookCopies;
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

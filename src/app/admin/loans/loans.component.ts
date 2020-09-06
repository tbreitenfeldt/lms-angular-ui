import { AdminService } from './../admin.service';
import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from 'src/app/common/services/pager.service';
import { Loan, Book, Branch, Borrower, Pager } from 'src/app/common/interfaces';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
})
export class LoansComponent implements OnInit {
  private modalRef: NgbModalRef;
  items: Loan[] = [];
  selectedItem: Loan;
  books: Book[] = [];
  branches: Branch[] = [];
  borrowers: Borrower[] = [];
  errorMessage: string;
  closeResult: string;
  searchString = '';
  pager: Pager;
  pagedItems: Loan[];
  itemsPerPage = 5;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private pagerService: PagerService
  ) {}

  open(content, item?: Loan) {
    this.selectedItem = item
      ? item
      : {
          id: {
            book: null,
            borrower: null,
            branch: null,
          },
          dateIn: null,
          dateOut: null,
          dueDate: null,
        };
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result) => {
        this.errorMessage = '';
        this.closeResult = `Closed with ${result}`;
      },
      (reason) => {
        this.errorMessage = `${reason}`;
        this.closeResult = `Dismissed`;
      }
    );
  }

  setPage(page: number): void {
    this.pager = this.pagerService.getPager(
      this.items.length,
      page,
      this.itemsPerPage
    );

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    this.pagedItems = this.items.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  fetchData(): void {
    this.adminService.getLoans().subscribe({
      next: (items) => {
        this.items = items;
        if (this.pager) {
          this.setPage(this.pager.currentPage);
        } else {
          this.setPage(1);
        }
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  fetchMisc(): void {
    this.adminService.getBorrowers().subscribe({
      next: (borrower) => (this.borrowers = borrower),
      error: (err) => (this.errorMessage = err),
    });
    this.adminService.getBranches().subscribe({
      next: (branches) => (this.branches = branches),
      error: (err) => (this.errorMessage = err),
    });
    this.adminService.getBooks().subscribe({
      next: (books) => (this.books = books),
      error: (err) => (this.errorMessage = err),
    });
  }

  submit() {
    this.adminService.editLoan(this.selectedItem).subscribe({
      next: (_) => this.fetchData(),
      error: (err) => (this.errorMessage = err),
    });

    this.modalRef.close();
  }

  compareItems(
    p1: Book | Borrower | Branch,
    p2: Book | Borrower | Branch
  ): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  setDueDate(selectedDate: string) {
    console.log(selectedDate);
    this.selectedItem.dueDate = new Date(selectedDate);
  }

  ngOnInit(): void {
    this.fetchData();
    this.fetchMisc();
  }
}

import { Component, OnInit, Input, Output } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { Loan } from '../entity/loan';
import { Book } from '../entity/book';
import { Branch } from '../entity/branch';
import { Borrower } from '../entity/borrower';
import { BorrowerState } from '../entity/borrowerState';
import { BorrowerService } from '../borrower.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Input() state$;

  constructor(
    private cookieSvc: CookieService,
    private borrowerSvc: BorrowerService
  ) {
    this.borrowerSvc.fetchLoans();
    this.borrowerSvc.fetchBranches();
  }

  ngOnInit(): void {

    this.state$.subscribe(
      state => {
        const borrower = state.borrower;
        const cookie = this.cookieSvc.get('borrowerId');

        if(borrower.id != parseInt(cookie)){
          state.next(Object.assign({}, {...state, borrower: null}));
          return;
        }

    });
  }

  selectBranch(branch: Branch):void {
    this.borrowerSvc.fetchAvailableBooks(branch);
  }

  checkoutBook(book: Book):void {
    this.borrowerSvc.checkoutBook(book);
  }

  checkinLoan(loan: Loan):void {
    this.borrowerSvc.checkinLoan(loan);
  }
}

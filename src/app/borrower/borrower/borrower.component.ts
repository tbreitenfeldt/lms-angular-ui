import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { BorrowerService } from '../borrower.service';

import { Borrower } from '../entity/borrower';
import { BorrowerState } from '../entity/borrowerState';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css'],
})
export class BorrowerComponent implements OnInit {

  state$: Observable<BorrowerState>;

  constructor(
    private cookieSvc: CookieService,
    private borrowerSvc: BorrowerService
  ) { }

  ngOnInit(): void { }

  onSubmit(form) {
    const cardNum = form.value.cardNum
    this.borrowerSvc.fetchBorrower(cardNum).subscribe(
      borrower => {
        this.cookieSvc.set( 'borrowerId', String(borrower.id) );
        this.state$ = this.borrowerSvc.state;
      }
    )
  }
}

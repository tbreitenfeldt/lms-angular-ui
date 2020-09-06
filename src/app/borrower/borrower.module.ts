import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PagerService } from '../common/services/pager.service';

import { BorrowerRoutingModule } from './borrower-routing.module';

import { BorrowerComponent } from './borrower/borrower.component';
import { HomeComponent } from './home/home.component';
import { TableComponent } from './table/table.component';
import { BranchesComponent } from './branches/branches.component';
import { ReturnComponent } from './return/return.component';
import { CheckoutComponent } from './checkout/checkout.component';



@NgModule({
  declarations: [
    BorrowerComponent,
    HomeComponent,
    TableComponent,
    BranchesComponent,
    ReturnComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    BorrowerRoutingModule
  ],
  providers: [ PagerService ]
})
export class BorrowerModule { }

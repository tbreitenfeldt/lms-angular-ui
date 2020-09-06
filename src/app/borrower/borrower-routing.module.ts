import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BorrowerComponent } from './borrower/borrower.component';

const routes: Routes = [
  {
    path: '',
    component: BorrowerComponent,
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BorrowerRoutingModule {}

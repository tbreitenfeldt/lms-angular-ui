import { RegisterComponent } from './register/register.component';
import { GenresComponent } from './genres/genres.component';
import { CommonModule } from '@angular/common';
import { PublishersComponent } from './publishers/publishers.component';
import { LoansComponent } from './loans/loans.component';
import { BranchesComponent } from './branches/branches.component';
import { BorrowersComponent } from './borrowers/borrowers.component';
import { BooksComponent } from './books/books.component';
import { AuthorsComponent } from './authors/authors.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'authors',
        component: AuthorsComponent,
      },
      {
        path: 'books',
        component: BooksComponent,
      },
      {
        path: 'borrowers',
        component: BorrowersComponent,
      },
      {
        path: 'branches',
        component: BranchesComponent,
      },
      {
        path: 'genres',
        component: GenresComponent,
      },
      {
        path: 'loans',
        component: LoansComponent,
      },
      {
        path: 'publishers',
        component: PublishersComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

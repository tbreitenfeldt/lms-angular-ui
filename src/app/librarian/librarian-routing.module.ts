import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibrarianComponent } from './librarian.component';
import { BranchesComponent } from './branches/branches.component';
import { BookCopiesComponent } from './book-copies/book-copies.component';
import { BooksComponent } from './books/books.component';

const routes: Routes = [
  {
    path: '',
    component: LibrarianComponent,
    children: [
      {
        path: '',
        component: BranchesComponent,
      },
      {
        path: 'branches/:id/book-copies',
        component: BookCopiesComponent,
      },
      {
        path: 'branches/:id/books',
        component: BooksComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibrarianRoutingModule {}

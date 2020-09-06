import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './interceptors/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import(`./admin/admin.module`).then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'librarian',
    loadChildren: () =>
      import('./librarian/librarian.module').then((m) => m.LibrarianModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'borrower',
    loadChildren: () =>
      import('./borrower/borrower.module').then((m) => m.BorrowerModule),
  },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

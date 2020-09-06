import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { LibrarianRoutingModule } from './librarian-routing.module';
import { LibrarianComponent } from './librarian.component';
import { BranchesComponent } from './branches/branches.component';
import { BookCopiesComponent } from './book-copies/book-copies.component';
import { BooksComponent } from './books/books.component';
import { BranchService } from './services/branch.service';
import { BookCopyService } from './services/book-copy.service';
import { BookService } from './services/book.service';

@NgModule({
  declarations: [
    LibrarianComponent,
    BranchesComponent,
    BookCopiesComponent,
    BooksComponent,
  ],
  imports: [CommonModule, LibrarianRoutingModule, NgbModule, FormsModule],
  providers: [BranchService, BookCopyService, BookService],
})
export class LibrarianModule {}

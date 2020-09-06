import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BookCopy } from '../../common/interfaces/book-copy.interface';
import { Book } from '../../common/interfaces/book.interface';
import { BooksComponent } from './books.component';
import { PagerService } from '../../common/services/pager.service';
import { LibrarianRoutingModule } from '../librarian-routing.module';
import { BookService } from '../services/book.service';
import { BookCopyService } from '../services/book-copy.service';

export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
}

export class ParamMap {
  has(name): boolean {
    return true;
  }

  get(name): string {
    return '1';
  }
}

export class MockActivatedRoute extends ActivatedRoute {
  snapshot: any;

  constructor() {
    super();
    this.snapshot = {
      paramMap: new ParamMap(),
    };
  }
}

export class MockRouter {
  navigate(v) {}
}

export class MockBookCopyService {
  getBookCopies(id: number): Observable<BookCopy[]> {
    const result: BookCopy[] = [];
    return of(result);
  }

  updateBookCopy(
    bookId: number,
    branchId: number,
    bookCopy: BookCopy
  ): Observable<BookCopy> {
    const result: BookCopy = null;
    return of(result);
  }

  addBookCopy(bookCopy: BookCopy): Observable<BookCopy> {
    const result: BookCopy = null;
    return of(result);
  }

  deleteBookCopy(bookId: number, branchId: number): Observable<object> {
    const result: any = null;
    return of(result);
  }
}

export class MockBookService {
  getBooks(branchId: number): Observable<Book[]> {
    const result: Book[] = [];
    return of(result);
  }
}

describe('BooksComponent', () => {
  let component: BooksComponent;
  let mockBookCopyService: MockBookCopyService;
  let mockBookService: MockBookService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let mockModalRef: MockNgbModalRef;
  let mockActivatedRoute: ActivatedRoute;
  let mockRouter: MockRouter;
  let fixture: ComponentFixture<BooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BooksComponent],
      imports: [
        CommonModule,
        LibrarianRoutingModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
      ],
      providers: [
        MockBookCopyService,
        MockBookService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: 'domain', useValue: 'http://localhost:8080' },
      ],
    }).compileComponents();

    mockActivatedRoute = new MockActivatedRoute();
    mockRouter = new MockRouter();
    mockModalRef = new MockNgbModalRef();
    mockBookCopyService = new MockBookCopyService();
    mockBookService = new MockBookService();
    pagerService = new PagerService();
    modalService = TestBed.get(NgbModal);

    component = new BooksComponent(
      mockBookService as BookService,
      mockBookCopyService as BookCopyService,
      mockActivatedRoute,
      modalService,
      mockRouter as Router,
      pagerService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call life cycle method ngOnInit', () => {
    spyOn(component, 'loadBooks');
    component.ngOnInit();
    expect(component.loadBooks).toHaveBeenCalled();
  });

  it('should load books from service using mock data', () => {
    const mockBooks: Book[] = [
      {
        id: 1,
        title: 'title1',
        genres: [{ id: 1, name: 'genre1' }],
        authors: [{ id: 1, name: 'author1' }],
        publisher: {
          id: 1,
          name: 'publisher1',
          address: 'address1',
          phoneNumber: '123',
        },
      },
      {
        id: 2,
        title: 'title2',
        genres: [{ id: 2, name: 'genre2' }],
        authors: [{ id: 2, name: 'author2' }],
        publisher: {
          id: 2,
          name: 'publisher2',
          address: 'address2',
          phoneNumber: '456',
        },
      },
    ];

    spyOn(mockBookService, 'getBooks').and.returnValue(of(mockBooks));
    component.loadBooks().subscribe(() => {
      expect(mockBookService).toBeTruthy();
      expect(component.books.length).toEqual(2);
      expect(component.books).toEqual(mockBooks);
    });
  });

  it('Should open a modal window', () => {
    const mockBook: Book = {
      id: 2,
      title: 'title2',
      genres: [{ id: 2, name: 'genre2' }],
      authors: [{ id: 2, name: 'author2' }],
      publisher: {
        id: 2,
        name: 'publisher2',
        address: 'address2',
        phoneNumber: '45678',
      },
    };

    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.open('editBookCopyModal', mockBook);
  });

  it('Should close a modal', () => {
    const mockBook: Book = {
      id: 2,
      title: 'title2',
      genres: [{ id: 2, name: 'genre2' }],
      authors: [{ id: 2, name: 'author2' }],
      publisher: {
        id: 2,
        name: 'publisher2',
        address: 'address2',
        phoneNumber: '45678',
      },
    };

    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.open('editBookCopyModal', mockBook).catch(() => {
      expect(component.closeResult).toBe('Dismissed');
    });
  });
});

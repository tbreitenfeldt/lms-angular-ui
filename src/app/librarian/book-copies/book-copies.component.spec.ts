import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { of, BehaviorSubject, Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LibrarianRoutingModule } from '../librarian-routing.module';
import { PagerService } from '../../common/services/pager.service';
import { BookCopiesComponent } from './book-copies.component';
import { BookCopy } from '../../common/interfaces/book-copy.interface';
import { Branch } from '../../common/interfaces/branch.interface';
import { BookCopyService } from '../services/book-copy.service';
import { BranchService } from '../services/branch.service';

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

export class MockBranchService {
  getBranches(): Observable<Branch[]> {
    const result: Branch[] = [];
    return of(result);
  }

  getBranch(id: number): Observable<Branch> {
    const result: Branch = null;
    return of(result);
  }

  updateBranch(id: number, branch: Branch): Observable<Branch> {
    const result: Branch = null;
    return of(result);
  }
}

describe('BookCopiesComponent', () => {
  let component: BookCopiesComponent;
  let mockBookCopyService: MockBookCopyService;
  let mockBranchService: MockBranchService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let mockModalRef: MockNgbModalRef;
  let mockActivatedRoute: ActivatedRoute;
  let fixture: ComponentFixture<BookCopiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookCopiesComponent],
      imports: [
        CommonModule,
        LibrarianRoutingModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
      ],
      providers: [
        MockBookCopyService,
        MockBranchService,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: 'domain', useValue: 'http://localhost:8080' },
      ],
    }).compileComponents();

    mockActivatedRoute = new MockActivatedRoute();
    mockModalRef = new MockNgbModalRef();
    mockBookCopyService = new MockBookCopyService();
    mockBranchService = new MockBranchService();
    pagerService = new PagerService();
    modalService = TestBed.get(NgbModal);

    component = new BookCopiesComponent(
      mockBookCopyService as BookCopyService,
      mockBranchService as BranchService,
      mockActivatedRoute,
      modalService,
      pagerService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCopiesComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call life cycle method ngOnInit', () => {
    spyOn(component, 'loadBookCopies');
    spyOn(component, 'loadBranch');
    component.ngOnInit();
    expect(component.loadBookCopies).toHaveBeenCalled();
    expect(component.loadBranch).toHaveBeenCalled();
  });

  it('should load book copies from service using mock data', () => {
    const mockBookCopies: BookCopy[] = [
      {
        id: {
          branch: { id: 1, name: 'branch1', address: 'address1' },
          book: {
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
        },
        amount: 1,
      },
      {
        id: {
          branch: { id: 1, name: 'branch1', address: 'address1' },
          book: {
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
          },
        },
        amount: 2,
      },
    ];

    spyOn(mockBookCopyService, 'getBookCopies').and.returnValue(
      of(mockBookCopies)
    );
    component.loadBookCopies().subscribe(() => {
      expect(mockBookCopyService).toBeTruthy();
      expect(component.bookCopies.length).toEqual(2);
      expect(component.bookCopies).toEqual(mockBookCopies);
    });
  });

  it('Should load library branch from service using  mock data', () => {
    const mockBranch: Branch = {
      id: 1,
      name: 'branch1',
      address: 'address1',
    };

    spyOn(mockBranchService, 'getBranch').and.returnValue(of(mockBranch));
    component.loadBranch().subscribe(() => {
      expect(mockBranchService).toBeTruthy();
      expect(component.branch).toEqual(mockBranch);
    });
  });

  it('Should open a modal window', () => {
    const mockBookCopy: BookCopy = {
      id: {
        branch: { id: 1, name: 'branch1', address: 'address1' },
        book: {
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
        },
      },
      amount: 2,
    };

    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.open('editBookCopyModal', mockBookCopy);
  });

  it('Should close a modal', () => {
    const mockBookCopy: BookCopy = {
      id: {
        branch: { id: 1, name: 'branch1', address: 'address1' },
        book: {
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
        },
      },
      amount: 2,
    };

    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.open('editBookCopyModal', mockBookCopy).catch(() => {
      expect(component.closeResult).toBe('Dismissed');
    });
  });
});

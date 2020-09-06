import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './../admin.service';
import { Loan } from 'src/app/common/interfaces/loan.interface';
import { Observable, of } from 'rxjs';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { LoansComponent } from './loans.component';
import {
  Author,
  Book,
  Borrower,
  Branch,
  Genre,
  Publisher,
} from 'src/app/common/interfaces';

const mockAuthors: Author[] = [{ id: 1, name: 'James S. A. Corey' }];
const mockPublishers: Publisher[] = [
  {
    id: 1,
    name: 'Orbit Books',
    address: 'London, UK',
    phoneNumber: '555-5555',
  },
];
const mockGenres: Genre[] = [{ id: 1, name: 'SciFi' }];
const mockBooks: Book[] = [
  {
    id: 1,
    title: 'The Leviathan Awakes',
    authors: [mockAuthors[0]],
    publisher: mockPublishers[0],
    genres: mockGenres,
  },
  {
    id: 2,
    // tslint:disable-next-line:quotemark
    title: "Caliban's War",
    authors: [mockAuthors[0]],
    publisher: mockPublishers[0],
    genres: mockGenres,
  },
];
const mockBorrowers: Borrower[] = [
  {
    id: 1,
    name: 'Joe Smith',
    address: '1325 S 76TH Ave. Yakima, Washington',
    phoneNumber: '509-287-4787',
  },
  {
    id: 2,
    name: 'Steve Cook',
    address: '1827 Tod Rd. Arlington, Virginia',
    phoneNumber: '706-287-2998',
  },
];
const mockBranches: Branch[] = [
  {
    id: 1,
    name: 'Seattle Library Hello',
    address: '172 1st St. Seattle Wa 172673',
  },
  {
    id: 2,
    name: 'Chantilly Regional Library',
    address: 'Blah blah blah',
  },
];
const mockData: Loan[] = [
  {
    id: {
      book: mockBooks[0],
      borrower: mockBorrowers[0],
      branch: mockBranches[0],
    },
    dateOut: new Date('04/13/2020'),
    dueDate: new Date('04/14/2020'),
    dateIn: null,
  },
  {
    id: {
      book: mockBooks[1],
      borrower: mockBorrowers[1],
      branch: mockBranches[1],
    },
    dateOut: new Date('05/05/2020'),
    dueDate: new Date('05/12/2020'),
    dateIn: null,
  },
];

// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
  close(): void {}
}

class MockAdminService {
  data: Loan[] = mockData;
  borrowers: Borrower[] = mockBorrowers;
  branches: Branch[] = mockBranches;
  books: Book[] = mockBooks;

  getLoans(): Observable<Loan[]> {
    return of(this.data);
  }

  getBorrowers(): Observable<Borrower[]> {
    return of(this.borrowers);
  }

  getBranches(): Observable<Branch[]> {
    return of(this.branches);
  }

  getBooks(): Observable<Book[]> {
    return of(this.books);
  }

  editLoan(loan: Loan): Observable<Loan> {
    return of(loan);
  }
}

describe('LoansComponent', () => {
  let component: LoansComponent;
  let fixture: ComponentFixture<LoansComponent>;
  let modalService: NgbModal;
  let adminService: AdminService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoansComponent],
      imports: [NgbModule],
      providers: [
        LoansComponent,
        { provide: AdminService, useClass: MockAdminService },
      ],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(LoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load components and call life cycle methods', () => {
    spyOn(component, 'fetchData');
    component.ngOnInit();

    expect(component.fetchData).toHaveBeenCalled();
  });

  describe('fetchData', () => {
    it('should get loans', () => {
      component.fetchData();
      expect(component.items).toEqual(mockData);
    });
  });

  describe('open', () => {
    it('should set selectedLoan correctly when opened with no Loan', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editLoanModal' as any);
      expect(component.selectedItem.id.book).toBeNull();
      expect(component.selectedItem.id.borrower).toBeNull();
      expect(component.selectedItem.id.branch).toBeNull();
    }));

    it('should set selectedLoan correctly when opened with an Loan', fakeAsync(() => {
      const loan: Loan = mockData[0];
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editLoanModal' as any, loan);
      expect(component.selectedItem.id).toEqual(loan.id);
    }));

    it('should close a modal window', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      mockModalRef.result = new Promise((resolve, reject) =>
        reject('someerror')
      );
      component.open('editLoanModal' as any);
      tick();
      expect(component.closeResult).toBe('Dismissed');
    }));
  });

  describe('submit', () => {
    it('should call the service editLoan method when a pre-existing loan is selected', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      const loan = mockData[0];
      component.selectedItem = loan;
      component.open('editLoanModal' as any, loan);
      tick();
      component.submit();
    }));
  });
});

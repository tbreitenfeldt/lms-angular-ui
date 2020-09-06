import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './../admin.service';
import { Borrower } from 'src/app/common/interfaces';
import { Observable, of } from 'rxjs';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { BorrowersComponent } from './borrowers.component';

const mockData: Borrower[] = [
  { id: 1, name: 'Jenny', address: 'The Block', phoneNumber: '867-5309' },
];

// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
  close(): void {}
}

class MockAdminService {
  data: Borrower[] = mockData;

  getBorrowers(): Observable<Borrower[]> {
    return of(this.data);
  }

  deleteBorrower(id: number): Observable<{}> {
    this.data = this.data.filter((x) => x.id !== id);
    return of({});
  }

  editBorrower(borrower: Borrower): Observable<Borrower> {
    return of(borrower);
  }
}

describe('BorrowersComponent', () => {
  let component: BorrowersComponent;
  let fixture: ComponentFixture<BorrowersComponent>;
  let modalService: NgbModal;
  let adminService: AdminService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowersComponent],
      imports: [NgbModule],
      providers: [
        BorrowersComponent,
        { provide: AdminService, useClass: MockAdminService },
      ],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(BorrowersComponent);
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
    it('should get borrowers', () => {
      component.fetchData();
      expect(component.items).toEqual(mockData);
    });
  });

  describe('open', () => {
    it('should set selectedItem correctly when opened with no Borrower', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editBorrowerModal' as any);
      expect(component.selectedItem.id).toBeNull();
      expect(component.selectedItem.name).toEqual('');
    }));

    it('should set selectedItem correctly when opened with an Borrower', fakeAsync(() => {
      const borrower: Borrower = mockData[0];
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editBorrowerModal' as any, borrower);
      expect(component.selectedItem.id).toEqual(borrower.id);
      expect(component.selectedItem.name).toEqual(borrower.name);
    }));

    it('should close a modal window', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      mockModalRef.result = new Promise((resolve, reject) =>
        reject('someerror')
      );
      component.open('editBorrowerModal' as any);
      tick();
      expect(component.closeResult).toBe('Dismissed');
    }));
  });

  describe('submit', () => {
    it('should call the service editBorrower method when a pre-existing borrower is selected', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      const borrower = mockData[0];
      component.selectedItem = borrower;
      component.open('editBorrowerModal' as any, borrower);
      tick();
      component.submit();
    }));
  });
});

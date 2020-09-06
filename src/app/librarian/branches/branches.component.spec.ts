import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { of, Observable } from 'rxjs';

import { BranchesComponent } from './branches.component';
import { LibrarianRoutingModule } from '../librarian-routing.module';
import { PagerService } from '../../common/services/pager.service';
import { Branch } from '../../common/interfaces/branch.interface';
import { BookCopyService } from '../services/book-copy.service';
import { BranchService } from '../services/branch.service';

export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
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

describe('BranchesComponent', () => {
  let component: BranchesComponent;
  let mockBranchService: MockBranchService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();
  let fixture: ComponentFixture<BranchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchesComponent],
      imports: [
        CommonModule,
        LibrarianRoutingModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
      ],
      providers: [
        MockBranchService,
        { provide: 'domain', useValue: 'http://localhost:8080' },
      ],
    }).compileComponents();

    mockBranchService = new MockBranchService();
    pagerService = new PagerService();
    modalService = TestBed.get(NgbModal);
    component = new BranchesComponent(
      mockBranchService as BranchService,
      modalService,
      pagerService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call life cycle method ngOninit', () => {
    spyOn(component, 'loadBranches');
    component.ngOnInit();
    expect(component.loadBranches).toHaveBeenCalled();
  });

  it('Should load all library branches from service using  mock data', () => {
    const mockBranches: Branch[] = [
      { id: 1, name: 'branch1', address: 'address1' },
      { id: 2, name: 'branch2', address: 'address2' },
    ];
    spyOn(mockBranchService, 'getBranches').and.returnValue(of(mockBranches));
    component.loadBranches().subscribe(() => {
      expect(mockBranchService).toBeTruthy();
      expect(component.branches.length).toEqual(2);
      expect(component.branches).toEqual(mockBranches);
    });
  });

  it('Should open a modal window', () => {
    const mockBranch: Branch = { id: 1, name: 'name1', address: 'address1' };
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.open('editLibraryBranchModal', mockBranch);
  });

  it('Should close a modal', () => {
    const mockBranch: Branch = { id: 1, name: 'name1', address: 'address1' };
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.open('editLibraryBranchModal', mockBranch).catch(() => {
      expect(component.closeResult).toBe('Dismissed');
    });
  });
});

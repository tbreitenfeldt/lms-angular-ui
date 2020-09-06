import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './../admin.service';
import { Branch } from 'src/app/common/interfaces';
import { Observable, of } from 'rxjs';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { BranchesComponent } from './branches.component';

const mockData: Branch[] = [
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

// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
  close(): void {}
}

class MockAdminService {
  data: Branch[] = mockData;

  getBranches(): Observable<Branch[]> {
    return of(this.data);
  }

  deleteBranch(id: number): Observable<{}> {
    this.data = this.data.filter((x) => x.id !== id);
    return of({});
  }

  editBranch(branch: Branch): Observable<Branch> {
    return of(branch);
  }
}

describe('BranchesComponent', () => {
  let component: BranchesComponent;
  let fixture: ComponentFixture<BranchesComponent>;
  let modalService: NgbModal;
  let adminService: AdminService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchesComponent],
      imports: [NgbModule],
      providers: [
        BranchesComponent,
        { provide: AdminService, useClass: MockAdminService },
      ],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(BranchesComponent);
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
    it('should get branches', () => {
      component.fetchData();
      expect(component.items).toEqual(mockData);
    });
  });

  describe('open', () => {
    it('should set selectedItem correctly when opened with no Branch', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editBranchModal' as any);
      expect(component.selectedItem.id).toBeNull();
      expect(component.selectedItem.name).toEqual('');
    }));

    it('should set selectedItem correctly when opened with an Branch', fakeAsync(() => {
      const branch: Branch = mockData[0];
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editBranchModal' as any, branch);
      expect(component.selectedItem.id).toEqual(branch.id);
      expect(component.selectedItem.name).toEqual(branch.name);
    }));

    it('should close a modal window', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      mockModalRef.result = new Promise((resolve, reject) =>
        reject('someerror')
      );
      component.open('editBranchModal' as any);
      tick();
      expect(component.closeResult).toBe('Dismissed');
    }));
  });

  describe('submit', () => {
    it('should call the service editBranch method when a pre-existing branch is selected', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      const branch = mockData[0];
      component.selectedItem = branch;
      component.open('editBranchModal' as any, branch);
      tick();
      component.submit();
    }));
  });
});

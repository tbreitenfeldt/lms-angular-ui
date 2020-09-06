import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './../admin.service';
import { Publisher } from 'src/app/common/interfaces';
import { Observable, of } from 'rxjs';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { PublishersComponent } from './publishers.component';

const mockData: Publisher[] = [
  {
    id: 1,
    name: 'Penguin House Inc.',
    address: '1234 Arlington Ave. Fairfax Virginia 27363',
    phoneNumber: '762-282-8787',
  },
  {
    id: 2,
    name: 'Macmillan Publishers',
    address: '32605 5th Ave. Seattle, Washington',
    phoneNumber: '206-716-2787',
  },
  {
    id: 3,
    name: 'Simon & Schuster',
    address: '88781 51 St. Portland, Oregon',
    phoneNumber: '506-287-8878',
  },
];

// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
  close(): void {}
}

class MockAdminService {
  data: Publisher[] = mockData;

  getPublishers(): Observable<Publisher[]> {
    return of(this.data);
  }

  deletePublisher(id: number): Observable<{}> {
    this.data = this.data.filter((x) => x.id !== id);
    return of({});
  }

  editPublisher(publisher: Publisher): Observable<Publisher> {
    return of(publisher);
  }
}

describe('PublishersComponent', () => {
  let component: PublishersComponent;
  let fixture: ComponentFixture<PublishersComponent>;
  let modalService: NgbModal;
  let adminService: AdminService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublishersComponent],
      imports: [NgbModule],
      providers: [
        PublishersComponent,
        { provide: AdminService, useClass: MockAdminService },
      ],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(PublishersComponent);
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
    it('should get publishers', () => {
      component.fetchData();
      expect(component.items).toEqual(mockData);
    });
  });

  describe('open', () => {
    it('should set selectedItem correctly when opened with no Publisher', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editPublisherModal' as any);
      expect(component.selectedItem.id).toBeNull();
      expect(component.selectedItem.name).toEqual('');
    }));

    it('should set selectedItem correctly when opened with an Publisher', fakeAsync(() => {
      const publisher: Publisher = mockData[0];
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editPublisherModal' as any, publisher);
      expect(component.selectedItem.id).toEqual(publisher.id);
      expect(component.selectedItem.name).toEqual(publisher.name);
    }));

    it('should close a modal window', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      mockModalRef.result = new Promise((resolve, reject) =>
        reject('someerror')
      );
      component.open('editPublisherModal' as any);
      tick();
      expect(component.closeResult).toBe('Dismissed');
    }));
  });

  describe('submit', () => {
    it('should call the service editPublisher method when a pre-existing publisher is selected', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      const publisher = mockData[0];
      component.selectedItem = publisher;
      component.open('editPublisherModal' as any, publisher);
      tick();
      component.submit();
    }));
  });
});

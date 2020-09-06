import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './../admin.service';
import { Genre } from 'src/app/common/interfaces';
import { Observable, of } from 'rxjs';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { GenresComponent } from './genres.component';

const mockData: Genre[] = [
  { id: 1, name: 'SciFi' },
  { id: 2, name: 'Fantasy' },
  { id: 3, name: 'Nonfiction' },
];

// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
  close(): void {}
}

class MockAdminService {
  data: Genre[] = mockData;

  getGenres(): Observable<Genre[]> {
    return of(this.data);
  }

  deleteGenre(id: number): Observable<{}> {
    this.data = this.data.filter((x) => x.id !== id);
    return of({});
  }

  editGenre(genre: Genre): Observable<Genre> {
    return of(genre);
  }
}

describe('GenresComponent', () => {
  let component: GenresComponent;
  let fixture: ComponentFixture<GenresComponent>;
  let modalService: NgbModal;
  let adminService: AdminService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenresComponent],
      imports: [NgbModule],
      providers: [
        GenresComponent,
        { provide: AdminService, useClass: MockAdminService },
      ],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(GenresComponent);
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
    it('should get genres', () => {
      component.fetchData();
      expect(component.genres).toEqual(mockData);
    });
  });

  describe('open', () => {
    it('should set selectedGenre correctly when opened with no Genre', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editGenreModal' as any);
      expect(component.selectedGenre.id).toBeNull();
      expect(component.selectedGenre.name).toEqual('');
    }));

    it('should set selectedGenre correctly when opened with an Genre', fakeAsync(() => {
      const genre: Genre = mockData[0];
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editGenreModal' as any, genre);
      expect(component.selectedGenre.id).toEqual(genre.id);
      expect(component.selectedGenre.name).toEqual(genre.name);
    }));

    it('should close a modal window', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      mockModalRef.result = new Promise((resolve, reject) =>
        reject('someerror')
      );
      component.open('editGenreModal' as any);
      tick();
      expect(component.closeResult).toBe('Dismissed');
    }));
  });

  describe('submit', () => {
    it('should call the service editGenre method when a pre-existing genre is selected', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      const genre = mockData[0];
      component.selectedGenre = genre;
      component.open('editGenreModal' as any, genre);
      tick();
      component.submit();
    }));
  });
});

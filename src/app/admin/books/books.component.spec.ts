import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './../admin.service';
import { Book } from 'src/app/common/interfaces/book.interface';
import { Observable, of } from 'rxjs';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { BooksComponent } from './books.component';
import { Author, Publisher, Genre } from 'src/app/common/interfaces';

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
    authors: mockAuthors,
    publisher: mockPublishers[0],
    genres: mockGenres,
  },
];

// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
  close(): void {}
}

class MockAdminService {
  authors: Author[] = mockAuthors;
  books: Book[] = mockBooks;
  genres: Genre[] = mockGenres;
  publishers: Publisher[] = mockPublishers;

  getBooks(): Observable<Book[]> {
    return of(this.books);
  }

  getAuthors(): Observable<Author[]> {
    return of(this.authors);
  }

  getPublishers(): Observable<Publisher[]> {
    return of(this.publishers);
  }

  getGenres(): Observable<Genre[]> {
    return of(this.genres);
  }

  deleteBook(id: number): Observable<{}> {
    this.books = this.books.filter((x) => x.id !== id);
    return of({});
  }

  editBook(book: Book): Observable<Book> {
    return of(book);
  }
}

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let modalService: NgbModal;
  let adminService: AdminService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BooksComponent],
      imports: [NgbModule],
      providers: [
        BooksComponent,
        { provide: AdminService, useClass: MockAdminService },
      ],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load components and call life cycle methods', () => {
    spyOn(component, 'fetchBooks');
    component.ngOnInit();

    expect(component.fetchBooks).toHaveBeenCalled();
  });

  describe('compare', () => {
    it('should return -1 when first item comes before second item', () => {
      const actual = component.compare('a', 'z');
      expect(actual).toBe(-1);
    });

    it('should return 1 when first item comes after second item', () => {
      const actual = component.compare('z', 'a');
      expect(actual).toBe(1);
    });

    it('should return 0 when items are the same', () => {
      const actual = component.compare('a', 'a');
      expect(actual).toBe(0);
    });
  });

  describe('fetchBooks', () => {
    it('should get books', () => {
      component.fetchBooks();
      expect(component.books).toEqual(mockBooks);
    });
  });

  describe('open', () => {
    it('should set selectedBook correctly when opened with no Book', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editBookModal' as any);
      expect(component.selectedBook.id).toBeNull();
      expect(component.selectedBook.title).toEqual('');
      expect(component.selectedBook.authors).toEqual([]);
      expect(component.selectedBook.genres).toEqual([]);
      expect(component.selectedBook.publisher).toBeNull();
    }));

    it('should set selectedBook correctly when opened with an Book', fakeAsync(() => {
      const book: Book = mockBooks[0];
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      component.open('editBookModal' as any, book);
      expect(component.selectedBook.id).toEqual(book.id);
      expect(component.selectedBook.title).toEqual(book.title);
      expect(component.selectedBook.authors).toEqual(book.authors);
      expect(component.selectedBook.genres).toEqual(book.genres);
      expect(component.selectedBook.publisher).toEqual(book.publisher);
    }));

    it('should close a modal window', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      mockModalRef.result = new Promise((resolve, reject) =>
        reject('someerror')
      );
      component.open('editBookModal' as any);
      tick();
    }));
  });

  describe('submit', () => {
    it('should call the service editBook method when a pre-existing book is selected', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
      const book = mockBooks[0];
      component.selectedBook = book;
      component.open('editBookModal' as any, book);
      tick();
      component.submit();
    }));
  });
});

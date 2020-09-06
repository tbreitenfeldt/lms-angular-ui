import { SortableDirective, SortEvent } from './../sortable.directive';
import { PagerService } from './../../common/services/pager.service';
import { AdminService } from './../admin.service';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Genre, Pager } from 'src/app/common/interfaces';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css'],
})
export class GenresComponent implements OnInit {
  private modalRef: NgbModalRef;
  genres: Genre[] = [];
  selectedGenre: Genre;
  errorMessage: string;
  closeResult: string;
  searchString = '';
  pager: Pager;
  pagedItems: Genre[];
  itemsPerPage = 5;
  arrows = { name: '' };

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private pagerService: PagerService
  ) {}

  onSort({ column, direction }: SortEvent) {
    console.log('Sorting...');
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.genres = this.sort(this.genres, column, direction);
    this.arrows[column] =
      direction === 'asc' ? '△' : direction === 'desc' ? '▽' : '';
    this.setPage(this.pager.currentPage);
  }

  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  sort(items: Genre[], column: string, direction: string): Genre[] {
    if (direction === '') {
      return items;
    } else {
      return [...items].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  open(content, genre?: Genre) {
    this.selectedGenre = genre ? genre : { id: null, name: '' };
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result) => {
        this.errorMessage = '';
        this.closeResult = `Closed with ${result}`;
      },
      (reason) => {
        this.errorMessage = `${reason}`;
        this.closeResult = `Dismissed`;
      }
    );
  }

  fetchData(): void {
    this.adminService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        console.log(this.genres);
        this.setPage(1);
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  submit() {
    if (this.selectedGenre.id) {
      this.adminService.editGenre(this.selectedGenre).subscribe({
        next: (_) => this.fetchData(),
        error: (err) => (this.errorMessage = err),
      });
    } else {
      this.adminService.addGenre(this.selectedGenre).subscribe({
        next: (_) => this.fetchData(),
        error: (err) => (this.errorMessage = err),
      });
    }

    this.modalRef.close();
  }

  deleteGenre(id: number) {
    this.modalRef = this.modalService.open(ConfirmComponent);
    this.modalRef.result.then(
      (result) => {
        this.adminService.deleteGenre(id).subscribe({
          next: (_) => this.fetchData(),
          error: (err) => console.log(err),
        });
      },
      (reason) => {
        console.log(`Dismissed with reason: ${reason}`);
      }
    );
  }

  setPage(page: number): void {
    this.pager = this.pagerService.getPager(
      this.genres.length,
      page,
      this.itemsPerPage
    );
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pagedItems = this.genres.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  ngOnInit(): void {
    this.fetchData();
  }
}

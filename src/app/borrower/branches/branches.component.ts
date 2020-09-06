import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { PagerService } from '../../common/services/pager.service';
import { Branch } from '../entity/branch';
import { Pager } from 'src/app/common/interfaces';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css'],
})
export class BranchesComponent implements OnInit {
  @Input() branches$;
  @Output('selectBranch') selectBranch: EventEmitter<any> = new EventEmitter();

  searchBranches$: Observable<Branch[]>;
  searchTerms$ = new Subject<string>();

  pagedBranches$ = new BehaviorSubject<Branch[]>([]);

  pager: Pager;
  itemsPerPage: number;

  constructor(private pagerSvc: PagerService) {
    this.itemsPerPage = 5;
  }

  ngOnInit(): void {
    this.branches$.subscribe((branches) => {
      this.setPage(1, branches);
      this.search('');
    });

    this.searchBranches$ = this.searchTerms$.pipe(
      debounceTime(300),
      switchMap((term: string) => this.searchBranches(term))
    );

    this.searchBranches$.subscribe((branches) => {
      this.setPage(this.pager.currentPage, branches);
    });
  }

  search(term: string): void {
    this.searchTerms$.next(term);
  }

  searchBranches(term: string): Observable<Branch[]> {
    if (!term.trim()) {
      return this.branches$;
    }
    return of(
      this.branches$
        .getValue()
        .filter(
          (branch) =>
            branch.name.includes(term) || branch.address.includes(term)
        )
    );
  }

  setPage(page: number, branches: Branch[]): void {
    this.pager = this.pagerSvc.getPager(
      branches.length,
      page,
      this.itemsPerPage
    );

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    this.pagedBranches$.next(
      branches.slice(this.pager.startIndex, this.pager.endIndex + 1)
    );
  }
}

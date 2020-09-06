import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { BranchService } from '../services/branch.service';
import { PagerService } from '../../common/services/pager.service';
import { Branch } from '../../common/interfaces/branch.interface';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css'],
})
export class BranchesComponent implements OnInit {
  selectedBranch: Branch;
  branches: Branch[];
  isLoading: boolean;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  totalItems: number;
  pager: any = {};
  pagedItems: any[];
  itemsPerPage = 5;

  constructor(
    public branchService: BranchService,
    private modalService: NgbModal,
    private pagerService: PagerService
  ) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): Observable<Branch[]> {
    this.isLoading = true;
    const observable = this.branchService.getBranches();
    observable.subscribe((data: Branch[]) => {
      this.branches = data;
      this.totalItems = data.length;
      this.setPage(1);
      this.isLoading = false;
    });
    return observable;
  }

  updateLibraryBranch(form: NgForm): Observable<Branch> {
    const observable = this.branchService.updateBranch(
      this.selectedBranch.id,
      form.value
    );
    observable.subscribe((data: Branch) => {
      this.modalRef.close();
      this.isLoading = false;
    });
    return observable;
  }

  open(content, branch: Branch): Promise<any> {
    this.selectedBranch = branch;
    this.modalRef = this.modalService.open(content);
    return this.modalRef.result.then(
      (result) => {
        this.errMsg = '';
        this.closeResult = `Closed with ${result}`;
      },
      (reason) => {
        this.errMsg = '';
        this.closeResult = `Dismissed`;
      }
    );
  }

  setPage(page: number): void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    const data = this.branches;
    this.pager = this.pagerService.getPager(
      data.length,
      page,
      this.itemsPerPage
    );
    this.pagedItems = data.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from '../../common/interfaces/branch.interface';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(
    private http: HttpClient,
    @Inject('domain') private domain: string
  ) {}

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.domain}/lms/librarian/branches`);
  }

  getBranch(id: number): Observable<Branch> {
    return this.http.get<Branch>(`${this.domain}/lms/librarian/branches/${id}`);
  }

  updateBranch(id: number, branch: Branch): Observable<Branch> {
    return this.http.put<Branch>(
      `${this.domain}/lms/librarian/branches/${id}`,
      branch
    );
  }
}

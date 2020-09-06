import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserRegistrationDetails } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  usersUrl: string;
  constructor(
    private http: HttpClient,
    @Inject('domain') private domain: string
  ) {
    this.usersUrl = this.domain + '/lms/users';
  }

  getAll() {
    return this.http.get<User[]>(this.usersUrl);
  }

  registerAdmin(user: UserRegistrationDetails) {
    return this.http.post(`${this.usersUrl}/register/admin`, user);
  }

  registerLibrarian(user: UserRegistrationDetails) {
    return this.http.post(`${this.usersUrl}/register/librarian`, user);
  }

  delete(id: number) {
    return this.http.delete(`${this.usersUrl}/${id}`);
  }
}

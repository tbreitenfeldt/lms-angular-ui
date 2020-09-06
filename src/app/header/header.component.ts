import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../common/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  adminToggleFlag = false;

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public showDropdown() {
    this.adminToggleFlag = !this.adminToggleFlag;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/common/services';
import { UserRegistrationDetails } from 'src/app/common/interfaces';

function roleValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return ['ROLE_ADMIN', 'ROLE_LIBRARIAN'].includes(control.value)
      ? { forbiddenName: { value: control.value } }
      : null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      role: ['', roleValidator],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log(this.registerForm.value);
      console.log('Form is invalid');
      return;
    }
    this.loading = true;

    const {
      role,
      firstName,
      lastName,
      email,
      password,
    } = this.registerForm.value;
    const newUser: UserRegistrationDetails = {
      firstName,
      lastName,
      email,
      password,
    };
    switch (role) {
      case 'ROLE_ADMIN':
        this.userService
          .registerAdmin(newUser)
          .pipe(first())
          .subscribe(
            (data) => {
              alert('Success!');
              this.router.navigate(['/admin']);
            },
            (error) => {
              this.loading = false;
              alert('Something went wrong...');
              console.log(error);
            }
          );
        break;
      case 'ROLE_LIBRARIAN':
        this.userService
          .registerLibrarian(newUser)
          .pipe(first())
          .subscribe(
            (data) => {
              alert('Success!');
              this.router.navigate(['/admin']);
            },
            (error) => {
              this.loading = false;
              alert('Something went wrong...');
              console.log(error);
            }
          );
        break;
      default:
        console.log(`Error: Selected role ${role} not recognized.`);
    }
  }
}

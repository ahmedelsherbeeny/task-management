import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  isLoading: boolean = false;

  // Login Form
  signUpForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  returnUrl!: string;
  subsribes: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]],

      password: ['', [Validators.required]],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/user/task-list';
  }

  get f() {
    return this.signUpForm.controls;
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.signUpForm.valid) return;

    this.isLoading = true;
    const data = this.signUpForm.getRawValue();

    this.authService.signUp(data).subscribe(
      ({ uuid, ...userData }) => {
        console.log('User UUID:', uuid); // Log the document UUID
        console.log('User data:', userData); // Log the user data after signup

        // Store UUID in local storage
        // localStorage.setItem('userUUID', uuid);
        if (uuid) {
          localStorage.setItem('userUUID', uuid);
          localStorage.setItem('userRole', userData.role);
          this.isLoading = false;
          this.router.navigate([this.returnUrl]);
        }
      },
      (error) => {
        console.error('Error signing up:', error);
        alert(error); // Alert the user with the error message
        this.isLoading = false;
      }
    );
  }
}

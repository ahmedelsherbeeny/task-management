import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;

  // Login Form
  loginForm!: FormGroup;
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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/user/task-list';
  }

  get f() {
    return this.loginForm.controls;
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.loginForm.valid) return;

    this.isLoading = true;
    let data = this.loginForm.getRawValue();

    this.authService.signIn(data.email, data.password).subscribe(
      (userData) => {
        if (userData) {
          localStorage.setItem('userUUID', userData.uuid);
          localStorage.setItem('userRole', userData.role);
          this.isLoading = false;

          if (userData.role === 'admin') {
            this.router.navigate(['/admin/user-management']);
          } else if (userData.role === 'manager') {
            this.router.navigate(['/manager/task-management']);
          } else if (userData.role === 'user') {
            this.router.navigate(['/user/task-list']);
          }
        } else {
          this.router.navigate(['/auth/login']);
        }
        console.log('User data after sign-in:', userData);
      },
      (error) => {
        console.error('Error signing in:', error);
        alert(error); // Alert the user with the error message
        this.isLoading = false;
      }
    );
  }
}

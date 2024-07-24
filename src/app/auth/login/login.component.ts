import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, Observable, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType = false;
  returnUrl = '/user/task-list';
  Loader = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public message: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.returnUrl;
  }

  get f() {
    return this.loginForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.Loader = true;
    const { email, password } = this.loginForm.value;

    const authSubscription: Subscription = this.authService.signIn(email, password).pipe(
      switchMap((userData: User) => {
        if (userData) {
          localStorage.setItem('userUUID', userData.uuid!);
          localStorage.setItem('userRole', userData.role!);

          this.message.toast("Logged In Successfully", "success");

          // Navigate based on user role
          const navigationRoute = userData.role === 'admin'
            ? '/admin/user-management'
            : userData.role === 'manager'
              ? '/manager/task-management'
              : '/user/task-list';
          this.router.navigate([navigationRoute]);
        } else {
          this.router.navigate(['/auth/login']);
        }
        return new Observable<void>(); // Dummy observable to complete the pipe
      }),
      catchError(error => {
        this.Loader = false;

        this.message.toast(error, "error");
        return new Observable<void>(); // Dummy observable to complete the pipe
      }),
      finalize(() => {
        this.Loader = false;
      })
    ).subscribe();

    this.subscriptions.push(authSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }
}

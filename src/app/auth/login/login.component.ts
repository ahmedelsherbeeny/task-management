import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  Loader: boolean = false;

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
    private authService: AuthService,
    public message: MessageService

  ) {}
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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

    this.Loader = true;
    let data = this.loginForm.getRawValue();

    this.authService.signIn(data.email, data.password).subscribe(
      (userData:User) => {
        if (userData) {
          JSON.stringify(localStorage.setItem('userUUID', userData.uuid!));
          localStorage.setItem('userRole', userData.role!);
          this.Loader = false;
          

          this.message.toast("Logged In Successfully", "success");


          if (userData.role === 'admin') {
            this.router.navigate(['/admin/user-management']);
          } else if (userData.role === 'manager') {
            this.router.navigate(['/manager/task-management']);
          } else if (userData.role === 'user') {
            this.router.navigate(['/user/task-list']);
          }
        } else {
          this.router.navigate(['/auth/login']);
          this.Loader = false;

        }
      },
      (error) => {
        this.Loader = false;
        this.message.toast(error, "error");
      }
    );
  }
}

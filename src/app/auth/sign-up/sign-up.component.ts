import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnDestroy {
  Loader: boolean = false;

  // Login Form
  signUpForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  returnUrl!: string;
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public message: MessageService

  ) {}
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      
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
    
    this.Loader = true;
    const data = this.signUpForm.getRawValue();
    
    const signUpSubscription: Subscription =this.authService.signUp(data).subscribe(
      ({ uuid, ...userData }) => {
        
        // localStorage.setItem('userUUID', uuid);
        if (uuid) {
          localStorage.setItem('userUUID', uuid);
          localStorage.setItem('userRole', userData.role);
          this.Loader = false;
          this.message.toast("Signed Up In Successfully", "success");
          
          this.router.navigate([this.returnUrl]);
        }
      },
      (error) => {
        this.Loader = false;
        this.message.toast(error, "error");
        
      }
    );
    this.subscriptions.push(signUpSubscription)
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }
}

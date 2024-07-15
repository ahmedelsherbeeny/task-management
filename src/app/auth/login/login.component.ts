import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;

  // Login Form
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  returnUrl!: string;
  subsribes: Subscription[] = [];

  constructor(    private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router,
  ){

  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";  }

    get f() {
      return this.loginForm.controls;
    }
    toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }

  onSubmit(){

  }

}

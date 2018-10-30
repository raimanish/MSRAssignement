import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder, private snotify: SnotifyService, private router: Router) { }
  loginForm: FormGroup;

  get getControls(){
    return this.loginForm.controls;
  }

  ngOnInit() {
    if(this.authenticationService.isUserAuthenticated() == true){
      this.router.navigate(['/']);
      this.snotify.success('Login', 'Already Logged In', {
        timeout: 5000,
        bodyMaxLength: 300,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
      });   
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  
  }

  loginUser(){
    if(this.loginForm.invalid){
      return
    }
    console.log(this.loginForm.value);
    this.authenticationService.loginUser(this.loginForm.value);
  }

    
  

}

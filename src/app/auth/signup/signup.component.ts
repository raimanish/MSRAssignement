import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { compareValidator } from '../../shared/directives/compare-validator.directive';
import { Router } from '@angular/router';
import { Snotify, SnotifyService } from 'ng-snotify';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor(private fb:FormBuilder, private auth:AuthenticationService, private router: Router, private snotify: SnotifyService) { }

  ngOnInit() {
    if(this.auth.isUserAuthenticated() == true){
      this.router.navigate(['/']);
      this.snotify.success('Login', 'Already Logged In', {
        timeout: 5000,
        bodyMaxLength: 300,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
      });   
    }
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['',[Validators.required, compareValidator('password')]],
      firstname: ['',Validators.required],
      lastname: ['', Validators.required],
      phone: [''], 
      role:['user']
    })
  }

  get getControls(){
    return this.signupForm.controls;
  }

  createUser(){
    console.log(this.signupForm.value);
    if(this.signupForm.invalid){
      return
    }

    this.auth.createUser(this.signupForm.value);
  }

  confirmPassword(form: FormGroup){
    let pass = this.signupForm.controls.password.value;
    let confirmPass = this.signupForm.controls.passConfirmation.value;
    if(pass === confirmPass){
      return null
    }
    else{
      return {'notSame': true}
    }
  }

}

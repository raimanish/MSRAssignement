import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import {User} from "../shared/models/user.model"
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit , OnDestroy{
  users: User[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 1;
  userIsAuthenticated = false;
  private userSub: Subscription;
  private authSub: Subscription;
  private authCountSub: Subscription;

  constructor(private auth: AuthenticationService) { 
  }

  pageChanged(page: number){
    console.log(page);
    this.currentPage = page;
    this.auth.getUsers(this.usersPerPage, this.currentPage);

  }

  ngOnInit() {
    this.userIsAuthenticated = this.auth.isUserAuthenticated();
    this.auth.getTotalUser();
    this.auth.getUsers(this.usersPerPage, this.currentPage);
    this.userSub = this.auth.getUserUpdatedListener().subscribe((userData: {users: User[]}) => {
			this.users = userData.users;
    });
    
    this.authSub = this.auth.getAuthStatusListener().subscribe(isUserAuthenticated => {
      this.userIsAuthenticated = isUserAuthenticated;
    })

    this.authCountSub = this.auth.getUserCountUpdatedListerner().subscribe(usersCount => {
        this.totalUsers = usersCount;
    })

  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.authSub.unsubscribe();
    this.authCountSub.unsubscribe();
  }

}

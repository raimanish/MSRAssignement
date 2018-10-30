import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userAuthenticated: boolean = false;
  public userRole = "";
  private authListenerSubs: Subscription;
  constructor(private auth: AuthenticationService) {
    console.log("contructor");
    console.log(this.userAuthenticated);
   }

  ngOnInit() {
    this.userAuthenticated = this.auth.isUserAuthenticated();
    this.userRole = this.auth.getUserRole();
    console.log("init");
    console.log(this.userAuthenticated);
    this.authListenerSubs = this.auth.getAuthStatusListener()
      .subscribe((isUserAuthenticated) =>{
        console.log('header');
        console.log(this.userAuthenticated);
        console.log(isUserAuthenticated);
        this.userAuthenticated = isUserAuthenticated;
        this.userRole = this.auth.getUserRole();
        console.log(this.userAuthenticated);
      })
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
    this.auth.logout();
  }

}

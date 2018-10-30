import { Component } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MSRassignement';
  constructor(private auth: AuthenticationService, snotify: SnotifyService){
    this.auth.autoAuthUser();
  }
}

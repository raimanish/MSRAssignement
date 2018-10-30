import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../shared/services/authentication.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

	constructor(private authService: AuthenticationService, private route: Router){}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
		const isAuth = this.authService.isUserAuthenticated();
		if(!isAuth){
			this.route.navigate(['/']);
		}
		return isAuth;
	}

}
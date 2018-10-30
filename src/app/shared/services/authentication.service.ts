import  { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {SnotifyService, SnotifyPosition} from 'ng-snotify';

import { User} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthenticationService{
	private isAuthenticated = false;
	private user: User;
	private usersCount = 0;
	private token: string;
	private tokenTimer: NodeJS.Timer;
	private authStatusListener = new Subject<boolean>();
	private users: User[] = []
	private userUpdated = new Subject<{users: User[]}>();
	private userCountUpdated = new Subject<Number>();
	constructor(private http: HttpClient, private router: Router, private snotify: SnotifyService){}



	getUsers(pagePerPage: Number, currentPage: number){
		const queryParams = `?pageSize=${pagePerPage}&page=${currentPage}`;
		this.http
      .get<{ success: Boolean, users: User[]}>(
        environment.apiUrl+'users/getUsers'+queryParams
      )
      .subscribe(response => {
        this.users = response.users;
        this.userUpdated.next({users: [...this.users]});
      });
	}

	getTotalUser(){
		this.http.get<{success: boolean, users: number}>(
        environment.apiUrl+'users/total_users'
      )
      .subscribe(response => {
        this.usersCount = response.users;
        this.userCountUpdated.next(this.usersCount);
      });
	}


	autoAuthUser(){
		let expiresIn;
		const authInformation = this.getAuthData();
		console.log(authInformation);
		if(authInformation){
			const now  = new Date();
			expiresIn = authInformation.expirationDate.getTime() - now.getTime();
		}
		else{
			expiresIn = -1;
		}
		if(expiresIn > 0){
			this.token = authInformation.token;
			this.isAuthenticated = true;
			this.user = JSON.parse(authInformation.user);
			this.authStatusListener.next(true);
			// setting the expiration time remaining
			this.setAuthTimer(expiresIn / 1000);
		}
	}
	

	createUser(userObj: User){
		const user: User = { firstname: userObj.firstname, lastname: userObj.lastname, phone: userObj.phone, email: userObj.email, password: userObj.password, role: userObj.role};
		this.http.post<{message: string, success: boolean}>(environment.apiUrl+'users/signup', user)
			.subscribe(response => {
				if(response.success == true){
					this.snotify.success('Signup', 'SignUpSucessfully', {
						timeout: 5000,
						bodyMaxLength: 300,
						showProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true
					});   
					this.router.navigate(['/']);

				}
				else{
					this.snotify.error('Signup', response.message, {
						timeout: 5000,
						bodyMaxLength: 300,
						showProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true
					});    				}
			}, error =>{

			});
	}


	loginUser(userObj: User){
		const user: User = {email: userObj.email, password: userObj.password};
		this.http.post<{message: string, token: string, user: User, expiresIn: number, success: boolean}>(environment.apiUrl+'users/login', user)
			.subscribe( response => {
				if(response.success == true){
					this.user = response.user;
					this.token = response.token;
					const expirationDuraton = response.expiresIn;
					this.isAuthenticated = true;
					this.setAuthTimer(expirationDuraton);
					this.authStatusListener.next(true);
					const now = new Date();
					const expirationDate = new Date(now.getTime() + expirationDuraton * 1000);
					this.saveAuthData(this.token, expirationDate, this.user);
					this.snotify.success('Login', 'Login Sucessfully', {
						timeout: 5000,
						bodyMaxLength: 300,
						showProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true
					});    
					this.router.navigate(['/']);   
				}
				else{
					this.router.navigate(['/login']);
					this.snotify.error('Login', response.message, {
						timeout: 5000,
						bodyMaxLength: 300,
						showProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true
					});    
				}
			}, error =>{

			});
	}

	logout(){
		this.user = null;
		this.tokenTimer = null;
		this.token = null;
		this.isAuthenticated = false;
		this.authStatusListener.next(false);
		this.removeAuthData();
		this.snotify.success('Logout', 'Log out Sucessfully', {
			timeout: 5000,
			bodyMaxLength: 300,
			showProgressBar: false,
			closeOnClick: false,
			pauseOnHover: true
		});   
		this.router.navigate(['/']);   
	}

	setAuthTimer(duration){
		this.tokenTimer = setTimeout(() => {
			this.logout();
		}, duration * 1000)
	}

	saveAuthData(token: string, expirationDate: Date, user: User){
		console.log("save data");
		console.log(token);
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('expirationDate', String(expirationDate));
	}

	removeAuthData(){
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('expirationDate')
	}

	getAuthData(){
		const token = localStorage.getItem('token');
		const expirationDate = localStorage.getItem('expirationDate');
		const user = localStorage.getItem('user');
		if(!token || !expirationDate || !user){
			return ;
		}
		else{
			return {token: token, expirationDate: new Date(expirationDate), user: user}
		}
	}


	getToken(){
		return this.token;
	}

	getUserId(){
		return this.user.id;
	}

	getUserRole(){
		if(this.user != undefined){
			return this.user.role;
		}
		else{
			return "";
		}
	}

	isUserAuthenticated(){
		console.log("auth");
		console.log(this.isAuthenticated);
		return this.isAuthenticated;
	}

	getAuthStatusListener(){
		return this.authStatusListener.asObservable();
	}


	getUserUpdatedListener(): Observable<any>{
		return this.userUpdated.asObservable();
	}


	getUserCountUpdatedListerner(): Observable<any>{
		return this.userCountUpdated.asObservable();
	}

}
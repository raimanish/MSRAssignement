import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'books', component: BookListComponent,  canActivate: [AuthGuard]}, 
  {path: 'book-create', component: BookCreateComponent,  canActivate: [AuthGuard]},
  {path: 'book-create/:bookId/edit',component: BookCreateComponent,  canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

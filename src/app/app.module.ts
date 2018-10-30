import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticationService } from './shared/services/authentication.service';
import { UsersComponent } from './users/users.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookService } from './shared/services/book.service';
import { BookListComponent } from './book-list/book-list.component';
import {NgxPaginationModule} from 'ngx-pagination'
import { FilterPipe} from './shared/custom-pipes/filter.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    UsersComponent,
    BookCreateComponent,
    BookListComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    SnotifyModule

  ],
  providers: [AuthenticationService,BookService, SnotifyService, { provide: 'SnotifyToastConfig', useValue: ToastDefaults}],
  bootstrap: [AppComponent]
})
export class AppModule { }

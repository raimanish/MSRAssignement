import { Component, OnInit, OnDestroy } from '@angular/core';
import {Book} from "../shared/models/book.model"
import { BookService } from '../shared/services/book.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit , OnDestroy{
  books: Book[] = [];
  totalBooks = 0;
  booksPerPage = 10;
  currentPage = 1;
  userRole = "";
  private bookSub: Subscription;
  private bookCountSub: Subscription;
  private authListenerSubs: Subscription;


  constructor(private bookService: BookService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.userRole = this.auth.getUserRole();
    this.bookService.getBooks(this.booksPerPage, this.currentPage);
    this.bookService.getTotalBooks();
    this.bookSub = this.bookService.getBookUpdateListener()
      .subscribe((bookData: {books: Book[]}) => {
        console.log("get updated reord");
        this.books = bookData.books;
      });
    this.authListenerSubs = this.auth.getAuthStatusListener()
      .subscribe((isUserAuthenticated) =>{
        this.userRole = this.auth.getUserRole();
      })

    this.bookCountSub = this.bookService.getBookCountUpdatedListener()
      .subscribe(bookCount => {
        this.totalBooks = bookCount;
        console.log("got total books");
        console.log(bookCount);
      })

  }

  pageChanged(page: number){
    console.log(page);
    this.currentPage = page;
    this.bookService.getBooks(this.booksPerPage, this.currentPage);

  }

  onDeleteBook(bookId: string){
    console.log("got bookId");
    console.log(bookId);
    this.bookService.deleteBook(bookId);
  }

  ngOnDestroy(){
    this.bookCountSub.unsubscribe();
    this.bookSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}

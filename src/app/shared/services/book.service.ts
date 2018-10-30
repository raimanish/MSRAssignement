import { Injectable } from "@angular/core";
import { Book } from "../models/book.model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators'
import { SnotifyService } from "ng-snotify";

@Injectable()
export class BookService{
    private books: Book[] = [];
    private bookCount = 0;
    private bookUpdated = new Subject<{books: Book[]}>();
    private bookCountUpdated = new Subject<number>();

    constructor(private http: HttpClient, private router: Router, private snotify: SnotifyService){

    }

    getBooks(pagePerPage: number, currentPage: number){
        console.log("get books caled");
        const queryParams = `?pageSize=${pagePerPage}&page=${currentPage}`;
        this.http
      .get<{ success: Boolean, books: Book[]}>(
        environment.apiUrl+"books"+queryParams
      )
      .pipe(map((bookData) => {
        return {
          success: bookData.success,
          books: bookData.books.map(book => {
            return {
              name: book.name,
              available: book.available,
              id: book._id, 
            };
          })
        };
      }))
      .subscribe(transformedBook => {
        if(transformedBook.success == true){
            console.log("getting record");
            this.books = transformedBook.books;
            console.log(this.books);
            this.bookUpdated.next({books: [...this.books]});
        }
        else{
            console.log("some error oocured");
        }
       
      });
    }

    getTotalBooks(){
        this.http.get<{ success: Boolean, books: number}>(environment.apiUrl+ "books/get_total_books")
        .subscribe(response => {
            this.bookCount = response.books;
            this.bookCountUpdated.next(this.bookCount);
        });
    }
    

    getBook(bookId: String){
        return this.http.get<{success: Boolean, book: Book}>(environment.apiUrl+"books/"+bookId)
    }

    addBook(bookObj: Book){
        const book:Book = {name: bookObj.name, available: bookObj.available};
        this.http.post<{success: Boolean ,message: string}>(environment.apiUrl+"books", book)
            .subscribe(responseData => {
                if(responseData.success == true){
                    this.router.navigate(["/books"])
                    this.snotify.success('Book', 'Added Sucessfully', {
                        timeout: 5000,
                        bodyMaxLength: 300,
                        showProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true
                    });   
                }
                else{
                    console.log(responseData);
                    this.snotify.error('Book', responseData.message, {
                        timeout: 5000,
                        bodyMaxLength: 300,
                        showProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true
                    });  
                }
            });
    }


    updateBook(bookId: string,bookObj: Book){
        const book: Book = {id: bookId, name: bookObj.name, available: bookObj.available };
        this.http.put<{success: Boolean, message: string}>(environment.apiUrl+"books/" + bookId, book)
        .subscribe((result) => {
            if(result.success == true){
                this.router.navigate(["/books"]);
                this.snotify.success('Book', 'Updated Sucessfully', {
                    timeout: 5000,
                    bodyMaxLength: 300,
                    showProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true
                });  
            }
            else{
                console.log("error occured");
                this.snotify.error('Book', result.message, {
                    timeout: 5000,
                    bodyMaxLength: 300,
                    showProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true
                });  
            }
            
        });
    }

    deleteBook(bookId: string){
        this.http.delete<{success: Boolean, message: string}>(environment.apiUrl+"books/"+bookId)
            .subscribe(response => {
                if(response.success == true){
                    const booksUpdated = this.books.filter(book => book.id !== bookId);
                    this.books = booksUpdated;
                    this.bookUpdated.next({books: [...this.books]});
                    this.snotify.success('Book', 'Deleted Sucessfully', {
                        timeout: 5000,
                        bodyMaxLength: 300,
                        showProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true
                    });  
                }
                else{
                    console.log(response);
                    console.log("error occured");
                    this.snotify.error('Book', response.message, {
                        timeout: 5000,
                        bodyMaxLength: 300,
                        showProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true
                    });  
                }
            })
    }


    getBookUpdateListener(): Observable<any>{
        return this.bookUpdated.asObservable();
    }

    getBookCountUpdatedListener(): Observable<any>{
        return this.bookCountUpdated.asObservable();
    }

}
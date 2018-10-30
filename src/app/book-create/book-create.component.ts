import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookService } from '../shared/services/book.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Book } from '../shared/models/book.model';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  form: FormGroup;
  book: Book;
  private mode = 'create';
  private bookId = 'edit'
  
  constructor(private bookService: BookService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required]}),
      available: new FormControl(null, {validators: [Validators.required]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
			if(paramMap.has('bookId')){
				this.mode = 'edit';
				this.bookId = paramMap.get('bookId');
				this.bookService.getBook(this.bookId).subscribe(book => {
          console.log(book.book);
          this.book = {id: book.book.id, name: book.book.name, available: book.book.available};
					// we are initializing the fom control, required in case of edit the form
					this.form.setValue({name: this.book.name, available: this.book.available});
				});
			}else{
				this.mode = 'create';
				this.bookId = null;
			}
		});
  }

  onSaveBook(){
    if(this.form.invalid){
      return;
    }
    console.log(this.form.value);
    if(this.mode == 'create'){
      this.bookService.addBook(this.form.value);
    }
    else{
      this.bookService.updateBook(this.bookId, this.form.value);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../shared/book';
import { BookService } from '../../core/services/books.service';

@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.component.html',
  styleUrls: ['./authors-list.component.css']
})
export class AuthorsListComponent implements OnInit {

  public books$: Observable<Book[]>;

  constructor(private bookService: BookService) { }

  ngOnInit() {
    // this.books$ = this.bookService.getBooks();
  }

}

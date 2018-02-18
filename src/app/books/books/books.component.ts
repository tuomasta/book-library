import {Book} from '../../shared/book';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  public selectedBook: Book;
  constructor() { }

  ngOnInit() {
  }

  openBookDetails(book: Book) {
    this.selectedBook = book;
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../shared/book';
import { BookService } from '../../core/services/books.service';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import 'rxjs/add/observable/empty';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  public books$: Observable<Book[]>;
  public searchText: string;
  public pageNumber = 0;
  public pages = 0;
  public pageSize = 5;

  private pageChanged = new BehaviorSubject<number>(this.pageNumber);
  private searchChanged = new BehaviorSubject<string>('');

  constructor(private bookService: BookService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.books$ = this.searchChanged
                  .debounceTime(50)
                  .distinctUntilChanged()
                  .combineLatest(this.pageChanged, (search, page) => ({ page: page, search: search }))
                  .combineLatest(this.route.url, (change, url) => change)
                  .switchMap(change => this.bookService.getBooks(change.page, this.pageSize, change.search))
                  .map(result => {
                    this.pages = result.numberOfItems;
                    return result.data;
                  });
  }

  removeBook(book: Book, event: any): void {
    event.stopPropagation();
    this.bookService.deleteBook(book.id).subscribe(_ => {
      // if removed book is the selected book then go back to book list
      const currentId = this.route.snapshot.firstChild && +this.route.snapshot.firstChild.paramMap.get('id');
      if (book.id === currentId) { this.router.navigate(['/books']); }

      // trigger new query by resetting the page number
      this.pageChanged.next(this.pageNumber);
    });
  }

  trackBooks(index: number, book: Book): number {
    return book.id;
  }

  changePage(page: PageEvent): void {
    this.pageNumber = page.pageIndex;
    this.pageChanged.next(page.pageIndex);
  }

  searchBook(search: string): void {
    this.searchText = search;
    this.searchChanged.next(search);
  }
}

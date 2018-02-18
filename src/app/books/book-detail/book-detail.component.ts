import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Book } from '../../shared/book';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../core/services/books.service';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Author } from '../../shared/author';
import { AuthorsService } from '../../core/services/authors.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit, OnDestroy {
  public authors: Author[];
  public book: Book;
  public loadingError: string;
  public form = new FormGroup({
    'title': new FormControl('', [Validators.required, Validators.maxLength(140)]),
    'authorId': new FormControl('', [Validators.required, value => this.authors && this.authors.find(author => author.id === +value)]),
    'publisher': new FormControl('', [Validators.required]),
    'year': new FormControl('', [Validators.required])
  });

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookService,
    private authorsService: AuthorsService) { }

  ngOnInit() {
    this.subscription = this.route.paramMap
    .switchMap(map => this.bookService.getBook(+map.get('id')).catch(err => {
      this.loadingError = err;
      return Observable.of(undefined);
    }))
    .subscribe(book => {
      if (book) { this.loadingError = undefined; }
      this.book = book;
      this.form.reset(book);
    });

    this.authorsService.getAuthors().subscribe(authors => this.authors = authors);
  }

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  save(): void {
    if (this.form.invalid) {
      const controls = Object.values(this.form.controls);
      controls.forEach(c => c.markAsDirty());
      return;
    }
    const newBook = {
      ... this.book,
      ... this.form.value
    } as Book;
    this.bookService.updateBook(newBook).subscribe(() => this.navigateToBooks());
  }

  cancel(): void {
    this.navigateToBooks();
  }

  private navigateToBooks(): void {
    this.router.navigate(['/books']);
  }
}

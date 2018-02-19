import { Component, OnInit, OnDestroy } from '@angular/core';
import { Author, AuthorWithBooks } from '../../shared/author';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../core/services/books.service';
import { AuthorsService } from '../../core/services/authors.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.css']
})
export class AuthorDetailsComponent implements OnInit, OnDestroy {
  public author: AuthorWithBooks;
  public loadingError: string;
  public form = new FormGroup({
    'name': new FormControl('', [Validators.required]),
    'yearOfBirth': new FormControl('', [Validators.required])
  });

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authorsService: AuthorsService) { }

  ngOnInit() {
    this.subscription = this.route.paramMap
    .switchMap(map => this.authorsService.getAuthor(+map.get('id')).catch(err => {
      this.loadingError = err;
      return Observable.of(undefined);
    }))
    .subscribe(author => {
      if (author) { this.loadingError = undefined; }
      this.author = author;
      this.form.reset(author);
    });
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
    const newAuthor = {
      ... this.author,
      ... this.form.value
    } as Author;
    this.authorsService.updateAuthor(newAuthor).subscribe(() => this.navigateToAuthors());
  }

  cancel(): void {
    this.navigateToAuthors();
  }

  private navigateToAuthors(): void {
    this.router.navigate(['/authors']);
  }
}

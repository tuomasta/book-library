import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthorsListComponent } from './authors-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BookService } from '../../core/services/books.service';
import { AuthorsService } from '../../core/services/authors.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Author } from '../../shared/author';
import { Book } from '../../shared/book';

describe('AuthorsListComponent', () => {
  let component: AuthorsListComponent;
  let fixture: ComponentFixture<AuthorsListComponent>;
  let book;
  let authors;

  beforeEach(async(() => {
    authors = {
      data: [{name: 'mike', id: 1}, {name: 'jake', id: 2} ] as Author[]
    };

    book = {title: 'foo', id: 1, publisher: 'bar', authorId: 1, year: 100} as Book;
    const mockBookService = {
      getBook: id => Observable.of(book),
      updateBook: b => Observable.of({})
    } as BookService;

    const mockAuthorService = {
      getAuthors: (page, search) => Observable.of(authors),
    } as AuthorsService;

    const mockRouter = {} as Router;

    const mockRoute = {
      url: Observable.of({}),
      snapshot: {}
    } as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: BookService, useValue: mockBookService},
        { provide: AuthorsService, useValue: mockAuthorService},
        { provide: Router, useValue: mockRouter},
        { provide: ActivatedRoute, useValue: mockRoute}],
      declarations: [ AuthorsListComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AuthorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // wait for debounce time
    tick(100);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();

    const view = fixture.debugElement.nativeElement;

    expect(view.querySelector('[data-test-authors-list-author="1"]').textContent).toContain('mike');
    expect(view.querySelector('[data-test-authors-list-author="2"]').textContent).toContain('jake');
  });
});

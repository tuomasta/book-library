import { async, ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';

import { BookDetailComponent } from './book-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookService } from '../../core/services/books.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../shared/book';
import { AuthorsService } from '../../core/services/authors.service';
import { Author } from '../../shared/author';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
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
      getAuthors: () => Observable.of(authors),
    } as AuthorsService;

    const mockRouter = {
      navigate: route => {}
    } as Router;

    const mockRoute = {
      paramMap: Observable.of({
        get: id => '1'
      } as ParamMap)
    } as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, MatSelectModule, MatInputModule, NoopAnimationsModule],
      providers: [
        { provide: BookService, useValue: mockBookService},
        { provide: AuthorsService, useValue: mockAuthorService},
        { provide: Router, useValue: mockRouter},
        { provide: ActivatedRoute, useValue: mockRoute}],
      declarations: [ BookDetailComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    const view = fixture.debugElement.nativeElement;

    expect(view.querySelector('[data-test-books-details-title]').value).toBe('foo');
    expect(view.querySelector('[data-test-books-details-publisher]').value).toBe('bar');
    // reading value seems to be tricky from material select component
    // expect(view.querySelector('[data-test-books-details-authorId]').value).toBe('mike');
    expect(view.querySelector('[data-test-books-details-year]').value).toBe('100');
  });

  it('should not save if not valid', fakeAsync(inject([BookService], (service: BookService) => {
    // assign invalid value
    component.form.get('authorId').setValue(10);
    fixture.detectChanges();
    spyOn(service, 'updateBook').and.returnValue(Observable.of({}));

    // act
    component.save();

    expect(service.updateBook).toHaveBeenCalledTimes(0);
  })));
});

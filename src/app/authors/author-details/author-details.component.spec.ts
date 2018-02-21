import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorDetailsComponent } from './author-details.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BookService } from '../../core/services/books.service';
import { AuthorsService } from '../../core/services/authors.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Author, AuthorWithBooks } from '../../shared/author';

describe('AuthorDetailsComponent', () => {
  let component: AuthorDetailsComponent;
  let fixture: ComponentFixture<AuthorDetailsComponent>;
  let author;

  beforeEach(async(() => {
    author = {name: 'mike', id: 1, books: [], yearOfBirth: 10} as AuthorWithBooks;

    const mockAuthorService = {
      getAuthor: id => Observable.of(author),
      updateAuthor: a => Observable.of({})
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
      imports: [ReactiveFormsModule, CommonModule],
      providers: [
        { provide: AuthorsService, useValue: mockAuthorService},
        { provide: Router, useValue: mockRouter},
        { provide: ActivatedRoute, useValue: mockRoute}],
      declarations: [ AuthorDetailsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    const view = fixture.debugElement.nativeElement;

    expect(view.querySelector('[data-test-author-details-name]').value).toBe('mike');
    expect(view.querySelector('[data-test-author-details-year]').value).toBe('10');
    });
});

import {Book} from '../../shared/book';
import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';

import { BookListComponent } from './book-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookService } from '../../core/services/books.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { PageEvent } from '@angular/material';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let books;

  beforeEach(async(() => {
    books = {
      numberOfItems: 2,
      data: [
      { title: 'foo', id: 1 },
      { title: 'bar', id: 2 }] as Book[]
    };
    const mockBookService = {
      getBooks: (page, size, search) => Observable.of(books),
      deleteBook: id => Observable.of({})
    } as BookService;
    const mockRouter = {} as Router;
    const mockRoute = {
      url: Observable.of({}),
      snapshot: {}
    } as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: BookService, useValue: mockBookService},
        { provide: Router, useValue: mockRouter},
        { provide: ActivatedRoute, useValue: mockRoute}],
      declarations: [ BookListComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // wait for debounce time
    tick(100);
    fixture.detectChanges();
  }));

  it('should render', () => {
    expect(component).toBeTruthy();
    const view = fixture.debugElement.nativeElement;

    expect(view.querySelector('[data-test-books-list-book="1"]').textContent).toContain('foo');
    expect(view.querySelector('[data-test-books-list-book="2"]').textContent).toContain('bar');
  });

  it('should re-render after search change', fakeAsync(inject([BookService], (service: BookService) => {
    books.data = [{
      title: 'foo', id: 1
    }] as Book[];
    books.numberOfItems = 1;

    spyOn(service, 'getBooks').and.returnValue(Observable.of(books));

    // act
    component.searchBook('f');
    component.searchBook('foo');
    tick(100);
    fixture.detectChanges();

    // assert
    const view = fixture.debugElement.nativeElement;
    expect(view.querySelector('[data-test-books-list-book="1"]').textContent).toContain('foo');
    expect(view.querySelector('[data-test-books-list-book="2"]')).toBeNull();
    expect(service.getBooks).toHaveBeenCalledWith(0, 5, 'foo');
    expect(service.getBooks).toHaveBeenCalledTimes(1);
  })));

  it('should re-render after page change', fakeAsync(inject([BookService], (service: BookService) => {
    books.data = [{
      title: 'baz', id: 3
    }] as Book[];
    books.numberOfItems = 6;

    spyOn(service, 'getBooks').and.returnValue(Observable.of(books));

    // act
    component.changePage({ pageIndex: 1} as PageEvent);
    fixture.detectChanges();

    // assert
    const view = fixture.debugElement.nativeElement;
    expect(view.querySelector('[data-test-books-list-book="3"]').textContent).toContain('baz');
    expect(view.querySelector('[data-test-books-list-book="1"]')).toBeNull();
    expect(view.querySelector('[data-test-books-list-book="2"]')).toBeNull();
    expect(service.getBooks).toHaveBeenCalledWith(1, 5, '');
    expect(service.getBooks).toHaveBeenCalledTimes(1);
  })));

  it('should re-render after remove change', fakeAsync(inject([BookService], (service: BookService) => {
    const bookToDelete = books.data[1];

    books.data = [{
      title: 'foo', id: 1
    }] as Book[];
    books.numberOfItems = 1;

    spyOn(service, 'getBooks').and.returnValue(Observable.of(books));
    spyOn(service, 'deleteBook').and.returnValue(Observable.of({}));

    // act
    component.removeBook(bookToDelete, { stopPropagation: () => {}});
    fixture.detectChanges();

    // assert
    const view = fixture.debugElement.nativeElement;
    expect(view.querySelector('[data-test-books-list-book="1"]').textContent).toContain('foo');
    expect(service.getBooks).toHaveBeenCalledWith(0, 5, '');
    expect(service.getBooks).toHaveBeenCalledTimes(1);
    expect(service.deleteBook).toHaveBeenCalledWith(2);
  })));
});

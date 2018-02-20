import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../../shared/book';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/merge';

import { Observable } from 'rxjs/Observable';
import { GetResult } from '../../shared/get-result';
import { HttpParams } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BookService {
    readonly books = 'books';
    constructor(private httpClient: HttpClient) { }

    getBooks(page: number, booksPerPage: number, search: string): Observable<GetResult<Book>> {
        let params = new HttpParams();
        if (search) { params = params.set('title', search); }

        return this.httpClient.get<Book[]>(`app/${this.books}`, { params: params })
        .map(books => {
            // this should actually happen on a server
            const startIndex = page * booksPerPage;
            return {
                numberOfItems: books.length,
                data: books.slice(startIndex, Math.min(startIndex + booksPerPage, books.length))
            };
        });
    }

    getBooksByAuthorId(authorId: number): Observable<Book[]> {
        const params = new HttpParams().set('authorId', authorId.toString());
        return this.httpClient.get<Book[]>(`app/${this.books}`, { params: params });
    }

    deleteBooksByAuthorId(authorId: number): Observable<Book> {
        // should happen in back end using some more efficient way such as message bus
        return this.getBooksByAuthorId(authorId)
            .switchMap(books => {
                if (books.length === 0) { return Observable.of(undefined); }
                return Observable.merge(books.map(book => this.deleteBook(book.id))).mergeMap(obs => obs);
            });
    }

    getBook(id: number) {
        return this.httpClient.get<Book>(`app/${this.books}/${id}`);
    }

    deleteBook(id: number) {
        return this.httpClient.delete<Book>(`app/${this.books}/${id}`);
    }

    updateBook(book: Book) {
        return this.httpClient.put<Book>(`app/${this.books}`, book, httpOptions);
    }
}

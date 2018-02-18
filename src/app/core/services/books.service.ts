import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../../shared/book';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { BooksResult } from '../../shared/books-result';
import { HttpParams } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BookService {
    readonly books = 'books';
    constructor(private httpClient: HttpClient) { }

    getBooks(page: number, booksPerPage: number, search: string): Observable<BooksResult> {
        let params = new HttpParams();
        if (search) { params = params.set('title', search); }

        return this.httpClient.get<Book[]>(`app/${this.books}`, { params: params })
        .map(books => {
            // this should actually happen on a server
            const startIndex = (page - 1) * booksPerPage;
            return {
                numberOfItems: books.length,
                data: books.slice(startIndex, startIndex + booksPerPage)
            };
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
